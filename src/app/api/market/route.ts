import { getChainSnapshot } from "@/lib/blockchain/server";

export async function GET() {
  const snapshot = await getChainSnapshot();
  if (snapshot.status !== "ok") {
    return Response.json(snapshot, {
      headers: { "cache-control": "no-store" },
    });
  }
  return Response.json(
    { status: "ok", data: snapshot.market },
    { headers: { "cache-control": "no-store" } },
  );
}
