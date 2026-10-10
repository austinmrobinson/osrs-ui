// The site's public address, in one place. The registry URLs, install commands, OG meta tags and the
// address printed on the share card (site/og/OgImages.tsx) all follow it. If it changes, update it
// here, then regenerate public/og.png from site/og/OgImages.tsx (concept 6).
//
// SITE_URL is where Vercel serves the site (www redirects to it); SITE_HOST is its name for display.
export const SITE_URL = "https://osrsui.com";
export const SITE_HOST = new URL(SITE_URL).host;
export const REGISTRY_URL = `${SITE_URL}/r`;
