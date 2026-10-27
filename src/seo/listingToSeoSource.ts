import type { Listing } from "@/features/listings/types/listing.interfaces";
import type { PublicListingSeoSource } from "@/seo/seo.types";

export function listingToSeoSource(listing: Listing): PublicListingSeoSource {
  const primaryImage = listing.images[0];
  return {
    id: listing.id,
    title: listing.title,
    description: listing.description,
    price: listing.price,
    currencyCode: listing.currencyCode,
    status: listing.status,
    categoryName: listing.categoryName,
    locationLabel: listing.locationLabel,
    condition: listing.condition,
    ownerDisplayName: listing.ownerDisplayName,
    imageUrl: primaryImage?.url ?? null,
    imageAlt: primaryImage?.altText ?? listing.title,
    updatedAtIso: listing.updatedAt.toISOString(),
  };
}
