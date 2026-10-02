export type TxType = "buy" | "sell" | "wallet";

export type MarketData = {
  price: string;
  marketCap: string;
  liquidity: string;
  volume24h: string;
  holders: string;
};

export type ChainTransaction = {
  id: string;
  type: TxType;
  wallet: string;
  amount: string;
  timestamp: string;
};

export type OfflineResult = { status: "offline" };
export type ErrorResult = { status: "error"; message: string };
export type MarketResult =
  | OfflineResult
  | ErrorResult
  | { status: "ok"; data: MarketData };
export type TransactionResult =
  | OfflineResult
  | ErrorResult
  | { status: "ok"; data: ChainTransaction[] };

export type ChainSnapshot =
  | OfflineResult
  | ErrorResult
  | { status: "ok"; market: MarketData; transactions: ChainTransaction[] };
