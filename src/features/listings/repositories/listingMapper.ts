import { Timestamp } from "firebase/firestore";
import type { ListingImage, Listing } from "@/features/listings/types/listing.interfaces";
import type {
  ContactType,
  ListingCondition,
  ListingStatus,
} from "@/features/listings/types/listing.types";

export type ListingImageFirestore = {
  readonly url: string;
  readonly storagePath: string;
  readonly altText: string;
};

export type ListingFirestoreRecord = {
  readonly ownerUid: string;
  readonly ownerDisplayName: string;
  readonly title: string;
  readonly description: string;
  readonly categoryId: string;
  readonly categoryName: string;
  readonly price: number;
  readonly currencyCode: string;
  readonly condition: ListingCondition;
  readonly locationLabel: string;
  readonly images: readonly ListingImageFirestore[];
  readonly contactType: ContactType;
  readonly contactValue: string;
  readonly status: ListingStatus;
  readonly searchKeywords: readonly string[];
  readonly createdAt: Timestamp;
  readonly updatedAt: Timestamp;
};

function isListingCondition(value: unknown): value is ListingCondition {
  return value === "new" || value === "like-new" || value === "good" || value === "fair";
}

function isListingStatus(value: unknown): value is ListingStatus {
  return (
    value === "active" ||
    value === "sold" ||
    value === "unavailable" ||
    value === "hidden"
  );
}

function isContactType(value: unknown): value is ContactType {
  return value === "email" || value === "phone" || value === "other";
}

function toDate(value: unknown, field: string): Date {
  if (value instanceof Timestamp) {
    return value.toDate();
  }
  if (value instanceof Date) {
    return value;
  }
  throw new Error(`Listing field "${field}" is not a valid timestamp.`);
}

function mapListingImage(value: unknown): ListingImage | null {
  if (typeof value !== "object" || value === null) {
    return null;
  }
  const record = value as Record<string, unknown>;
  if (
    typeof record.url !== "string" ||
    typeof record.storagePath !== "string" ||
    typeof record.altText !== "string"
  ) {
    return null;
  }
  return {
    url: record.url,
    storagePath: record.storagePath,
    altText: record.altText,
  };
}

function mapImages(value: unknown): readonly ListingImage[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .map((item) => mapListingImage(item))
    .filter((item): item is ListingImage => item !== null);
}

export function mapListingFromFirestore(id: string, data: unknown): Listing {
  if (typeof data !== "object" || data === null) {
    throw new Error("Listing document data is invalid.");
  }

  const record = data as Record<string, unknown>;

  if (typeof record.ownerUid !== "string") {
    throw new Error("Listing is missing ownerUid.");
  }
  if (typeof record.ownerDisplayName !== "string") {
    throw new Error("Listing is missing ownerDisplayName.");
  }
  if (typeof record.title !== "string") {
    throw new Error("Listing is missing title.");
  }
  if (typeof record.description !== "string") {
    throw new Error("Listing is missing description.");
  }
  if (typeof record.categoryId !== "string") {
    throw new Error("Listing is missing categoryId.");
  }
  if (typeof record.categoryName !== "string") {
    throw new Error("Listing is missing categoryName.");
  }
  if (typeof record.price !== "number") {
    throw new Error("Listing is missing price.");
  }
  if (typeof record.currencyCode !== "string") {
    throw new Error("Listing is missing currencyCode.");
  }
  if (!isListingCondition(record.condition)) {
    throw new Error("Listing has an invalid condition.");
  }
  if (typeof record.locationLabel !== "string") {
    throw new Error("Listing is missing locationLabel.");
  }
  if (!isContactType(record.contactType)) {
    throw new Error("Listing has an invalid contactType.");
  }
  if (typeof record.contactValue !== "string") {
    throw new Error("Listing is missing contactValue.");
  }
  if (!isListingStatus(record.status)) {
    throw new Error("Listing has an invalid status.");
  }

  const keywords = Array.isArray(record.searchKeywords)
    ? record.searchKeywords.filter((token): token is string => typeof token === "string")
    : [];

  return {
    id,
    ownerUid: record.ownerUid,
    ownerDisplayName: record.ownerDisplayName,
    title: record.title,
    description: record.description,
    categoryId: record.categoryId,
    categoryName: record.categoryName,
    price: record.price,
    currencyCode: record.currencyCode,
    condition: record.condition,
    locationLabel: record.locationLabel,
    images: mapImages(record.images),
    contactType: record.contactType,
    contactValue: record.contactValue,
    status: record.status,
    searchKeywords: keywords,
    createdAt: toDate(record.createdAt, "createdAt"),
    updatedAt: toDate(record.updatedAt, "updatedAt"),
  };
}

export function mapListingImagesToFirestore(
  images: readonly ListingImage[],
): readonly ListingImageFirestore[] {
  return images.map((image) => ({
    url: image.url,
    storagePath: image.storagePath,
    altText: image.altText,
  }));
}
