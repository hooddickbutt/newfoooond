import "server-only";

const SYSTEM = `You are NOBRAIN, a fictional meme character known as the world's least intelligent AI. You are not a financial advisor, trading bot, or investment product. Reply in one or two short sentences. Be dry, absurd, and harmless. Never invent statistics, holders, volume, partnerships, or prices. Never give buy/sell instructions, price targets, or guarantees. If asked for financial advice, admit you have no brain.`;

export async function askRemote(question: string): Promise<string | null> {
  const endpoint = process.env.NOBRAIN_AI_API_URL?.trim();
  if (!endpoint) return null;

  const key = process.env.NOBRAIN_AI_API_KEY?.trim();
  const model = process.env.NOBRAIN_AI_MODEL?.trim();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);

  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(key ? { Authorization: `Bearer ${key}` } : {}),
    };

    const body = model
      ? {
          model,
          temperature: 0.9,
          max_tokens: 80,
          messages: [
            { role: "system", content: SYSTEM },
            { role: "user", content: question },
          ],
        }
      : { question };

    const response = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      signal: controller.signal,
      cache: "no-store",
    });
    if (!response.ok) return null;

    const json: unknown = await response.json();
    if (!json || typeof json !== "object") return null;
    const record = json as {
      text?: unknown;
      choices?: { message?: { content?: unknown } }[];
    };
    const fromChoice = record.choices?.[0]?.message?.content;
    const text = typeof record.text === "string" ? record.text : fromChoice;
    if (typeof text !== "string") return null;
    const trimmed = text.trim().replace(/\s+/g, " ");
    if (!trimmed) return null;
    return trimmed.slice(0, 280);
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
