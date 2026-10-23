"use client";

import { useState } from "react";
import { host } from "@/lib/searx";

type Img = { url: string; title: string; img_src?: string; thumbnail_src?: string };

/** Bildrutnätet. En bild som inte går att hämta tas bort i stället för att
    lämna en tom ruta med alt-text. */
export function ImageGrid({ items }: { items: Img[] }) {
  const [dead, setDead] = useState<Set<string>>(new Set());
  return (
    <div className="imgs">
      {items.filter((r) => r.img_src && !dead.has(r.url + r.img_src)).map((r) => (
        <a key={r.url + r.img_src} href={r.url} rel="noopener noreferrer" title={r.title}>
          <img
            src={r.thumbnail_src || r.img_src}
            alt=""
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setDead((d) => new Set(d).add(r.url + r.img_src!))}
          />
          <span>{host(r.url)}</span>
        </a>
      ))}
    </div>
  );
}
