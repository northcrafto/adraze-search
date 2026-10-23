"use client";

import { useState } from "react";
import { Globe, Image as ImageIcon, VideoCamera, Newspaper, MapTrifold } from "@phosphor-icons/react";
import { SearchBox } from "./SearchBox";

const CATS = [
  { key: "general", label: "Webb", Icon: Globe },
  { key: "images", label: "Bilder", Icon: ImageIcon },
  { key: "videos", label: "Videor", Icon: VideoCamera },
  { key: "news", label: "Nyheter", Icon: Newspaper },
  { key: "map", label: "Kartor", Icon: MapTrifold },
] as const;

/** Sökrutan på startsidan med kategoriväljare som segmentkontroll under. */
export function HomeSearch() {
  const [cat, setCat] = useState<string>("general");
  return (
    <div>
      <SearchBox autoFocus cat={cat} />
      <div className="mt-5 flex justify-center"><div className="seg" role="radiogroup" aria-label="Kategori">
        {CATS.map(({ key, label, Icon }) => (
          <button key={key} type="button" role="radio" aria-checked={cat === key} className={cat === key ? "on" : ""} onClick={() => setCat(key)}>
            <Icon size={16} weight={cat === key ? "fill" : "regular"} aria-hidden />
            {label}
          </button>
        ))}
      </div></div>
    </div>
  );
}
