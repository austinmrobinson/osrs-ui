// The site's public address, in one place. Update this when the site moves to its own domain: the
// registry URLs, install commands, OG image and the URL printed on it (site/og/OgImages.tsx) all
// follow it. Then regenerate public/og.png from site/og/OgImages.tsx (concept 6).
export const SITE_URL = "https://osrs-ui.vercel.app";
export const SITE_HOST = new URL(SITE_URL).host;
export const REGISTRY_URL = `${SITE_URL}/r`;
