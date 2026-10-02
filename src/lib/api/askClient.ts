import type { Answer } from "@/lib/answers";

export async function askNobrain(question: string): Promise<Answer> {
  const response = await fetch("/api/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });
  if (!response.ok) {
    throw new Error("Ask failed");
  }
  return response.json() as Promise<Answer>;
}
