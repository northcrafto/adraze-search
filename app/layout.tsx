import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });

export const metadata: Metadata = {
  title: { default: "AdRaze Search", template: "%s · AdRaze Search" },
  description: "Sök utan att bli sökt. Ingen logg, ingen profil, inga spår. Sökmotorn i webbläsaren AdRaze.",
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sv" className={geist.variable}>
      <head>
        <link rel="search" type="application/opensearchdescription+xml" title="AdRaze Search" href="/opensearch.xml" />
      </head>
      <body className="font-sans min-h-screen">{children}</body>
    </html>
  );
}
