/**
 * Goggles: regler som sorterar om resultaten, i stil med Brave Goggles.
 * En regel är en domän med + (lyft upp) eller - (göm). Domänen träffar även
 * underdomäner, och ".se" träffar alla svenska adresser.
 */
import type { Result } from "./searx";

export type Goggle = { id: string; name: string; desc: string; rules: string[] };

export const GOGGLES: Goggle[] = [
  {
    id: "utan-skrap", name: "Utan SEO-skräp", desc: "Gömmer innehållsfarmer, nedladdningssajter och fusklappar.",
    rules: ["-pinterest.com", "-pinterest.se", "-quora.com", "-answers.com", "-ehow.com", "-ask.com", "-chegg.com", "-coursehero.com", "-scribd.com", "-slideshare.net", "-softonic.com", "-uptodown.com", "-filehippo.com", "-brainly.com", "-studocu.com", "-alamy.com", "-shutterstock.com"],
  },
  {
    id: "forum", name: "Forum och diskussion", desc: "Lyfter fram vad riktiga människor skriver.",
    rules: ["+reddit.com", "+flashback.org", "+news.ycombinator.com", "+stackexchange.com", "+stackoverflow.com", "+lobste.rs", "+familjeliv.se", "+sweclockers.com", "+discourse.org", "+forum"],
  },
  {
    id: "tech", name: "Teknik och kod", desc: "Dokumentation, kodförråd och utvecklarforum först.",
    rules: ["+github.com", "+gitlab.com", "+stackoverflow.com", "+stackexchange.com", "+developer.mozilla.org", "+docs.", "+dev.to", "+news.ycombinator.com", "+arxiv.org", "+python.org", "+rust-lang.org", "+npmjs.com", "-w3schools.com", "-geeksforgeeks.org"],
  },
  {
    id: "svenskt", name: "Svenska källor", desc: "Sajter på .se och svenska Wikipedia först.",
    rules: ["+.se", "+sv.wikipedia.org", "+svt.se", "+sverigesradio.se"],
  },
  {
    id: "fakta", name: "Fakta och forskning", desc: "Uppslagsverk, myndigheter och vetenskap först.",
    rules: ["+wikipedia.org", "+.edu", "+.gov", "+arxiv.org", "+ncbi.nlm.nih.gov", "+nature.com", "+sciencedirect.com", "+britannica.com", "+ne.se", "+scb.se", "+1177.se", "+riksdagen.se", "+regeringen.se", "+krisinformation.se"],
  },
  {
    id: "lilla-webben", name: "Lilla webben", desc: "Gömmer jättarna så att bloggar och små sajter syns.",
    rules: ["-youtube.com", "-facebook.com", "-instagram.com", "-tiktok.com", "-x.com", "-twitter.com", "-linkedin.com", "-pinterest.com", "-amazon.com", "-amazon.se", "-microsoft.com", "-apple.com", "-wikipedia.org", "-reddit.com", "-quora.com"],
  },
];

/** Regler från adressen: förinställd goggle (g) eller egna regler (r). */
export function rulesFor(g?: string, r?: string): string[] {
  if (g === "egen") return parseRules(r ?? "");
  return GOGGLES.find((x) => x.id === g)?.rules ?? [];
}

export function parseRules(text: string): string[] {
  return text
    .split(/[\s,]+/)
    .map((s) => s.trim().toLowerCase())
    .filter((s) => /^[+-][a-z0-9.-]{2,80}$/.test(s))
    .slice(0, 60);
}

function matches(host: string, pat: string) {
  if (pat.startsWith(".")) return host.endsWith(pat);
  if (pat.endsWith(".")) return host.startsWith(pat) || host.includes("." + pat);
  if (!pat.includes(".")) return host.includes(pat);
  return host === pat || host.endsWith("." + pat);
}

/** Gömmer och lyfter. Lyfta resultat flyttas upp men behåller inbördes ordning. */
export function applyGoggle(results: Result[], rules: string[], hostOf: (u: string) => string): Result[] {
  if (!rules.length) return results;
  const plus = rules.filter((r) => r[0] === "+").map((r) => r.slice(1));
  const minus = rules.filter((r) => r[0] === "-").map((r) => r.slice(1));
  return results
    .map((res, i) => ({ res, i, h: hostOf(res.url).toLowerCase() }))
    .filter((x) => !minus.some((m) => matches(x.h, m)))
    .map((x) => ({ ...x, k: x.i - (plus.some((p) => matches(x.h, p)) ? 1000 : 0) }))
    .sort((a, b) => a.k - b.k)
    .map((x) => x.res);
}
