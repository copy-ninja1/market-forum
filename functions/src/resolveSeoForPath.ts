import {
  browsePageSeo,
  createListingPageSeo,
  editListingPageSeo,
  forbiddenPageSeo,
  homePageSeo,
  listingNotFoundSeo,
  listingPageSeo,
  memberNotFoundSeo,
  memberPageSeo,
  myListingsPageSeo,
  notFoundPageSeo,
  passwordResetPageSeo,
  authActionPageSeo,
  profilePageSeo,
  signInPageSeo,
  signUpPageSeo,
  adminPageSeo,
} from "@/seo/pageSeo";
import type { ResolvedPageSeo } from "@/seo/seo.types";
import { fetchPublicListing } from "./lib/fetchPublicListing";
import { fetchPublicMember } from "./lib/fetchPublicMember";

export async function resolveSeoForPath(
  pathname: string,
  search: string,
  siteUrl: string,
  appName: string,
): Promise<{ readonly seo: ResolvedPageSeo; readonly status: number }> {
  const path = pathname.replace(/\/+$/, "") || "/";
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);

  if (path === "/") {
    return { seo: homePageSeo(siteUrl, appName), status: 200 };
  }

  if (path === "/browse") {
    return {
      seo: browsePageSeo(siteUrl, appName, params.get("q") ?? undefined),
      status: 200,
    };
  }

  if (path === "/auth/sign-in") {
    return { seo: signInPageSeo(siteUrl, appName), status: 200 };
  }
  if (path === "/auth/sign-up") {
    return { seo: signUpPageSeo(siteUrl, appName), status: 200 };
  }
  if (path === "/auth/password-reset") {
    return { seo: passwordResetPageSeo(siteUrl, appName), status: 200 };
  }
  if (path === "/auth/action") {
    return { seo: authActionPageSeo(siteUrl, appName), status: 200 };
  }

  if (path === "/listings/new") {
    return { seo: createListingPageSeo(siteUrl, appName), status: 200 };
  }

  if (path === "/my-listings") {
    return { seo: myListingsPageSeo(siteUrl, appName), status: 200 };
  }

  if (path === "/profile") {
    return { seo: profilePageSeo(siteUrl, appName), status: 200 };
  }

  if (path === "/forbidden") {
    return { seo: forbiddenPageSeo(siteUrl, appName), status: 403 };
  }

  if (path === "/admin/reports") {
    return {
      seo: adminPageSeo(siteUrl, appName, "/admin/reports", "Moderation queue"),
      status: 200,
    };
  }

  if (path === "/admin/categories") {
    return {
      seo: adminPageSeo(siteUrl, appName, "/admin/categories", "Categories"),
      status: 200,
    };
  }

  const editMatch = /^\/listings\/([^/]+)\/edit$/.exec(path);
  if (editMatch?.[1]) {
    return {
      seo: editListingPageSeo(siteUrl, appName, editMatch[1]),
      status: 200,
    };
  }

  const listingMatch = /^\/listings\/([^/]+)$/.exec(path);
  if (listingMatch?.[1]) {
    const listing = await fetchPublicListing(listingMatch[1]);
    if (!listing) {
      return { seo: listingNotFoundSeo(siteUrl, appName), status: 404 };
    }
    return { seo: listingPageSeo(siteUrl, appName, listing), status: 200 };
  }

  const memberMatch = /^\/members\/([^/]+)$/.exec(path);
  if (memberMatch?.[1]) {
    let uid = memberMatch[1];
    try {
      uid = decodeURIComponent(uid);
    } catch {
      return { seo: memberNotFoundSeo(siteUrl, appName), status: 404 };
    }

    const member = await fetchPublicMember(uid);
    if (!member) {
      return { seo: memberNotFoundSeo(siteUrl, appName), status: 404 };
    }
    return { seo: memberPageSeo(siteUrl, appName, member), status: 200 };
  }

  return { seo: notFoundPageSeo(siteUrl, appName), status: 404 };
}
