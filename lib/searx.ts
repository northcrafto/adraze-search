/**
 * Motorn bakom AdRaze Search: SearXNG på doxing, nådd genom Cloudflare-tunneln.
 *
 * Bara servern pratar med motorn. Besökaren ser aldrig adressen, och motorn
 * ser aldrig besökaren: varje sökning kommer från den här serverns adress,
 * utan kakor, utan användaragent från besökaren, utan hänvisning.
 */
const BASE = process.env.SEARX_URL ?? "https://sok-api.skribia.com";
const ACCESS_ID = process.env.CF_ACCESS_CLIENT_ID ?? "";
const ACCESS_SECRET = process.env.CF_ACCESS_CLIENT_SECRET ?? "";

function headers(): Record<string, string> {
  const h: Record<string, string> = { Accept: "application/json" };
  if (ACCESS_ID && ACCESS_SECRET) {
    h["CF-Access-Client-Id"] = ACCESS_ID;
    h["CF-Access-Client-Secret"] = ACCESS_SECRET;
  }
  return h;
}

export type Cat = "general" | "images" | "videos" | "news";

export type Result = {
  url: string;
  title: string;
  content?: string;
  engines?: string[];
  img_src?: string;
  thumbnail_src?: string;
  thumbnail?: string;
  publishedDate?: string | null;
  length?: string;
};

export type SearchResponse = {
  query: string;
  results: Result[];
  suggestions: string[];
  number_of_results: number;
  infoboxes?: { infobox: string; content?: string; urls?: { title: string; url: string }[]; img_src?: string }[];
  answers?: (string | { answer: string })[];
};

export async function search(q: string, opts: { cat?: Cat; page?: number; lang?: string; safe?: 0 | 1 | 2 } = {}): Promise<SearchResponse | null> {
  const params = new URLSearchParams({
    q,
    format: "json",
    categories: opts.cat ?? "general",
    pageno: String(opts.page ?? 1),
    language: opts.lang ?? "auto",
    safesearch: String(opts.safe ?? 1),
  });
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 9000);
    const res = await fetch(`${BASE}/search?${params}`, { headers: headers(), cache: "no-store", signal: ctrl.signal });
    clearTimeout(t);
    if (!res.ok) return null;
    return (await res.json()) as SearchResponse;
  } catch {
    return null;
  }
}

export async function suggest(q: string): Promise<string[]> {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 2500);
    const res = await fetch(`${BASE}/autocompleter?q=${encodeURIComponent(q)}&language=sv-SE`, { headers: headers(), cache: "no-store", signal: ctrl.signal });
    clearTimeout(t);
    if (!res.ok) return [];
    const data = (await res.json()) as unknown;
    const list = Array.isArray(data) && Array.isArray(data[1]) ? (data[1] as unknown[]) : [];
    return list.filter((s): s is string => typeof s === "string").slice(0, 8);
  } catch {
    return [];
  }
}

export function host(u: string) {
  try {
    return new URL(u).hostname.replace(/^www\./, "");
  } catch {
    return u;
  }
}
