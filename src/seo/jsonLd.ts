import { absoluteUrl, normalizeSiteUrl } from "@/seo/absoluteUrl";
import type { PublicListingSeoSource, PublicMemberSeoSource } from "@/seo/seo.types";

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

export function buildMemberProfileJsonLd(
  siteUrl: string,
  member: PublicMemberSeoSource,
): Record<string, unknown> {
  const path = `/members/${encodeURIComponent(member.uid)}`;
  const institution = member.institution.trim();
  const person: Record<string, unknown> = {
    "@type": "Person",
    name: member.displayName,
    url: absoluteUrl(path, siteUrl),
  };

  if (institution) {
    person.affiliation = {
      "@type": "Organization",
      name: institution,
    };
  }

  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: person,
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
      "@type": "Person",
      name: listing.ownerDisplayName,
      ...(listing.ownerUid
        ? { url: absoluteUrl(`/members/${encodeURIComponent(listing.ownerUid)}`, origin) }
        : {}),
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
        ...(listing.ownerUid
          ? { url: absoluteUrl(`/members/${encodeURIComponent(listing.ownerUid)}`, origin) }
          : {}),
      },
    },
  };

  if (listing.imageUrl) {
    product.image = [listing.imageUrl];
  }

  return product;
}
