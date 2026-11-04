import type { NextConfig } from "next";

/* Inga spår utåt: ingen hänvisning till sajten man klickar sig till (sökordet
   ligger i vår adress), inga inbäddningar, inga tredjepartsskript. */
const HEADERS = [
  { key: "Referrer-Policy", value: "no-referrer" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "Content-Security-Policy", value: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src * data:; font-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'" },
];

/* Bildproxyn svarar bara med bilder. Öppnas en proxylänk direkt i en flik får
   den varken skript eller hämtningar och hamnar i ett eget ursprung (sandbox).
   Står efter regeln ovan, så den här CSP:n ersätter den för /api/img. */
const IMG_HEADERS = [
  { key: "Content-Security-Policy", value: "default-src 'none'; style-src 'unsafe-inline'; sandbox" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      { source: "/:path*", headers: HEADERS },
      { source: "/api/img", headers: IMG_HEADERS },
    ];
  },
};

export default nextConfig;
