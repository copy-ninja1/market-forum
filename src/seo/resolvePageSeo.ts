import { absoluteUrl, normalizeSiteUrl } from "@/seo/siteUrl";
import type { PageSeoInput, ResolvedPageSeo } from "@/seo/seo.types";

const DEFAULT_OG_PATH = "/logo.png";

export function resolvePageSeo(
  input: PageSeoInput,
  siteUrl: string,
  appName: string,
): ResolvedPageSeo {
  const origin = normalizeSiteUrl(siteUrl);
  const title = input.title.includes(appName) ? input.title : `${input.title} | ${appName}`;
  const imageUrl = absoluteUrl(input.imageUrl ?? DEFAULT_OG_PATH, origin);

  return {
    title,
    description: input.description,
    canonicalUrl: absoluteUrl(input.path, origin),
    robots: input.robots ?? "index,follow",
    imageUrl,
    imageAlt: input.imageAlt ?? appName,
    type: input.type ?? "website",
    jsonLd: input.jsonLd ?? [],
    ssrHtml: input.ssrHtml ?? "",
  };
}
