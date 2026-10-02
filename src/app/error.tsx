"use client";

import { Action } from "@/components/ui/action";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="grid min-h-[100svh] place-items-center px-6 text-center">
      <div>
        <p className="font-mono text-[0.68rem] tracking-[0.28em] text-mute">THOUGHT FAILED</p>
        <h1 className="mt-4 font-display text-5xl font-bold tracking-[-0.05em]">SOMETHING SLIPPED.</h1>
        <p className="mt-4 text-paper/70">The page lost the thread. The brain was already missing.</p>
        <Action className="mt-8" onClick={() => reset()}>
          TRY AGAIN
        </Action>
      </div>
    </main>
  );
}
