/**
 * Project configuration.
 * Change token and community details here, or override them with
 * NEXT_PUBLIC_* environment variables at build time.
 * Do not put private API keys in this file.
 */

function pub(value: string | undefined, fallback: string) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : fallback;
}

export const project = {
  name: "NOBRAIN",
  symbol: "NOBRAIN",
  tagline: "The world's least intelligent AI.",
  contractAddress: pub(
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    "YOUR_CONTRACT_ADDRESS",
  ),
  network: pub(process.env.NEXT_PUBLIC_NETWORK, "YOUR_NETWORK"),
  totalSupply: pub(process.env.NEXT_PUBLIC_TOTAL_SUPPLY, "YOUR_TOTAL_SUPPLY"),
  tradeUrl: pub(process.env.NEXT_PUBLIC_TRADE_URL, "YOUR_TRADE_URL"),
  xUrl: pub(process.env.NEXT_PUBLIC_X_URL, "YOUR_X_URL"),
  communityUrl: pub(process.env.NEXT_PUBLIC_COMMUNITY_URL, "YOUR_COMMUNITY_URL"),
  siteUrl: pub(process.env.NEXT_PUBLIC_SITE_URL, "YOUR_SITE_URL"),
} as const;

export const siteTitle = "NOBRAIN — The World's Least Intelligent AI";
export const siteDescription =
  "Meet NOBRAIN, an AI with one small problem: it doesn't have a brain.";

export function getMetadataBase() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (raw) {
    try {
      return new URL(raw);
    } catch {
      /* fall through */
    }
  }
  return new URL("http://localhost:43123");
}
