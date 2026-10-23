import { sign } from "@/lib/img";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 6 * 1024 * 1024;
const BLOCKED_HOST = /^(localhost|.*\.local|.*\.internal|127\.|10\.|0\.|169\.254\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|\[?::1\]?$|\[?fc|\[?fd|\[?fe80)/i;

/**
 * Blind bildproxy. Tar bara signerade adresser (se lib/img.ts), hämtar med
 * kort tidsgräns, släpper bara igenom bilder och loggar ingenting. Svaret
 * cachas vid kanten så samma bild inte hämtas om och om igen.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const u = searchParams.get("u") ?? "";
  const s = searchParams.get("s") ?? "";
  if (!u || !s || sign(u) !== s) return new Response(null, { status: 403 });

  let target: URL;
  try { target = new URL(u); } catch { return new Response(null, { status: 400 }); }
  if (!/^https?:$/.test(target.protocol) || BLOCKED_HOST.test(target.hostname)) return new Response(null, { status: 400 });

  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), 6000);
  try {
    const up = await fetch(target, {
      signal: ac.signal,
      redirect: "follow",
      headers: { "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/150 Safari/537.36", Accept: "image/avif,image/webp,image/*,*/*;q=0.8" },
      cache: "no-store",
    });
    if (!up.ok || !up.body) return new Response(null, { status: 404 });
    const type = up.headers.get("content-type") ?? "";
    if (!/^image\//i.test(type)) return new Response(null, { status: 415 });
    const len = Number(up.headers.get("content-length") ?? 0);
    if (len > MAX_BYTES) return new Response(null, { status: 413 });

    // Strömma vidare med ett tak på storleken.
    let total = 0;
    const limited = up.body.pipeThrough(new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, ctrl) {
        total += chunk.byteLength;
        if (total > MAX_BYTES) { ctrl.error(new Error("too large")); return; }
        ctrl.enqueue(chunk);
      },
    }));
    return new Response(limited, {
      status: 200,
      headers: {
        "Content-Type": type,
        "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400",
        "Cross-Origin-Resource-Policy": "same-origin",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response(null, { status: 502 });
  } finally {
    clearTimeout(t);
  }
}
