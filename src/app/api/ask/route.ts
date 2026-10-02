import { answerLocally } from "@/lib/answers";
import { askRemote } from "@/lib/api/remoteAsk";

const hits = new Map<string, { count: number; at: number }>();

function limited(ip: string) {
  const now = Date.now();
  const row = hits.get(ip);
  if (!row || now - row.at > 60_000) {
    hits.set(ip, { count: 1, at: now });
    return false;
  }
  row.count += 1;
  return row.count > 30;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (limited(ip)) {
    return Response.json({ error: "Slow down." }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object" || !("question" in body)) {
    return Response.json({ error: "Missing question." }, { status: 400 });
  }
  if (typeof body.question !== "string") {
    return Response.json({ error: "Missing question." }, { status: 400 });
  }

  const question = body.question.trim().slice(0, 240);
  if (!question) {
    return Response.json({ error: "Empty question." }, { status: 400 });
  }

  const remote = await askRemote(question);
  if (remote) {
    return Response.json({
      text: remote,
      category: "remote",
      source: "remote",
    });
  }

  return Response.json(answerLocally(question));
}
