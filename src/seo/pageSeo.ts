import {
  buildBreadcrumbJsonLd,
  buildListingProductJsonLd,
  buildMemberProfileJsonLd,
  buildOrganizationJsonLd,
  buildWebsiteJsonLd,
} from "@/seo/jsonLd";
import { resolvePageSeo } from "@/seo/resolvePageSeo";
import {
  buildBrowseSsrHtml,
  buildHomeSsrHtml,
  buildListingSsrHtml,
  buildMemberSsrHtml,
  buildPrivateSsrHtml,
} from "@/seo/ssrContent";
import { truncatePlainText } from "@/seo/escapeHtml";
import type {
  PageSeoInput,
  PublicListingSeoSource,
  PublicMemberSeoSource,
  ResolvedPageSeo,
} from "@/seo/seo.types";

export function homePageSeo(siteUrl: string, appName: string): ResolvedPageSeo {
  return resolvePageSeo(
    {
      title: appName,
      description:
        "Campus marketplace where students browse listings, publish items, and contact sellers. Search textbooks, gear, and dorm essentials.",
      path: "/",
      jsonLd: [buildWebsiteJsonLd(siteUrl, appName), buildOrganizationJsonLd(siteUrl, appName)],
      ssrHtml: buildHomeSsrHtml(appName),
    },
    siteUrl,
    appName,
  );
}

export function browsePageSeo(
  siteUrl: string,
  appName: string,
  query?: string,
): ResolvedPageSeo {
  const trimmedQuery = query?.trim();
  const title = trimmedQuery ? `Search “${trimmedQuery}”` : "Browse listings";
  const description = trimmedQuery
    ? `Active campus listings matching “${trimmedQuery}” on ${appName}.`
    : `Browse active campus listings on ${appName}. Filter by category, availability, and price.`;

  return resolvePageSeo(
    {
      title,
      description,
      path: trimmedQuery ? `/browse?q=${encodeURIComponent(trimmedQuery)}` : "/browse",
      jsonLd: [
        buildBreadcrumbJsonLd(siteUrl, [
          { name: "Home", path: "/" },
          { name: "Browse", path: "/browse" },
        ]),
      ],
      ssrHtml: buildBrowseSsrHtml(appName, trimmedQuery),
    },
    siteUrl,
    appName,
  );
}

export function listingPageSeo(
  siteUrl: string,
  appName: string,
  listing: PublicListingSeoSource,
): ResolvedPageSeo {
  const description = truncatePlainText(
    `${listing.title} for ${listing.price} ${listing.currencyCode} in ${listing.locationLabel}. ${listing.description}`,
    160,
  );

  return resolvePageSeo(
    {
      title: listing.title,
      description,
      path: `/listings/${listing.id}`,
      type: "product",
      imageUrl: listing.imageUrl ?? undefined,
      imageAlt: listing.imageAlt ?? listing.title,
      robots: listing.status === "hidden" ? "noindex,follow" : "index,follow",
      jsonLd: [
        buildBreadcrumbJsonLd(siteUrl, [
          { name: "Home", path: "/" },
          { name: "Browse", path: "/browse" },
          { name: listing.title, path: `/listings/${listing.id}` },
        ]),
        buildListingProductJsonLd(siteUrl, listing),
      ],
      ssrHtml: buildListingSsrHtml(listing),
    },
    siteUrl,
    appName,
  );
}

export function memberPageSeo(
  siteUrl: string,
  appName: string,
  member: PublicMemberSeoSource,
): ResolvedPageSeo {
  const institution = member.institution.trim();
  const description = institution
    ? `Public profile for ${member.displayName} at ${institution}. Current listings on ${appName}.`
    : `Public profile for ${member.displayName}. Current listings on ${appName}.`;

  return resolvePageSeo(
    {
      title: member.displayName,
      description,
      path: `/members/${encodeURIComponent(member.uid)}`,
      jsonLd: [
        buildBreadcrumbJsonLd(siteUrl, [
          { name: "Home", path: "/" },
          { name: "Listings", path: "/browse" },
          {
            name: member.displayName,
            path: `/members/${encodeURIComponent(member.uid)}`,
          },
        ]),
        buildMemberProfileJsonLd(siteUrl, member),
      ],
      ssrHtml: buildMemberSsrHtml(member),
    },
    siteUrl,
    appName,
  );
}

export function memberNotFoundSeo(siteUrl: string, appName: string): ResolvedPageSeo {
  return resolvePageSeo(
    {
      title: "Member not found",
      description: `This member page is unavailable on ${appName}.`,
      path: "/browse",
      robots: "noindex,follow",
      ssrHtml: buildPrivateSsrHtml("Member not found"),
    },
    siteUrl,
    appName,
  );
}

export function listingNotFoundSeo(siteUrl: string, appName: string): ResolvedPageSeo {
  return resolvePageSeo(
    {
      title: "Listing not found",
      description: `This listing is unavailable on ${appName}.`,
      path: "/browse",
      robots: "noindex,follow",
      ssrHtml: buildPrivateSsrHtml("Listing not found"),
    },
    siteUrl,
    appName,
  );
}

function privatePage(
  title: string,
  description: string,
  path: string,
  siteUrl: string,
  appName: string,
): ResolvedPageSeo {
  return resolvePageSeo(
    {
      title,
      description,
      path,
      robots: "noindex,nofollow",
      ssrHtml: buildPrivateSsrHtml(title),
    },
    siteUrl,
    appName,
  );
}

export function signInPageSeo(siteUrl: string, appName: string): ResolvedPageSeo {
  return privatePage(
    "Sign in",
    `Sign in to ${appName} to post and manage campus listings.`,
    "/auth/sign-in",
    siteUrl,
    appName,
  );
}

export function signUpPageSeo(siteUrl: string, appName: string): ResolvedPageSeo {
  return privatePage(
    "Create account",
    `Create a ${appName} account to publish campus marketplace listings.`,
    "/auth/sign-up",
    siteUrl,
    appName,
  );
}

export function passwordResetPageSeo(siteUrl: string, appName: string): ResolvedPageSeo {
  return privatePage(
    "Reset password",
    `Reset your ${appName} account password.`,
    "/auth/password-reset",
    siteUrl,
    appName,
  );
}

export function authActionPageSeo(siteUrl: string, appName: string): ResolvedPageSeo {
  return privatePage(
    "Confirm account",
    `Complete an email confirmation for your ${appName} account.`,
    "/auth/action",
    siteUrl,
    appName,
  );
}

export function createListingPageSeo(siteUrl: string, appName: string): ResolvedPageSeo {
  return privatePage(
    "Post a listing",
    `Create a new campus listing on ${appName}.`,
    "/listings/new",
    siteUrl,
    appName,
  );
}

export function editListingPageSeo(
  siteUrl: string,
  appName: string,
  listingId: string,
): ResolvedPageSeo {
  return privatePage(
    "Edit listing",
    `Edit your campus listing on ${appName}.`,
    `/listings/${listingId}/edit`,
    siteUrl,
    appName,
  );
}

export function myListingsPageSeo(siteUrl: string, appName: string): ResolvedPageSeo {
  return privatePage(
    "My listings",
    `Manage your ${appName} listings.`,
    "/my-listings",
    siteUrl,
    appName,
  );
}

export function profilePageSeo(siteUrl: string, appName: string): ResolvedPageSeo {
  return privatePage(
    "Profile",
    `Manage your ${appName} profile.`,
    "/profile",
    siteUrl,
    appName,
  );
}

export function adminPageSeo(
  siteUrl: string,
  appName: string,
  path: string,
  title: string,
): ResolvedPageSeo {
  return privatePage(title, `${title} for ${appName} administrators.`, path, siteUrl, appName);
}

export function forbiddenPageSeo(siteUrl: string, appName: string): ResolvedPageSeo {
  return privatePage(
    "Access denied",
    `You do not have permission to view this ${appName} page.`,
    "/forbidden",
    siteUrl,
    appName,
  );
}

export function notFoundPageSeo(siteUrl: string, appName: string): ResolvedPageSeo {
  return resolvePageSeo(
    {
      title: "Page not found",
      description: `The requested page could not be found on ${appName}.`,
      path: "/",
      robots: "noindex,follow",
      ssrHtml: buildPrivateSsrHtml("Page not found"),
    } satisfies PageSeoInput,
    siteUrl,
    appName,
  );
}
