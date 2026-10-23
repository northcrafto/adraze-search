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

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: HEADERS }];
  },
};

export default nextConfig;
