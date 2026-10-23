import { NextResponse } from "next/server";
import { suggest } from "@/lib/searx";

/** OpenSearch-förslag: ["fråga", ["förslag", …]]. Samma form som Google och
    DuckDuckGo använder, så webbläsare kan koppla in den direkt. */
export async function GET(req: Request) {
  const q = (new URL(req.url).searchParams.get("q") ?? "").trim().slice(0, 200);
  if (!q) return NextResponse.json([q, []]);
  const list = await suggest(q);
  return NextResponse.json([q, list], { headers: { "Cache-Control": "no-store" } });
}
