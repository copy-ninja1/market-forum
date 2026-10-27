import { ListingCard } from "@/features/listings/components/ListingCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingState } from "@/components/ui/LoadingState";
import type { ListingGridProps } from "@/features/listings/types/listing.interfaces";

export function ListingGrid({
  listings,
  isLoading = false,
  emptyTitle = "No listings yet",
  emptyDescription = "Try adjusting filters or check back soon for new posts.",
  emptyAction,
}: ListingGridProps) {
  if (isLoading && listings.length === 0) {
    return <LoadingState message="Loading listings…" />;
  }

  if (!isLoading && listings.length === 0) {
    return (
      <EmptyState action={emptyAction} description={emptyDescription} title={emptyTitle} />
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {listings.map((listing) => (
        <li key={listing.id}>
          <ListingCard listing={listing} />
        </li>
      ))}
    </ul>
  );
}
