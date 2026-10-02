"use client";

import { useEffect, useState } from "react";
import { BrainCharacter } from "@/components/character/BrainCharacter";
import { Particles } from "@/components/Particles";
import { Action } from "@/components/ui/action";
import { project } from "@/config/project";
import { httpUrl } from "@/lib/links";
import { playSound } from "@/lib/sound";

const statuses = [
  "SYSTEM STATUS: CONFUSED",
  "THINKING...",
  "THOUGHT FAILED",
  "BRAIN NOT FOUND",
  "PROCESSING NOTHING",
  "CONFIDENCE: MISPLACED",
  "MOTOR FUNCTION: SHRUG",
  "RETRYING EXISTENCE",
];

export function Hero() {
  const [status, setStatus] = useState(0);
  const [line, setLine] = useState<string | null>(null);
  const trade = httpUrl(project.tradeUrl);
  const x = httpUrl(project.xUrl);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setStatus((value) => (value + 1) % statuses.length);
    }, 3200);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!line) return;
    const timer = window.setTimeout(() => setLine(null), 5200);
    return () => window.clearTimeout(timer);
  }, [line]);

  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-4 pt-20 pb-10">
      <Particles />
      <div className="hero-grid pointer-events-none absolute inset-0" aria-hidden="true" />
      <p className="pointer-events-none absolute top-24 left-4 hidden font-mono text-[0.65rem] tracking-[0.35em] text-paper/25 [writing-mode:vertical-rl] xl:block">
        BRAIN NOT FOUND — DO NOT REBOOT
      </p>

      <div className="relative z-10 flex w-full max-w-5xl flex-col items-center text-center">
        <p className="font-mono text-[0.68rem] tracking-[0.32em] text-mute">
          SYS // EMPTY LABORATORY
        </p>
        <h1 className="mt-3 max-w-full font-display text-[clamp(2.7rem,12.5vw,8.4rem)] leading-[0.82] font-black tracking-[-0.06em] text-paper">
          NOBRAIN
        </h1>

        <BrainCharacter
          interactive
          className="mt-2"
          onReaction={setLine}
        />

        <p
          role="status"
          aria-live="assertive"
          className="mt-3 min-h-6 max-w-md font-mono text-sm text-signal"
        >
          {line ? `“${line}”` : ""}
        </p>

        <p className="mt-2 max-w-[16rem] font-display text-[0.72rem] leading-relaxed font-medium tracking-[0.16em] text-paper uppercase sm:max-w-none sm:text-sm sm:tracking-[0.28em]">
          The world&apos;s least intelligent AI.
        </p>

        <p
          aria-live="polite"
          className="mt-4 flex items-center gap-2 font-mono text-[0.68rem] tracking-[0.22em] text-paper/80"
        >
          <span className="status-dot" aria-hidden="true" />
          {statuses[status]}
        </p>

        <div className="mt-7 flex w-full max-w-md flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center">
          <Action href="#ask" onClick={() => playSound("click")}>
            ASK NOBRAIN
          </Action>
          <Action href="#day" tone="line" onClick={() => playSound("click")}>
            ENTER THE CHAOS
          </Action>
        </div>

        <div className="mt-4 flex items-center justify-center gap-2">
          <Action
            tone="quiet"
            href={x ?? "#community"}
            external={Boolean(x)}
            aria-label={x ? "NOBRAIN on X" : "X link is not configured"}
            className="w-auto"
          >
            X
          </Action>
          <span className="text-paper/25" aria-hidden="true">
            /
          </span>
          <Action
            tone="quiet"
            href={trade ?? "#token"}
            external={Boolean(trade)}
            aria-label={
              trade ? "Trade NOBRAIN" : "Trade link is not configured. View the token section."
            }
            className="w-auto"
          >
            TRADE
          </Action>
        </div>
      </div>
    </section>
  );
}
