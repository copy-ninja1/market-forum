const TRAILING_SLASH = /\/$/;

export function normalizeSiteUrl(siteUrl: string): string {
  return siteUrl.trim().replace(TRAILING_SLASH, "");
}

export function absoluteUrl(path: string, siteUrl: string): string {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizeSiteUrl(siteUrl)}${normalizedPath}`;
}
