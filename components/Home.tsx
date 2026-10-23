"use client";

import { SearchBox } from "./SearchBox";

/** Sökrutan på startsidan. Kategorierna finns som flikar på resultatsidan. */
export function HomeSearch() {
  return <SearchBox autoFocus />;
}
