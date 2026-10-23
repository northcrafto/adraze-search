import Link from "next/link";

/** AdRazes falk, samma som webbläsarens blockerare. */
export function Logo({ big = false }: { big?: boolean }) {
  return (
    <Link href="/" className="inline-flex items-center gap-2.5" aria-label="AdRaze Search, till startsidan">
      <img src="/falk.png" alt="" width={big ? 64 : 30} height={big ? 64 : 30} />
      <span className={`font-semibold tracking-[-0.025em] ${big ? "text-[2.6rem]" : "text-[19px]"}`}>
        AdRaze<span style={{ color: "var(--accent)" }}> Search</span>
      </span>
    </Link>
  );
}
