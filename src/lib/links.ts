const UNSET = new Set([
  "",
  "YOUR_CONTRACT_ADDRESS",
  "YOUR_NETWORK",
  "YOUR_TRADE_URL",
  "YOUR_X_URL",
  "YOUR_COMMUNITY_URL",
  "YOUR_TOTAL_SUPPLY",
  "YOUR_SITE_URL",
]);

export function isConfigured(value: string | undefined | null) {
  if (!value) return false;
  return !UNSET.has(value.trim());
}

export function httpUrl(value: string | undefined | null) {
  if (!isConfigured(value) || !value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.toString();
  } catch {
    return null;
  }
}
