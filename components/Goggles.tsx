"use client";

import { useEffect, useRef, useState } from "react";
import { Binoculars, CaretDown } from "@phosphor-icons/react";

type G = { id: string; name: string; desc: string };

/**
 * Goggle-väljaren under flikarna. Förinställda goggles är vanliga länkar; en
 * egen goggle sparas i den här webbläsaren och följer med i adressen (r=), så
 * den går att dela som en länk.
 */
export function Goggles({ q, cat, g, r, list }: { q: string; cat: string; g: string; r: string; list: G[] }) {
  const [edit, setEdit] = useState(false);
  const [text, setText] = useState("");
  const ref = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    let saved = "";
    try { saved = localStorage.getItem("adraze-goggle") ?? ""; } catch {}
    setText(g === "egen" && r ? r.split(",").join("\n") : saved || "+reddit.com\n-pinterest.com");
  }, [g, r]);

  const href = (id: string, rules = "") => {
    const p = new URLSearchParams({ q });
    if (cat !== "general") p.set("cat", cat);
    if (id) p.set("g", id);
    if (rules) p.set("r", rules);
    return `/search?${p}`;
  };
  const current = g === "egen" ? "Egen goggle" : list.find((x) => x.id === g)?.name ?? "Ingen";

  const save = () => {
    const rules = text.split(/[\s,]+/).map((s) => s.trim().toLowerCase()).filter((s) => /^[+-][a-z0-9.-]{2,80}$/.test(s));
    try { localStorage.setItem("adraze-goggle", rules.join("\n")); } catch {}
    location.assign(href("egen", rules.join(",")));
  };

  return (
    <details className="gog" ref={ref} onToggle={() => { if (!ref.current?.open) setEdit(false); }}>
      <summary className="pill" style={{ height: 32, fontSize: 13 }}>
        <Binoculars size={15} weight={g ? "fill" : "regular"} style={{ color: g ? "var(--accent)" : undefined }} aria-hidden />
        Goggle: {current}
        <CaretDown size={12} aria-hidden />
      </summary>
      <div className="gog-menu">
        {!edit ? (
          <>
            <a href={href("")} className={!g ? "on" : ""}><b>Ingen</b><small>Resultaten som motorerna gav dem.</small></a>
            {list.map((x) => (
              <a key={x.id} href={href(x.id)} className={g === x.id ? "on" : ""}><b>{x.name}</b><small>{x.desc}</small></a>
            ))}
            <hr />
            <button type="button" className={`gog-item ${g === "egen" ? "on" : ""}`} onClick={() => setEdit(true)}>
              <b>Egen goggle…</b><small>Välj själv vilka sajter som lyfts upp eller göms.</small>
            </button>
          </>
        ) : (
          <div className="gog-edit p-2">
            <b className="text-[14px]">Egen goggle</b>
            <small className="mt-1 block text-[12.5px]" style={{ color: "var(--dim)" }}>
              En sajt per rad. <code>+</code> lyfter upp, <code>-</code> gömmer. <code>+.se</code> gäller alla svenska sajter.
            </small>
            <textarea value={text} onChange={(e) => setText(e.target.value)} spellCheck={false} aria-label="Regler" />
            <div className="mt-3 flex gap-2">
              <button type="button" className="pill liq" onClick={save}>Använd</button>
              <button type="button" className="pill" onClick={() => setEdit(false)}>Tillbaka</button>
            </div>
          </div>
        )}
      </div>
    </details>
  );
}
