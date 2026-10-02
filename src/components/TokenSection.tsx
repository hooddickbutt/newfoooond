"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { SectionHeading } from "@/components/SectionHeading";
import { Action } from "@/components/ui/action";
import { project } from "@/config/project";
import { fetchMarket } from "@/lib/blockchain/client";
import type { MarketResult } from "@/lib/blockchain/types";
import { httpUrl, isConfigured } from "@/lib/links";
import { playSound } from "@/lib/sound";

const metrics = [
  { key: "price", label: "PRICE" },
  { key: "marketCap", label: "MARKET CAP" },
  { key: "liquidity", label: "LIQUIDITY" },
  { key: "volume24h", label: "VOLUME" },
  { key: "holders", label: "HOLDERS" },
] as const;

export function TokenSection() {
  const [copied, setCopied] = useState(false);
  const [market, setMarket] = useState<MarketResult | { status: "loading" }>({
    status: "loading",
  });
  const trade = httpUrl(project.tradeUrl);
  const x = httpUrl(project.xUrl);
  const community = httpUrl(project.communityUrl);

  useEffect(() => {
    let cancel = false;
    fetchMarket()
      .then((result) => {
        if (!cancel) setMarket(result);
      })
      .catch(() => {
        if (!cancel) {
          setMarket({ status: "error", message: "Could not reach the data service." });
        }
      });
    return () => {
      cancel = true;
    };
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(project.contractAddress);
      setCopied(true);
      playSound("click");
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  const rows = [
    { label: "Token", value: project.name, configured: true },
    { label: "Symbol", value: project.symbol, configured: true },
    { label: "Network", value: project.network, configured: isConfigured(project.network) },
    { label: "Total supply", value: project.totalSupply, configured: isConfigured(project.totalSupply) },
  ];

  return (
    <section id="token" className="scroll-mt-20 border-t border-paper/10 px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading index="05  /  TOKEN" title="The token">
          Names and links live in one config file. Nothing here is invented market data.
        </SectionHeading>

        <div className="border border-paper/15">
          {rows.map((row) => (
            <div key={row.label} className="grid gap-1 border-b border-paper/10 px-4 py-4 sm:grid-cols-[180px_1fr] sm:items-center sm:px-6">
              <p className="font-mono text-[0.66rem] tracking-[0.18em] text-mute uppercase">{row.label}</p>
              <p className="flex flex-wrap items-center gap-3 font-mono text-sm text-paper sm:text-base">
                <span className="break-all">{row.value}</span>
                {!row.configured ? <Badge>NOT CONFIGURED</Badge> : null}
              </p>
            </div>
          ))}

          <div className={`grid gap-3 border-b border-paper/10 px-4 py-4 sm:grid-cols-[180px_1fr] sm:items-center sm:px-6 ${copied ? "bg-paper text-ink" : ""}`}>
            <p className={`font-mono text-[0.66rem] tracking-[0.18em] uppercase ${copied ? "text-ink/70" : "text-mute"}`}>
              Contract
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-mono text-sm break-all sm:text-base">
                {project.contractAddress}
                {!isConfigured(project.contractAddress) ? (
                  <Badge className={copied ? "border-ink/30 text-ink" : ""}>NOT CONFIGURED</Badge>
                ) : null}
              </p>
              <button
                type="button"
                onClick={() => void copy()}
                data-cursor="button"
                className={`inline-flex h-11 items-center justify-center gap-2 border px-4 font-mono text-[0.66rem] tracking-[0.16em] ${
                  copied ? "border-ink text-ink" : "border-paper/30 text-paper hover:border-paper"
                }`}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? "COPIED" : "COPY"}
              </button>
            </div>
          </div>

          <div className="grid gap-4 px-4 py-5 sm:px-6">
            <div className="flex flex-col gap-3 sm:flex-row">
              <Action href={trade ?? "#token"} external={Boolean(trade)}>
                TRADE
              </Action>
              <Action tone="line" href={x ?? "#community"} external={Boolean(x)}>
                X
              </Action>
              <Action tone="line" href={community ?? "#community"} external={Boolean(community)}>
                COMMUNITY
              </Action>
            </div>
            {!trade ? (
              <p className="font-mono text-[0.68rem] tracking-[0.12em] text-mute">
                TRADE destination is not configured.
              </p>
            ) : null}
          </div>
        </div>

        <div className="mt-8 border border-paper/15 p-5 sm:p-6">
          <p className="font-mono text-[0.66rem] tracking-[0.22em] text-mute">CHAIN READOUT</p>
          {market.status === "loading" ? (
            <p className="mt-4 font-mono text-sm text-paper">CHECKING CONNECTION...</p>
          ) : null}
          {market.status === "offline" ? (
            <p className="mt-4 font-display text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
              DATA CONNECTION OFFLINE
            </p>
          ) : null}
          {market.status === "error" ? (
            <p className="mt-4 font-mono text-sm text-paper" role="alert">
              {market.message}
            </p>
          ) : null}
          {market.status === "ok" ? (
            <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {metrics.map((metric) => (
                <div key={metric.key}>
                  <dt className="font-mono text-[0.62rem] tracking-[0.16em] text-mute">{metric.label}</dt>
                  <dd className="mt-1 font-mono text-sm text-paper break-all">{market.data[metric.key]}</dd>
                </div>
              ))}
            </dl>
          ) : null}
          <p className="mt-4 font-mono text-[0.62rem] tracking-[0.12em] text-paper/40">
            Supply above is a project label, not a live chain reading.
          </p>
        </div>
      </div>
    </section>
  );
}

function Badge({ children, className = "" }: { children: string; className?: string }) {
  return (
    <span className={`ml-2 inline-flex border border-paper/25 px-1.5 py-0.5 align-middle font-mono text-[0.58rem] tracking-[0.14em] ${className}`}>
      {children}
    </span>
  );
}
