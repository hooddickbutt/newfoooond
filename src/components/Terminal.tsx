"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { SectionHeading } from "@/components/SectionHeading";
import { Input } from "@/components/ui/input";
import { ambientLines, bootLines } from "@/data/terminal";
import { prefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { requestMeme } from "@/lib/meme/prefill";
import { playSound } from "@/lib/sound";
import { runCommand } from "@/lib/terminal";

type Row = { id: number; text: string };

export function Terminal() {
  const [rows, setRows] = useState<Row[]>([]);
  const [value, setValue] = useState("");
  const idRef = useRef(0);
  const scroller = useRef<HTMLDivElement>(null);

  const push = (text: string) => {
    idRef.current += 1;
    setRows((current) => [...current.slice(-60), { id: idRef.current, text }]);
  };

  useEffect(() => {
    let cancel = false;
    const reduced = prefersReducedMotion();
    if (reduced) {
      bootLines.forEach((line) => push(line));
      return;
    }
    let index = 0;
    const timer = window.setInterval(() => {
      if (cancel) return;
      if (index >= bootLines.length) {
        window.clearInterval(timer);
        return;
      }
      push(bootLines[index]);
      playSound("terminal");
      index += 1;
    }, 420);
    return () => {
      cancel = true;
      window.clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const timer = window.setInterval(() => {
      const line = ambientLines[Math.floor(Math.random() * ambientLines.length)];
      push(line);
    }, 7000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const node = scroller.current;
    if (!node) return;
    node.scrollTop = node.scrollHeight;
  }, [rows]);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const typed = value;
    setValue("");
    if (!typed.trim()) return;
    push(`> ${typed}`);
    const result = runCommand(typed);
    playSound("terminal");
    if (result.action === "clear") {
      setRows([]);
      return;
    }
    result.lines.forEach((line) => push(line));
    if (result.action === "meme") requestMeme({});
  };

  return (
    <section id="terminal" className="scroll-mt-20 border-t border-paper/10 px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading index="07  /  OS" title="NOBRAIN terminal">
          A local joke shell. Not a wallet. Not a network connection.
        </SectionHeading>
        <div data-cursor="terminal" className="border border-paper/15 bg-[#0b0b0d]">
          <div className="border-b border-paper/10 px-4 py-3 font-mono text-[0.68rem] tracking-[0.22em] text-paper">
            NOBRAIN_OS
          </div>
          <div ref={scroller} className="h-72 overflow-y-auto px-4 py-4 font-mono text-sm leading-relaxed sm:h-80" aria-live="polite">
            {rows.map((row) => (
              <p key={row.id} className="text-paper/90">
                {row.text}
              </p>
            ))}
            <p className="text-mute">
              <span className="caret" aria-hidden="true" />
            </p>
          </div>
          <form onSubmit={onSubmit} className="flex items-center gap-2 border-t border-paper/10 px-3 py-3">
            <label htmlFor="nobrain-os" className="font-mono text-mute">
              &gt;
            </label>
            <Input
              id="nobrain-os"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              placeholder="help"
              aria-label="Terminal command"
              className="h-11 rounded-none border-0 bg-transparent px-1 font-mono text-base text-paper shadow-none placeholder:text-mute focus-visible:ring-0"
            />
          </form>
        </div>
      </div>
    </section>
  );
}
