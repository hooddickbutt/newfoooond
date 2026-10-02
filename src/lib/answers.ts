import { buckets, patterns, type ResponseCategory } from "@/data/responses";

export type Answer = {
  text: string;
  category: ResponseCategory | "pattern";
  source: "local" | "remote";
};

function pick<T>(items: readonly T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

export function answerLocally(question: string): Answer {
  const q = question.trim();

  for (const pattern of patterns) {
    if (pattern.test.test(q)) {
      return {
        text: pick(pattern.lines),
        category: pattern.category,
        source: "local",
      };
    }
  }

  const lower = q.toLowerCase();
  let best: (typeof buckets)[number] | null = null;
  let bestScore = 0;

  for (const bucket of buckets) {
    if (bucket.id === "random") continue;
    let score = 0;
    for (const word of bucket.keywords) {
      if (lower.includes(word)) score += 1;
    }
    if (score > bestScore) {
      best = bucket;
      bestScore = score;
    }
  }

  if (!best) {
    const fallback = Math.random() > 0.45
      ? buckets.find((bucket) => bucket.id === "existential")
      : buckets.find((bucket) => bucket.id === "random");
    best = fallback ?? buckets[buckets.length - 1];
  }

  return {
    text: pick(best.lines),
    category: best.id,
    source: "local",
  };
}
