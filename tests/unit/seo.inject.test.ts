import { describe, expect, it } from "vitest";
import { injectSeoIntoHtml } from "@/seo/injectSeoIntoHtml";
import { homePageSeo, listingPageSeo } from "@/seo/pageSeo";
import type { PublicListingSeoSource } from "@/seo/seo.types";

const APP_NAME = "Student Market Forum";
const SITE_URL = "https://campus.example.edu";

describe("injectSeoIntoHtml", () => {
  it("injects title, canonical, robots, and json-ld for the home page", () => {
    const template = `<!doctype html><html><head><title>Old</title><meta name="description" content="old" /></head><body><div id="root"></div></body></html>`;
    const html = injectSeoIntoHtml(template, homePageSeo(SITE_URL, APP_NAME));

    expect(html).toContain("<title>Student Market Forum</title>");
    expect(html).toContain(`href="${SITE_URL}/"`);
    expect(html).toContain('name="robots" content="index,follow"');
    expect(html).toContain("application/ld+json");
    expect(html).toContain('id="seo-ssr"');
    expect(html).toContain("Browse active listings");
  });

  it("marks private listing edit metadata as noindex via listing product schema path", () => {
    const listing: PublicListingSeoSource = {
      id: "abc123",
      title: "Used calculus textbook",
      description: "Barely used, no highlighting.",
      price: 35,
      currencyCode: "USD",
      status: "active",
      categoryName: "Textbooks",
      locationLabel: "North Quad",
      condition: "like-new",
      ownerUid: "seller-1",
      ownerDisplayName: "Alex",
      imageUrl: "https://cdn.example.edu/book.jpg",
      imageAlt: "Calculus textbook cover",
      updatedAtIso: "2026-10-01T12:00:00.000Z",
    };

    const template = `<!doctype html><html><head></head><body><div id="root"></div></body></html>`;
    const html = injectSeoIntoHtml(template, listingPageSeo(SITE_URL, APP_NAME, listing));

    expect(html).toContain("Used calculus textbook");
    expect(html).toContain('"@type":"Product"');
    expect(html).toContain(listing.imageUrl);
    expect(html).toContain(`href="${SITE_URL}/listings/abc123"`);
  });
});
