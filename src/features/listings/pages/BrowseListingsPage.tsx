import { Button } from "@heroui/react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ErrorState } from "@/components/ui/ErrorState";
import { PageHeader } from "@/components/ui/PageHeader";
import { ROUTES } from "@/constants/route.constants";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { ListingFilters } from "@/features/listings/components/ListingFilters";
import { ListingGrid } from "@/features/listings/components/ListingGrid";
import { ListingSearch } from "@/features/listings/components/ListingSearch";
import { useListings } from "@/features/listings/hooks/useListings";
import type { ListingFilters as ListingFiltersState } from "@/features/listings/types/listing.interfaces";
import type { ListingAvailabilityFilter, ListingSortOption } from "@/features/listings/types/listing.types";
import { useDebounce } from "@/hooks/useDebounce";

export function BrowseListingsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [availability, setAvailability] = useState<ListingAvailabilityFilter>("active");
  const [sort, setSort] = useState<ListingSortOption>("newest");

  const debouncedSearch = useDebounce(searchTerm, 300);
  const { categories, isLoading: isCategoriesLoading, error: categoriesError } = useCategories();

  const filters = useMemo<ListingFiltersState>(
    () => ({
      searchTerm: debouncedSearch,
      categoryId: categoryId || undefined,
      availability,
      sort,
    }),
    [availability, categoryId, debouncedSearch, sort],
  );

  const { listings, hasMore, isLoading, isLoadingMore, error, loadMore, reload } = useListings(filters);

  return (
    <div className="space-y-6">
      <PageHeader
        actions={
          <Link to={ROUTES.createListing}>
            <Button variant="primary">Post a listing</Button>
          </Link>
        }
        description="Find textbooks, furniture, electronics, and more from students near you."
        title="Browse listings"
      />

      <div className="space-y-4">
        <ListingSearch value={searchTerm} onChange={setSearchTerm} />
        <ListingFilters
          availability={availability}
          categories={categories}
          categoryId={categoryId}
          isCategoriesLoading={isCategoriesLoading}
          sort={sort}
          onAvailabilityChange={setAvailability}
          onCategoryChange={setCategoryId}
          onSortChange={setSort}
        />
      </div>

      {categoriesError ? (
        <ErrorState message={categoriesError} retryLabel="Retry categories" onRetry={() => window.location.reload()} />
      ) : null}

      {error ? <ErrorState message={error} onRetry={() => void reload()} /> : null}

      <ListingGrid isLoading={isLoading} listings={listings} />

      {hasMore ? (
        <div className="flex justify-center pt-2">
          <Button isDisabled={isLoadingMore} variant="secondary" onPress={() => void loadMore()}>
            {isLoadingMore ? "Loading…" : "Load more"}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
