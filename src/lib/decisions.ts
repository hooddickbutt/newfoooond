import { decisions, type DailyDecision } from "@/data/decisions";

export type TodayDecision = DailyDecision & {
  date: string;
  timestamp: string;
};

function hashString(input: string) {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function decisionFor(date = new Date()): TodayDecision {
  const key = date.toISOString().slice(0, 10);
  const item = decisions[hashString(key) % decisions.length];
  const hour = hashString(`${key}:h`) % 24;
  const minute = hashString(`${key}:m`) % 60;
  const timestamp = `${key} ${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")} UTC`;
  return { ...item, date: key, timestamp };
}
