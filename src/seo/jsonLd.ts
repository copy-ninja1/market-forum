import { absoluteUrl, normalizeSiteUrl } from "@/seo/siteUrl";
import type { PublicListingSeoSource } from "@/seo/seo.types";

export function buildWebsiteJsonLd(siteUrl: string, appName: string): Record<string, unknown> {
  const origin = normalizeSiteUrl(siteUrl);
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: appName,
    url: origin,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${origin}/browse?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function buildOrganizationJsonLd(
  siteUrl: string,
  appName: string,
): Record<string, unknown> {
  const origin = normalizeSiteUrl(siteUrl);
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: appName,
    url: origin,
    logo: absoluteUrl("/logo.png", origin),
  };
}

export function buildBreadcrumbJsonLd(
  siteUrl: string,
  items: readonly { readonly name: string; readonly path: string }[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path, siteUrl),
    })),
  };
}

export function buildListingProductJsonLd(
  siteUrl: string,
  listing: PublicListingSeoSource,
): Record<string, unknown> {
  const origin = normalizeSiteUrl(siteUrl);
  const availability =
    listing.status === "active"
      ? "https://schema.org/InStock"
      : listing.status === "sold"
        ? "https://schema.org/SoldOut"
        : "https://schema.org/OutOfStock";

  const product: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: listing.title,
    description: listing.description,
    category: listing.categoryName,
    sku: listing.id,
    url: absoluteUrl(`/listings/${listing.id}`, origin),
    brand: {
      "@type": "Organization",
      name: listing.ownerDisplayName,
    },
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/listings/${listing.id}`, origin),
      priceCurrency: listing.currencyCode,
      price: listing.price.toFixed(2),
      availability,
      itemCondition: "https://schema.org/UsedCondition",
      seller: {
        "@type": "Person",
        name: listing.ownerDisplayName,
      },
    },
  };

  if (listing.imageUrl) {
    product.image = [listing.imageUrl];
  }

  return product;
}
