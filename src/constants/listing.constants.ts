import type { ListingCondition, ListingSortOption, ListingStatus } from "@/features/listings/types/listing.types";

export const LISTING_CONDITIONS: readonly ListingCondition[] = [
  "new",
  "like-new",
  "good",
  "fair",
] as const;

export const LISTING_STATUSES: readonly ListingStatus[] = [
  "active",
  "sold",
  "unavailable",
  "hidden",
] as const;

export const PUBLIC_LISTING_STATUSES: readonly ListingStatus[] = ["active"] as const;

export const OWNER_EDITABLE_STATUSES: readonly ListingStatus[] = [
  "active",
  "sold",
  "unavailable",
] as const;

export const LISTING_SORT_OPTIONS: readonly ListingSortOption[] = [
  "newest",
  "price-ascending",
  "price-descending",
] as const;

export const CONDITION_LABELS: Record<ListingCondition, string> = {
  new: "New",
  "like-new": "Like new",
  good: "Good",
  fair: "Fair",
};

export const STATUS_LABELS: Record<ListingStatus, string> = {
  active: "Available",
  sold: "Sold",
  unavailable: "Unavailable",
  hidden: "Hidden",
};

export const SORT_LABELS: Record<ListingSortOption, string> = {
  newest: "Newest",
  "price-ascending": "Price: low to high",
  "price-descending": "Price: high to low",
};
