import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { SearchBox } from "@/components/SearchBox";
import { ImageGrid } from "@/components/ImageGrid";
import { proxied, favicon } from "@/lib/img";
import { host, search, type Cat } from "@/lib/searx";

export const dynamic = "force-dynamic";

type Params = { q?: string; cat?: string; p?: string };

export async function generateMetadata({ searchParams }: { searchParams: Promise<Params> }): Promise<Metadata> {
  const { q } = await searchParams;
  return { title: q ? `${q}` : "Sök", robots: { index: false, follow: false } };
}

/** "för 3 timmar sedan", "igår", annars datum. */
function when(iso: string) {
  const t = Date.parse(iso); if (Number.isNaN(t)) return "";
  const h = Math.round((Date.now() - t) / 3600000);
  if (h < 1) return "nyss";
  if (h < 24) return `för ${h} tim sedan`;
  const d = Math.round(h / 24);
  if (d === 1) return "igår";
  if (d < 14) return `för ${d} dagar sedan`;
  return new Date(t).toLocaleDateString("sv-SE", { day: "numeric", month: "short", year: "numeric" });
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<Params> }) {
  const sp = await searchParams;
  const q = (sp.q ?? "").trim();
  const cat: Cat = sp.cat === "images" || sp.cat === "videos" || sp.cat === "news" ? sp.cat : "general";
  const page = Math.max(1, Math.min(20, parseInt(sp.p ?? "1", 10) || 1));
  const link = (c: string, p = 1) => `/search?q=${encodeURIComponent(q)}${c !== "general" ? `&cat=${c}` : ""}${p > 1 ? `&p=${p}` : ""}`;

  return (
    <div>
      <header className="sticky top-0 z-30 border-b" style={{ borderColor: "var(--line)", background: "color-mix(in oklab, var(--bg) 85%, transparent)", backdropFilter: "blur(10px)" }}>
        <div className="mx-auto flex max-w-[1100px] items-center gap-6 px-5 py-3">
          <div className="shrink-0"><Logo /></div>
          <div className="min-w-0 flex-1 max-w-[680px]"><SearchBox initial={q} small cat={cat} /></div>
          <Link href="/integritet" className="ml-auto hidden text-[13px] hover:underline underline-offset-4 md:block" style={{ color: "var(--dim)" }}>Ingen logg</Link>
        </div>
        <nav className="mx-auto flex max-w-[1100px] gap-1 px-5 pb-2">
          <Link href={link("general")} className={`tab ${cat === "general" ? "on" : ""}`}>Webb</Link>
          <Link href={link("images")} className={`tab ${cat === "images" ? "on" : ""}`}>Bilder</Link>
          <Link href={link("videos")} className={`tab ${cat === "videos" ? "on" : ""}`}>Videor</Link>
          <Link href={link("news")} className={`tab ${cat === "news" ? "on" : ""}`}>Nyheter</Link>
        </nav>
      </header>

      <main className="mx-auto max-w-[1100px] px-5 py-6">
        {!q ? (
          <p style={{ color: "var(--dim)" }}>Skriv något att söka efter.</p>
        ) : (
          // Huvudet och flikarna kommer direkt; resultaten strömmas in när motorn svarat.
          // Utan det här står sidan stilla i en sekund vid varje flikbyte.
          <Suspense key={`${q}|${cat}|${page}`} fallback={<Skeleton cat={cat} />}>
            <Results q={q} cat={cat} page={page} link={link} />
          </Suspense>
        )}
      </main>
    </div>
  );
}

function Skeleton({ cat }: { cat: Cat }) {
  if (cat === "images" || cat === "videos") {
    return (
      <div className={cat === "images" ? "imgs" : "vids"} aria-hidden>
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="animate-pulse rounded-[12px]" style={{ background: "var(--surface)", aspectRatio: cat === "images" ? "4 / 3" : "16 / 9" }} />
        ))}
      </div>
    );
  }
  return (
    <div className="max-w-[680px] animate-pulse" aria-hidden>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="res">
          <div className="h-3 w-32 rounded" style={{ background: "var(--surface-2)" }} />
          <div className="mt-3 h-5 w-3/4 rounded" style={{ background: "var(--surface)" }} />
          <div className="mt-2 h-4 w-full rounded" style={{ background: "var(--surface)" }} />
        </div>
      ))}
    </div>
  );
}

async function Results({ q, cat, page, link }: { q: string; cat: Cat; page: number; link: (c: string, p?: number) => string }) {
  // Bilder körs alltid med strikt säkert läge; webben med måttligt.
  const data = await search(q, { cat, page, safe: cat === "images" ? 2 : 1 });
  const results = data?.results ?? [];
  const answers = (data?.answers ?? []).map((a) => (typeof a === "string" ? a : a.answer)).filter(Boolean);
  const box = data?.infoboxes?.[0];
  return (
    <>
        {q && data === null && (
          <p className="rounded-[12px] p-4 text-[15px]" style={{ background: "var(--surface-2)", color: "var(--accent-soft)" }}>
            Motorn svarade inte just nu. Prova igen om en stund.
          </p>
        )}
        {q && data && results.length === 0 && <p style={{ color: "var(--dim)" }}>Inga träffar på “{q}”.</p>}

        {cat === "general" && results.length > 0 && (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,680px)_1fr]">
            <div>
              {answers.length > 0 && (
                <div className="mb-4 rounded-[14px] border p-4 text-[15px]" style={{ borderColor: "rgb(255 75 31 / .4)", background: "rgb(255 75 31 / .08)" }}>
                  {answers[0]}
                </div>
              )}
              {results.map((r) => (
                <article key={r.url} className="res">
                  <div className="host">
                    <img src={favicon(host(r.url))} alt="" loading="lazy" />
                    <span>{host(r.url)}</span>
                  </div>
                  <h3><a href={r.url} rel="noopener noreferrer">{r.title}</a></h3>
                  {r.content && <p>{r.content}</p>}
                </article>
              ))}
              <div className="mt-8 flex items-center gap-3">
                {page > 1 && <Link href={link(cat, page - 1)} className="pill">‹ Föregående</Link>}
                <Link href={link(cat, page + 1)} className="pill">Nästa sida ›</Link>
                <span className="ml-auto text-[13px]" style={{ color: "var(--dim)" }}>Sida {page}</span>
              </div>
            </div>
            <aside className="hidden lg:block">
              {box && (
                <div className="rounded-[16px] border p-5" style={{ borderColor: "var(--line)", background: "var(--surface)" }}>
                  {box.img_src && <img src={proxied(box.img_src)} alt="" className="mb-3 max-h-48 rounded-[10px] object-cover" />}
                  <h2 className="text-[17px] font-semibold">{box.infobox}</h2>
                  {box.content && <p className="mt-2 text-[14px] leading-relaxed" style={{ color: "#c9ccd2" }}>{box.content.slice(0, 600)}</p>}
                  {box.urls?.[0] && (
                    <a href={box.urls[0].url} rel="noopener noreferrer" className="mt-3 inline-block text-[13.5px] hover:underline underline-offset-4" style={{ color: "var(--accent-soft)" }}>{box.urls[0].title} →</a>
                  )}
                </div>
              )}
              {data && data.suggestions?.length > 0 && (
                <div className="mt-4">
                  <p className="text-[12px] font-medium uppercase tracking-[0.12em]" style={{ color: "var(--dim)" }}>Relaterat</p>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {data.suggestions.slice(0, 8).map((s) => (
                      <li key={s}><Link href={`/search?q=${encodeURIComponent(s)}`} className="pill" style={{ height: 32, fontSize: 13 }}>{s}</Link></li>
                    ))}
                  </ul>
                </div>
              )}
            </aside>
          </div>
        )}

        {cat === "images" && results.length > 0 && <ImageGrid items={results.map((r) => ({ ...r, img_src: proxied(r.thumbnail_src || r.img_src), thumbnail_src: undefined }))} />}

        {cat === "videos" && results.length > 0 && (
          <div className="vids">
            {results.map((r) => (
              <a key={r.url} href={r.url} rel="noopener noreferrer" className="vid">
                <span className="vthumb">
                  {r.thumbnail ? <img src={proxied(r.thumbnail)} alt="" loading="lazy" /> : <span className="vthumb-empty" />}
                  {r.length && <span className="vlen">{r.length}</span>}
                </span>
                <span className="vtxt">
                  <span className="vtitle">{r.title}</span>
                  <span className="vhost">{host(r.url)}{r.publishedDate ? ` · ${when(r.publishedDate)}` : ""}</span>
                </span>
              </a>
            ))}
            <div className="mt-6 flex items-center gap-3" style={{ gridColumn: "1 / -1" }}>
              {page > 1 && <Link href={link(cat, page - 1)} className="pill">‹ Föregående</Link>}
              <Link href={link(cat, page + 1)} className="pill">Nästa sida ›</Link>
            </div>
          </div>
        )}

        {cat === "news" && results.length > 0 && (
          <div className="max-w-[720px]">
            {results.map((r) => (
              <article key={r.url} className="res">
                <div className="host">
                  <img src={favicon(host(r.url))} alt="" loading="lazy" />
                  <span>{host(r.url)}</span>
                  {r.publishedDate && <span>· {when(r.publishedDate)}</span>}
                </div>
                <h3><a href={r.url} rel="noopener noreferrer">{r.title}</a></h3>
                {r.content && <p>{r.content}</p>}
              </article>
            ))}
            <div className="mt-8 flex items-center gap-3">
              {page > 1 && <Link href={link(cat, page - 1)} className="pill">‹ Föregående</Link>}
              <Link href={link(cat, page + 1)} className="pill">Nästa sida ›</Link>
            </div>
          </div>
        )}
    </>
  );
}
