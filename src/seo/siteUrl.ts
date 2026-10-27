const TRAILING_SLASH = /\/$/;

export function normalizeSiteUrl(siteUrl: string): string {
  return siteUrl.trim().replace(TRAILING_SLASH, "");
}

/**
 * Absolute public origin used for canonical URLs, Open Graph, and sitemaps.
 * Prefer `VITE_PUBLIC_SITE_URL` in production (e.g. https://studentmarket.example.edu).
 */
export function getPublicSiteUrl(): string {
  const fromEnv = import.meta.env.VITE_PUBLIC_SITE_URL?.trim();
  if (fromEnv) {
    return normalizeSiteUrl(fromEnv);
  }

  if (typeof window !== "undefined" && window.location?.origin) {
    return normalizeSiteUrl(window.location.origin);
  }

  return "http://localhost:5173";
}

export function absoluteUrl(path: string, siteUrl = getPublicSiteUrl()): string {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizeSiteUrl(siteUrl)}${normalizedPath}`;
}
