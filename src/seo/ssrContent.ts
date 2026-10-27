import { escapeHtml, truncatePlainText } from "@/seo/escapeHtml";
import type { PublicListingSeoSource, PublicMemberSeoSource } from "@/seo/seo.types";

export function buildHomeSsrHtml(appName: string): string {
  return `
<article class="seo-ssr">
  <h1>${escapeHtml(appName)}</h1>
  <p>Campus marketplace where students browse listings, publish items, and contact sellers directly. No checkout fees or in-app payments.</p>
  <ul>
    <li><a href="/browse">Browse active listings</a></li>
    <li><a href="/auth/sign-up">Create an account to post</a></li>
  </ul>
</article>`.trim();
}

export function buildBrowseSsrHtml(appName: string, query?: string): string {
  const heading = query
    ? `Browse listings for “${escapeHtml(query)}”`
    : "Browse campus marketplace listings";
  return `
<article class="seo-ssr">
  <h1>${heading}</h1>
  <p>Search ${escapeHtml(appName)} for textbooks, furniture, electronics, and other campus essentials posted by students.</p>
  <p><a href="/">Back to home</a></p>
</article>`.trim();
}

export function buildListingSsrHtml(listing: PublicListingSeoSource): string {
  const price = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: listing.currencyCode,
    maximumFractionDigits: 2,
  }).format(listing.price);
  const image = listing.imageUrl
    ? `<img src="${escapeHtml(listing.imageUrl)}" alt="${escapeHtml(listing.imageAlt ?? listing.title)}" width="800" height="600" />`
    : "";

  return `
<article class="seo-ssr" itemscope itemtype="https://schema.org/Product">
  <nav aria-label="Breadcrumb">
    <a href="/browse">Browse</a> / <span>${escapeHtml(listing.categoryName)}</span>
  </nav>
  ${image}
  <h1 itemprop="name">${escapeHtml(listing.title)}</h1>
  <p><strong itemprop="offers" itemscope itemtype="https://schema.org/Offer"><span itemprop="price">${escapeHtml(price)}</span></strong> · ${escapeHtml(listing.condition)} · ${escapeHtml(listing.locationLabel)}</p>
  <p>Posted by ${
    listing.ownerUid
      ? `<a href="/members/${escapeHtml(encodeURIComponent(listing.ownerUid))}">${escapeHtml(listing.ownerDisplayName)}</a>`
      : escapeHtml(listing.ownerDisplayName)
  }</p>
  <p itemprop="description">${escapeHtml(truncatePlainText(listing.description, 500))}</p>
  <p><a href="/browse">See more listings</a></p>
</article>`.trim();
}

export function buildMemberSsrHtml(member: PublicMemberSeoSource): string {
  const institution = member.institution.trim();
  return `
<article class="seo-ssr">
  <nav aria-label="Breadcrumb">
    <a href="/browse">Listings</a> / <span>${escapeHtml(member.displayName)}</span>
  </nav>
  <h1>${escapeHtml(member.displayName)}</h1>
  <p>${escapeHtml(institution || "Campus member")}</p>
  <p>Current public listings from this member.</p>
</article>`.trim();
}

export function buildPrivateSsrHtml(title: string): string {
  return `
<article class="seo-ssr">
  <h1>${escapeHtml(title)}</h1>
  <p>This page requires an account and is not indexed for search engines.</p>
</article>`.trim();
}
