# AdRaze Sök

AdRazes sökmotor, utan reklam och spårning. Next.js-sidan hämtar resultaten från en egen [SearXNG](https://github.com/searxng/searxng) bakom Cloudflare Access.

    npm ci
    SEARX_URL=https://din-searxng.example CF_ACCESS_CLIENT_ID=… CF_ACCESS_CLIENT_SECRET=… npm run dev

Utan `SEARX_URL` används AdRazes egen instans, men den kräver Access-nycklar. `IMG_KEY` signerar bildproxyn.

Resten av AdRaze (tillägg, webbläsare, sajter) ligger i [northcrafto/adraze](https://github.com/northcrafto/adraze). Licens: GPL-3.0.
