import type { DemoMeme } from "@/data/community";

export type CommunityPayload = {
  source: "demo" | "remote";
  posts: DemoMeme[];
};

export async function fetchCommunity(): Promise<CommunityPayload> {
  const response = await fetch("/api/community", { cache: "no-store" });
  if (!response.ok) throw new Error("Community request failed");
  return response.json() as Promise<CommunityPayload>;
}
