"use client";

import { useEffect, useState } from "react";
import { SectionHeading } from "@/components/SectionHeading";
import { Action } from "@/components/ui/action";
import { fetchTransactions } from "@/lib/blockchain/client";
import type { TransactionResult } from "@/lib/blockchain/types";

const labels = {
  buy: "BUY detected",
  sell: "SELL detected",
  wallet: "WALLET activity detected",
} as const;

export function TransactionFeed() {
  const [result, setResult] = useState<TransactionResult | { status: "loading" }>({
    status: "loading",
  });

  const load = (announceLoading: boolean) => {
    if (announceLoading) setResult({ status: "loading" });
    fetchTransactions()
      .then(setResult)
      .catch(() =>
        setResult({ status: "error", message: "Could not reach the data service." }),
      );
  };

  useEffect(() => {
    let cancel = false;
    fetchTransactions()
      .then((next) => {
        if (!cancel) setResult(next);
      })
      .catch(() => {
        if (!cancel) {
          setResult({ status: "error", message: "Could not reach the data service." });
        }
      });
    return () => {
      cancel = true;
    };
  }, []);

  return (
    <section id="watch" className="scroll-mt-20 border-t border-paper/10 px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading index="06  /  WATCH" title="NOBRAIN is watching">
          Recent transfers show up here only when a real data source is connected. Nothing in this window is simulated.
        </SectionHeading>

        <div data-cursor="terminal" className="border border-paper/15 bg-[#0b0b0d]">
          <div className="flex items-center justify-between border-b border-paper/10 px-4 py-3">
            <p className="font-mono text-[0.68rem] tracking-[0.2em] text-mute">NETWORK FEED</p>
            <Action tone="quiet" className="h-9 w-auto px-0" onClick={() => load(true)}>
              RETRY
            </Action>
          </div>
          <div className="min-h-48 px-4 py-5 font-mono text-sm" aria-live="polite">
            {result.status === "loading" ? <p className="text-mute">CHECKING CONNECTION...</p> : null}
            {result.status === "offline" ? (
              <p className="text-paper">
                WAITING FOR REAL NETWORK DATA...
                <span className="caret" aria-hidden="true" />
              </p>
            ) : null}
            {result.status === "error" ? (
              <p role="alert" className="text-paper">
                {result.message}
              </p>
            ) : null}
            {result.status === "ok" && result.data.length === 0 ? (
              <p className="text-paper">Connected. No transactions were returned.</p>
            ) : null}
            {result.status === "ok" && result.data.length > 0 ? (
              <ul className="space-y-3">
                {result.data.map((tx) => (
                  <li key={tx.id} className="grid gap-1 border-b border-paper/10 pb-3 sm:grid-cols-[180px_1fr_auto]">
                    <span className="text-signal">{labels[tx.type]}</span>
                    <span className="break-all text-paper">{tx.wallet}</span>
                    <span className="text-mute">
                      {tx.amount} · {tx.timestamp}
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
