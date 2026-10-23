import "server-only";
import { createHmac } from "node:crypto";

/**
 * Blind bildproxy: alla bilder, tumnaglar och favikoner i resultaten hämtas av
 * vår server, aldrig av besökarens webbläsare. Bildvärden ser vår adress, inte
 * din. Adressen signeras så proxyn inte kan användas för godtyckliga hämtningar.
 */
const KEY = process.env.IMG_KEY ?? "";

export function sign(url: string): string {
  return createHmac("sha256", KEY || "adraze-dev").update(url).digest("base64url").slice(0, 20);
}

/** Proxad adress för en bild, eller tom sträng om adressen inte duger. */
export function proxied(url?: string | null): string {
  if (!url) return "";
  const u = url.startsWith("//") ? "https:" + url : url;
  if (!/^https?:\/\//i.test(u)) return "";
  return `/api/img?u=${encodeURIComponent(u)}&s=${sign(u)}`;
}

/** Favikon för en domän, via DuckDuckGos ikontjänst men genom proxyn. */
export function favicon(hostname: string): string {
  return proxied(`https://icons.duckduckgo.com/ip3/${hostname}.ico`);
}
