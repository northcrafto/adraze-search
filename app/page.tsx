import Link from "next/link";
import { HomeSearch } from "@/components/Home";

/**
 * Startsidan, som Google: märket, sökrutan och inget mer. Man söker och är klar.
 */
export default function Home() {
  return (
    <main className="flex min-h-[100dvh] flex-col px-5 sm:px-8">
      <header className="flex h-[60px] items-center justify-end">
        <nav className="flex gap-6 text-[14px]" style={{ color: "var(--dim)" }}>
          <Link href="/integritet" className="nav-link hover:text-white">Integritet</Link>
          <a href="https://adraze.app" className="nav-link hover:text-white">AdRaze</a>
        </nav>
      </header>

      <section className="flex flex-1 flex-col items-center pt-[14vh] pb-24">
        <h1 className="flex items-center gap-3 text-[clamp(2.2rem,5vw,3.2rem)] font-semibold tracking-[-0.035em]">
          <img src="/falk.png" alt="" width={64} height={64} className="h-[1.35em] w-auto" />
          <span>AdRaze<span style={{ color: "var(--accent)" }}> Search</span></span>
        </h1>
        <div className="mt-9 w-full max-w-[640px]">
          <HomeSearch />
        </div>
      </section>

      <footer className="flex h-[52px] items-center justify-center gap-2 text-[13px]" style={{ color: "var(--dim)" }}>
        Ingen logg, inga kakor, ingen profil.
      </footer>
    </main>
  );
}
