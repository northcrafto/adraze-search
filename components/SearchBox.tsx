"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const TLDS = new Set("se com net org nu io dev app no dk fi de uk co eu me info tv ai xyz us fr es it nl pl ch at be ie pt ru tr br ca au nz jp kr cn in".split(" "));

/** Ser texten ut som en adress (domän med känd toppdomän, eller med http/https) → riktig adress, annars null. */
function siteUrl(t: string): string | null {
  if (/\s/.test(t)) return null;
  if (/^https?:\/\/\S+\.\S+/i.test(t)) return t;
  const m = /^([a-z0-9-]+\.)+([a-z]{2,})(:\d+)?(\/\S*)?$/i.exec(t);
  if (!m || !TLDS.has(m[2].toLowerCase())) return null;
  return "https://" + t;
}

/**
 * Sökrutan med förslag medan man skriver. Förslagen hämtas från vår egen
 * server, aldrig direkt från någon sökmotor, så besökarens adress stannar här.
 */
export function SearchBox({ initial = "", small = false, cat = "general", autoFocus = false }: { initial?: string; small?: boolean; cat?: string; autoFocus?: boolean }) {
  const router = useRouter();
  const [q, setQ] = useState(initial);
  const [items, setItems] = useState<string[]>([]);
  const [sel, setSel] = useState(-1);
  const [open, setOpen] = useState(false);
  const seq = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    const query = q.trim();
    if (!query || query === initial) { setItems([]); return; }
    const my = ++seq.current;
    timer.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/suggest?q=${encodeURIComponent(query)}`);
        const data = (await res.json()) as [string, string[]];
        if (my !== seq.current) return;
        setItems(Array.isArray(data[1]) ? data[1] : []);
        setSel(-1);
        setOpen(true);
      } catch {
        /* inga förslag är inget fel */
      }
    }, 120);
    return () => { if (timer.current) clearTimeout(timer.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const go = (text: string) => {
    const t = text.trim();
    if (!t) return;
    setOpen(false);
    // En inskriven adress öppnas direkt, som i ett adressfält.
    const site = siteUrl(t);
    if (site) { window.location.assign(site); return; }
    const url = `/search?q=${encodeURIComponent(t)}${cat !== "general" ? `&cat=${cat}` : ""}`;
    router.push(url);
    // Reserv: svarar inte klientnavigeringen (t.ex. gammal flik efter ny deploy) laddas sidan hårt.
    setTimeout(() => { if (location.pathname + location.search !== url) location.assign(url); }, 900);
  };

  const typed = q.trim().toLowerCase();

  return (
    <form
      className="relative w-full"
      onSubmit={(e) => { e.preventDefault(); go(sel >= 0 && items[sel] ? items[sel] : q); }}
      role="search"
    >
      <div className={`box ${small ? "small" : ""}`}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="shrink-0" style={{ color: "var(--dim)" }} aria-hidden>
          <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
        </svg>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => items.length && setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 120)}
          onKeyDown={(e) => {
            if (!open || !items.length) return;
            if (e.key === "ArrowDown") { e.preventDefault(); setSel((s) => (s + 1) % items.length); }
            else if (e.key === "ArrowUp") { e.preventDefault(); setSel((s) => (s - 1 + items.length) % items.length); }
            else if (e.key === "Escape") { setOpen(false); }
          }}
          placeholder="Sök på webben"
          autoComplete="off"
          spellCheck={false}
          autoFocus={autoFocus}
          aria-label="Sök"
          name="q"
        />
      </div>
      {open && items.length > 0 && (
        <div className="sugg" role="listbox">
          {items.map((s, i) => {
            const lower = s.toLowerCase();
            const hit = typed && lower.startsWith(typed);
            return (
              <button type="button" key={s} className={i === sel ? "sel" : ""} onMouseDown={(e) => { e.preventDefault(); go(s); }} role="option" aria-selected={i === sel}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
                <span>{hit ? <><b>{s.slice(0, typed.length)}</b>{s.slice(typed.length)}</> : s}</span>
              </button>
            );
          })}
        </div>
      )}
    </form>
  );
}
