import type { Metadata } from "next";
import { Logo } from "@/components/Logo";

export const metadata: Metadata = { title: "Integritet" };

export default function Privacy() {
  return (
    <main className="mx-auto max-w-[680px] px-5 py-12">
      <Logo />
      <h1 className="mt-10 text-3xl font-semibold tracking-[-0.03em]">Ingen logg. På riktigt.</h1>
      <div className="mt-6 space-y-5 text-[16px] leading-relaxed" style={{ color: "#c9ccd2" }}>
        <p>AdRaze Search sparar ingenting om dig. Inga sökningar, ingen IP-adress, inga kakor, ingen profil, inga annonser. Det finns inget konto att logga in på och därför inget att koppla en sökning till.</p>
        <p>Så här fungerar det. Din sökning går till vår server. Servern frågar flera sökmotorer, bland dem Google, Bing och Brave, i vårt namn och med vår adress. De ser aldrig din adress, din webbläsare eller vad du sökt på tidigare. Resultaten skickas tillbaka till dig och glöms.</p>
        <p>När du klickar på ett resultat får sajten du landar på ingen hänvisning från oss. Den vet inte att du kom från en sökning, och den ser inte vad du sökte på.</p>
        <p>Det vi inte kan lova bort: sajten körs på en molntjänst som kan hålla tekniska driftloggar en kort tid för att hålla tjänsten igång. Vi läser dem inte, vi sparar dem inte, och vi kopplar ingenting till någon person. Det är samma villkor som varje sajt på internet har, och vi säger det hellre rakt ut än gömmer det.</p>
        <p>AdRaze Search är sökmotorn i webbläsaren AdRaze och används där som standard i inkognitoläge.</p>
      </div>
    </main>
  );
}
