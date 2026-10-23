import Link from "next/link";
import { Logo } from "@/components/Logo";
import { HomeSearch } from "@/components/Home";

/**
 * Startsidan: vänsterställd, luftig. Rubriken bär sidan, sökrutan direkt
 * under. Inga chips, inga prickrader: allt AdRaze lovar står i en mening.
 */
export default function Home() {
  return (
    <main className="mx-auto flex min-h-[100dvh] max-w-[1400px] flex-col px-5 sm:px-8 lg:px-12">
      <header className="flex h-[72px] items-center justify-between">
        <Logo />
        <nav className="flex gap-6 text-[14px]" style={{ color: "var(--dim)" }}>
          <Link href="/integritet" className="hover:text-white">Integritet</Link>
          <a href="https://adraze.app" className="hover:text-white">AdRaze</a>
        </nav>
      </header>

      <section className="flex flex-1 flex-col justify-center pb-24 pt-6 lg:pt-0">
        <div className="max-w-[820px]">
          <h1 className="rise text-[clamp(2.6rem,6.2vw,5.2rem)] font-semibold leading-[0.98] tracking-[-0.035em]">
            Sök utan att
            <br />
            <span style={{ color: "var(--accent-soft)" }}>bli sökt.</span>
          </h1>
          <p className="rise mt-6 max-w-[46ch] text-[17px] leading-relaxed sm:text-[18px]" style={{ color: "var(--dim)", animationDelay: "70ms" }}>
            Svar från flera motorer på en gång. Ingen logg, ingen profil, inga kakor. Bara det du letade efter.
          </p>
          <div className="rise mt-9 max-w-[680px]" style={{ animationDelay: "130ms" }}>
            <HomeSearch />
          </div>
        </div>
      </section>
    </main>
  );
}
