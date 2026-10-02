import { demoMemes } from "@/data/community";

export async function GET() {
  const endpoint = process.env.COMMUNITY_API_URL?.trim();
  if (!endpoint) {
    return Response.json(
      { source: "demo", posts: demoMemes },
      { headers: { "cache-control": "no-store" } },
    );
  }

  const key = process.env.COMMUNITY_API_KEY?.trim();
  try {
    const response = await fetch(endpoint, {
      headers: {
        Accept: "application/json",
        ...(key ? { Authorization: `Bearer ${key}` } : {}),
      },
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Community source failed");
    const json: unknown = await response.json();
    if (
      !json ||
      typeof json !== "object" ||
      !("posts" in json) ||
      !Array.isArray(json.posts)
    ) {
      throw new Error("Community payload was not a post list");
    }
    return Response.json(
      { source: "remote", posts: json.posts },
      { headers: { "cache-control": "no-store" } },
    );
  } catch {
    return Response.json(
      { source: "demo", posts: demoMemes },
      { headers: { "cache-control": "no-store" } },
    );
  }
}
