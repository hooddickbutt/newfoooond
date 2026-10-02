import "server-only";

import type {
  ChainSnapshot,
  ChainTransaction,
  MarketData,
  TxType,
} from "@/lib/blockchain/types";

type Cache = { at: number; body: ChainSnapshot };
let cache: Cache | null = null;

function asDisplay(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed) return trimmed.slice(0, 80);
  }
  return null;
}

function asType(value: unknown): TxType | null {
  if (value === "buy" || value === "sell" || value === "wallet") return value;
  return null;
}

function readMarket(payload: Record<string, unknown>): MarketData | null {
  const price = asDisplay(payload.price);
  const marketCap = asDisplay(payload.marketCap);
  const liquidity = asDisplay(payload.liquidity);
  const volume24h = asDisplay(payload.volume24h);
  const holders = asDisplay(payload.holders);
  if (!price || !marketCap || !liquidity || !volume24h || !holders) return null;
  return { price, marketCap, liquidity, volume24h, holders };
}

function readTransactions(payload: Record<string, unknown>): ChainTransaction[] {
  if (!Array.isArray(payload.transactions)) return [];
  const rows: ChainTransaction[] = [];
  for (const item of payload.transactions) {
    if (!item || typeof item !== "object") continue;
    const row = item as Record<string, unknown>;
    const id = asDisplay(row.id);
    const type = asType(row.type);
    const wallet = asDisplay(row.wallet);
    const amount = asDisplay(row.amount);
    const timestamp = asDisplay(row.timestamp);
    if (!id || !type || !wallet || !amount || !timestamp) continue;
    rows.push({ id, type, wallet, amount, timestamp });
    if (rows.length >= 24) break;
  }
  return rows;
}

export async function getChainSnapshot(): Promise<ChainSnapshot> {
  const endpoint = process.env.BLOCKCHAIN_API_URL?.trim();
  if (!endpoint) return { status: "offline" };

  if (cache && Date.now() - cache.at < 8000) return cache.body;

  const key = process.env.BLOCKCHAIN_API_KEY?.trim();
  try {
    const response = await fetch(endpoint, {
      headers: {
        Accept: "application/json",
        ...(key ? { Authorization: `Bearer ${key}` } : {}),
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const body: ChainSnapshot = {
        status: "error",
        message: `The data source returned ${response.status}.`,
      };
      cache = { at: Date.now(), body };
      return body;
    }

    const json: unknown = await response.json();
    if (!json || typeof json !== "object") {
      const body: ChainSnapshot = {
        status: "error",
        message: "The data source returned an unreadable payload.",
      };
      cache = { at: Date.now(), body };
      return body;
    }

    const payload = json as Record<string, unknown>;
    const market = readMarket(payload);
    if (!market) {
      const body: ChainSnapshot = {
        status: "error",
        message:
          "Connected, but price, market cap, liquidity, volume, and holders were not all present.",
      };
      cache = { at: Date.now(), body };
      return body;
    }

    const body: ChainSnapshot = {
      status: "ok",
      market,
      transactions: readTransactions(payload),
    };
    cache = { at: Date.now(), body };
    return body;
  } catch {
    const body: ChainSnapshot = {
      status: "error",
      message: "The data source could not be reached.",
    };
    cache = { at: Date.now(), body };
    return body;
  }
}
