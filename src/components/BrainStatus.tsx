"use client";

import { useEffect, useState } from "react";
import { SectionHeading } from "@/components/SectionHeading";

const intelligence = ["ERROR", "NULL", "???", "NO"];
const memory = ["1 KB", "2 KB", "3 KB", "4 KB", "3 KB", "FULL"];
const decisions = ["QUESTIONABLE", "REGRETTABLE", "ACCIDENTAL", "UNREVIEWED"];

export function BrainStatus() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setTick((value) => value + 1), 900);
    return () => window.clearInterval(timer);
  }, []);

  const modules = [
    { label: "BRAIN STATUS", value: tick % 9 === 0 ? "1%" : "0%", note: "FICTION" },
    { label: "INTELLIGENCE", value: intelligence[tick % intelligence.length], note: "UNMEASURED" },
    { label: "COMMON SENSE", value: tick % 7 === 0 ? "STILL NOT FOUND" : "NOT FOUND", note: "ABSENT" },
    { label: "MEMORY", value: memory[tick % memory.length], note: "DRAMATIC" },
    { label: "THOUGHTS", value: "LOADING...", note: "FOREVER" },
    { label: "DECISIONS", value: decisions[tick % decisions.length], note: "UNRELIABLE" },
  ];

  return (
    <section id="status" className="scroll-mt-20 border-t border-paper/10 px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading index="04  /  STATUS" title="Live brain status">
          A fictional instrument panel. These are not measurements, telemetry, or signs of a working mind.
        </SectionHeading>

        <div
          data-cursor="card"
          className="grid min-w-0 grid-cols-1 gap-px border border-paper/15 bg-paper/15 sm:grid-cols-2 lg:grid-cols-3"
          aria-label="Fictional NOBRAIN instrument panel"
        >
          {modules.map((module) => (
            <article key={module.label} className="min-w-0 bg-ink px-5 py-6">
              <p className="font-mono text-[0.66rem] tracking-[0.18em] text-mute">{module.label}</p>
              <p className="mt-4 font-display text-[clamp(1.7rem,7vw,3rem)] leading-none font-bold tracking-[-0.04em] break-words text-paper">
                {module.value}
              </p>
              {module.label === "THOUGHTS" ? (
                <div className="mt-5 h-px w-full bg-paper/15" aria-hidden="true">
                  <div className="thought-bar h-px bg-signal" />
                </div>
              ) : null}
              <p className="mt-4 font-mono text-[0.62rem] tracking-[0.18em] text-paper/45">
                {module.note}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
