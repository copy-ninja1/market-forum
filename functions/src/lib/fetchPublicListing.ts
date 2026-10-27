import type { PublicListingSeoSource } from "@/seo/seo.types";
import { ensureAdminApp } from "./admin";

function asIso(value: unknown): string {
  if (value && typeof value === "object" && "toDate" in value && typeof value.toDate === "function") {
    return (value as { toDate: () => Date }).toDate().toISOString();
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  return new Date().toISOString();
}

export async function fetchPublicListing(
  listingId: string,
): Promise<PublicListingSeoSource | null> {
  const db = ensureAdminApp();
  const snapshot = await db.collection("listings").doc(listingId).get();
  if (!snapshot.exists) {
    return null;
  }

  const data = snapshot.data();
  if (!data || typeof data !== "object") {
    return null;
  }

  const status = data.status;
  if (status !== "active" && status !== "sold" && status !== "unavailable") {
    return null;
  }

  const images = Array.isArray(data.images) ? data.images : [];
  const primary = images[0] as { url?: unknown; altText?: unknown } | undefined;

  return {
    id: snapshot.id,
    title: typeof data.title === "string" ? data.title : "Listing",
    description: typeof data.description === "string" ? data.description : "",
    price: typeof data.price === "number" ? data.price : 0,
    currencyCode: typeof data.currencyCode === "string" ? data.currencyCode : "USD",
    status,
    categoryName: typeof data.categoryName === "string" ? data.categoryName : "Campus",
    locationLabel: typeof data.locationLabel === "string" ? data.locationLabel : "Campus",
    condition: typeof data.condition === "string" ? data.condition : "good",
    ownerUid: typeof data.ownerUid === "string" ? data.ownerUid : "",
    ownerDisplayName:
      typeof data.ownerDisplayName === "string" ? data.ownerDisplayName : "Student",
    imageUrl: typeof primary?.url === "string" ? primary.url : null,
    imageAlt: typeof primary?.altText === "string" ? primary.altText : null,
    updatedAtIso: asIso(data.updatedAt),
  };
}

export type SitemapListingEntry = {
  readonly id: string;
  readonly updatedAtIso: string;
  readonly ownerUid: string;
};

export async function listActiveListingSitemapEntries(
  maxEntries = 5_000,
): Promise<readonly SitemapListingEntry[]> {
  const db = ensureAdminApp();
  const snapshot = await db
    .collection("listings")
    .where("status", "==", "active")
    .orderBy("updatedAt", "desc")
    .limit(maxEntries)
    .get();

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      updatedAtIso: asIso(data.updatedAt),
      ownerUid: typeof data.ownerUid === "string" ? data.ownerUid : "",
    };
  });
}
