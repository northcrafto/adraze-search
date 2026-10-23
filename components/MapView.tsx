import { proxied } from "@/lib/img";

/**
 * Statisk karta av OpenStreetMap-rutor. Rutorna hämtas genom vår bildproxy, så
 * kartleverantören ser aldrig besökaren. Inget kartbibliotek, inget skript.
 */
const T = 256;

function tileXY(lat: number, lon: number, z: number) {
  const n = 2 ** z;
  const r = (lat * Math.PI) / 180;
  return { x: ((lon + 180) / 360) * n, y: ((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * n };
}

/** Zoom så att området (söder, norr, väst, öst) ryms i ungefär 700×400 px. */
function zoomFor(bb: number[] | undefined) {
  if (!bb || bb.length < 4) return 15;
  const [s, n, w, e] = bb;
  for (let z = 17; z > 2; z--) {
    const a = tileXY(n, w, z), b = tileXY(s, e, z);
    if (Math.abs(b.x - a.x) * T < 640 && Math.abs(b.y - a.y) * T < 360) return z;
  }
  return 3;
}

export function MapView({ lat, lon, bb, label }: { lat: number; lon: number; bb?: number[]; label: string }) {
  const z = zoomFor(bb);
  const c = tileXY(lat, lon, z);
  const cx = Math.floor(c.x), cy = Math.floor(c.y);
  const n = 2 ** z;
  const tiles: { key: string; src: string; left: number; top: number }[] = [];
  for (let dx = -3; dx <= 3; dx++) {
    for (let dy = -2; dy <= 2; dy++) {
      const tx = (((cx + dx) % n) + n) % n, ty = cy + dy;
      if (ty < 0 || ty >= n) continue;
      tiles.push({
        key: `${dx}:${dy}`,
        src: proxied(`https://tile.openstreetmap.org/${z}/${tx}/${ty}.png`),
        left: (cx + dx - c.x) * T,
        top: (cy + dy - c.y) * T,
      });
    }
  }
  return (
    <figure className="map" aria-label={`Karta: ${label}`}>
      {tiles.map((t) => (
        <img key={t.key} src={t.src} alt="" width={T} height={T} loading="lazy" style={{ left: `calc(50% + ${t.left}px)`, top: `calc(50% + ${t.top}px)` }} />
      ))}
      <span className="map-pin" aria-hidden />
      <figcaption>© OpenStreetMap-bidragsgivare</figcaption>
    </figure>
  );
}
