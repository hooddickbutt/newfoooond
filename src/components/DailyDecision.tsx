"use client";

import { useMemo } from "react";
import { SectionHeading } from "@/components/SectionHeading";
import { Action } from "@/components/ui/action";
import { decisionFor } from "@/lib/decisions";
import { requestMeme } from "@/lib/meme/prefill";
import { openXShare } from "@/lib/share";
import { playSound } from "@/lib/sound";

export function DailyDecision() {
  const today = useMemo(() => decisionFor(new Date()), []);

  return (
    <section id="day" className="scroll-mt-20 border-t border-paper/10 px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading index="02  /  DAILY" title="NOBRAIN of the day">
          Every day, one absurd decision. The same one for everyone, until tomorrow.
        </SectionHeading>

        <div data-cursor="card" className="border border-paper/15 px-5 py-8 sm:px-10 sm:py-14">
          <p className="font-mono text-[0.68rem] tracking-[0.28em] text-signal">
            TODAY&apos;S DECISION
          </p>
          <p className="mt-6 max-w-4xl font-display text-[clamp(1.8rem,5vw,4.2rem)] leading-[0.95] font-bold tracking-[-0.04em] text-paper uppercase">
            “{today.decision}”
          </p>
          <p className="mt-8 font-mono text-sm text-paper/80">{today.reaction}</p>
          <p className="mt-3 font-mono text-[0.68rem] tracking-[0.16em] text-mute">
            {today.timestamp}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Action
              onClick={() => {
                playSound("click");
                openXShare(
                  `NOBRAIN's decision today: "${today.decision}"\n\n${today.reaction}`,
                );
              }}
            >
              SHARE THE CHAOS
            </Action>
            <Action
              tone="line"
              onClick={() => {
                playSound("click");
                requestMeme({
                  top: today.decision,
                  bottom: today.reaction,
                  template: "decision",
                });
              }}
            >
              MAKE A MEME
            </Action>
          </div>
        </div>
      </div>
    </section>
  );
}
