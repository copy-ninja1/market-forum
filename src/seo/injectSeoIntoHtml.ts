import { escapeAttribute, escapeHtml } from "@/seo/escapeHtml";
import type { ResolvedPageSeo } from "@/seo/seo.types";

function metaTag(attributes: Record<string, string>): string {
  const serialized = Object.entries(attributes)
    .map(([key, value]) => `${key}="${escapeAttribute(value)}"`)
    .join(" ");
  return `<meta ${serialized} />`;
}

function linkTag(rel: string, href: string): string {
  return `<link rel="${escapeAttribute(rel)}" href="${escapeAttribute(href)}" />`;
}

export function buildHeadTags(seo: ResolvedPageSeo): string {
  const tags = [
    `<title>${escapeHtml(seo.title)}</title>`,
    metaTag({ name: "description", content: seo.description }),
    metaTag({ name: "robots", content: seo.robots }),
    linkTag("canonical", seo.canonicalUrl),
    metaTag({ property: "og:type", content: seo.type }),
    metaTag({ property: "og:site_name", content: seo.title.split(" | ").at(-1) ?? seo.title }),
    metaTag({ property: "og:title", content: seo.title }),
    metaTag({ property: "og:description", content: seo.description }),
    metaTag({ property: "og:url", content: seo.canonicalUrl }),
    metaTag({ property: "og:image", content: seo.imageUrl }),
    metaTag({ property: "og:image:alt", content: seo.imageAlt }),
    metaTag({ name: "twitter:card", content: "summary_large_image" }),
    metaTag({ name: "twitter:title", content: seo.title }),
    metaTag({ name: "twitter:description", content: seo.description }),
    metaTag({ name: "twitter:image", content: seo.imageUrl }),
  ];

  for (const node of seo.jsonLd) {
    tags.push(
      `<script type="application/ld+json">${JSON.stringify(node).replace(/</g, "\\u003c")}</script>`,
    );
  }

  return tags.join("\n    ");
}

/**
 * Injects SEO head tags and crawler-visible SSR markup into the Vite `index.html` shell.
 * The SPA still mounts into `#root`; `#seo-ssr` is removed after client hydration.
 */
export function injectSeoIntoHtml(templateHtml: string, seo: ResolvedPageSeo): string {
  let html = templateHtml;

  html = html.replace(/<title>[\s\S]*?<\/title>/i, "");
  html = html.replace(/<meta\s+name=["']description["'][^>]*>/i, "");
  html = html.replace(/<meta\s+name=["']robots["'][^>]*>/i, "");
  html = html.replace(/<link\s+rel=["']canonical["'][^>]*>/i, "");

  const headTags = buildHeadTags(seo);
  html = html.replace(/<\/head>/i, `    ${headTags}\n  </head>`);

  const ssrBlock = seo.ssrHtml
    ? `<div id="seo-ssr">${seo.ssrHtml}</div>\n    <div id="root"></div>`
    : `<div id="root"></div>`;

  html = html.replace(/<div id="root"><\/div>/i, ssrBlock);

  return html;
}
