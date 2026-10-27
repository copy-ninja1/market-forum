import { normalizeSiteUrl } from "@/seo/absoluteUrl";

export { absoluteUrl, normalizeSiteUrl } from "@/seo/absoluteUrl";

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
