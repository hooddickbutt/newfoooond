import type { MarketResult, TransactionResult } from "@/lib/blockchain/types";

async function read<T>(path: string): Promise<T> {
  const response = await fetch(path, { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Request failed");
  }
  return response.json() as Promise<T>;
}

export function fetchMarket() {
  return read<MarketResult>("/api/market");
}

export function fetchTransactions() {
  return read<TransactionResult>("/api/transactions");
}
