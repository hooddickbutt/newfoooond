"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { SectionHeading } from "@/components/SectionHeading";
import { Action } from "@/components/ui/action";
import { Input } from "@/components/ui/input";
import type { Answer } from "@/lib/answers";
import { askNobrain } from "@/lib/api/askClient";
import { prefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { openXShare } from "@/lib/share";
import { playSound } from "@/lib/sound";

const prompts = [
  "Should I buy?",
  "What is your roadmap?",
  "Are you intelligent?",
  "What's your strategy?",
  "What is the point?",
  "Who are you?",
];

const steps = ["ANALYZING...", "THINKING...", "THOUGHT LOST..."];

type LogLine = { id: number; kind: "user" | "sys" | "nobrain"; text: string };

export function AskNobrain() {
  const [question, setQuestion] = useState("");
  const [lines, setLines] = useState<LogLine[]>([]);
  const [busy, setBusy] = useState(false);
  const [last, setLast] = useState<{ q: string; a: string } | null>(null);
  const idRef = useRef(0);
  const runRef = useRef(0);
  const logRef = useRef<HTMLDivElement>(null);

  const push = (kind: LogLine["kind"], text: string) => {
    idRef.current += 1;
    setLines((current) => [...current.slice(-18), { id: idRef.current, kind, text }]);
  };

  useEffect(() => {
    const node = logRef.current;
    if (!node) return;
    node.scrollTop = node.scrollHeight;
  }, [lines]);

  const ask = async (raw: string) => {
    const q = raw.trim();
    if (!q || busy) return;
    const run = runRef.current + 1;
    runRef.current = run;
    setBusy(true);
    setQuestion("");
    push("user", q);
    playSound("terminal");

    const reduced = prefersReducedMotion();
    for (const step of steps) {
      if (runRef.current !== run) return;
      push("sys", step);
      if (!reduced) await wait(620);
    }

    let answer: Answer;
    try {
      answer = await askNobrain(q);
    } catch {
      const local = await import("@/lib/answers");
      answer = local.answerLocally(q);
    }
    if (runRef.current !== run) return;
    push("nobrain", answer.text);
    setLast({ q, a: answer.text });
    setBusy(false);
    playSound("react");
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    void ask(question);
  };

  return (
    <section id="ask" className="scroll-mt-20 border-t border-paper/10 px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <div>
          <SectionHeading index="01  /  ASK" title="Ask NOBRAIN">
            <p>Ask anything.</p>
            <p>Get absolutely nowhere.</p>
          </SectionHeading>
          <div className="flex flex-wrap gap-2">
            {prompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                data-cursor="button"
                disabled={busy}
                onClick={() => void ask(prompt)}
                className="border border-paper/20 px-3 py-2 text-left font-mono text-[0.68rem] tracking-[0.08em] text-paper/80 hover:border-paper hover:text-paper disabled:opacity-40"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        <div
          data-cursor="terminal"
          className="border border-paper/15 bg-[#0b0b0d]"
        >
          <div className="flex items-center justify-between border-b border-paper/10 px-4 py-3">
            <p className="font-mono text-[0.68rem] tracking-[0.22em] text-mute">
              ASK // SESSION
            </p>
            <span className="status-dot" aria-hidden="true" />
          </div>
          <div
            ref={logRef}
            className="h-[320px] space-y-3 overflow-y-auto px-4 py-4 sm:h-[380px]"
            aria-live="polite"
          >
            {lines.length === 0 ? (
              <p className="font-mono text-sm text-mute">
                NOBRAIN is listening. This will not help.
                <span className="caret" aria-hidden="true" />
              </p>
            ) : (
              lines.map((line) => (
                <p key={line.id} className="font-mono text-sm leading-relaxed">
                  <span className={line.kind === "nobrain" ? "text-signal" : "text-mute"}>
                    {line.kind === "user" ? "YOU" : line.kind === "nobrain" ? "NOBRAIN" : "SYS"}
                    {" > "}
                  </span>
                  <span className="text-paper">{line.text}</span>
                </p>
              ))
            )}
          </div>
          <form onSubmit={onSubmit} className="flex flex-col gap-3 border-t border-paper/10 p-3 sm:flex-row">
            <label className="sr-only" htmlFor="ask-nobrain">
              Ask NOBRAIN anything
            </label>
            <Input
              id="ask-nobrain"
              value={question}
              maxLength={240}
              disabled={busy}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Type a question"
              className="h-12 rounded-none border-paper/20 bg-transparent px-3 font-mono text-base text-paper placeholder:text-mute focus-visible:border-signal focus-visible:ring-0"
            />
            <Action type="submit" disabled={busy} className="sm:w-auto">
              {busy ? "WAIT" : "ASK"}
            </Action>
          </form>
          {last ? (
            <div className="border-t border-paper/10 px-3 py-3">
              <Action
                tone="quiet"
                className="w-auto"
                onClick={() => {
                  playSound("click");
                  openXShare(
                    `I asked NOBRAIN: "${last.q}"\n\nIt said: "${last.a}"`,
                  );
                }}
              >
                POST THIS
              </Action>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}
