import { Button } from "@heroui/react";
import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ErrorState } from "@/components/ui/ErrorState";
import { SORT_LABELS } from "@/constants/listing.constants";
import { ROUTES } from "@/constants/route.constants";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { ListingCatalog } from "@/features/listings/components/ListingCatalog";
import { ListingFilters } from "@/features/listings/components/ListingFilters";
import { ListingSearch } from "@/features/listings/components/ListingSearch";
import { useListings } from "@/features/listings/hooks/useListings";
import type { ListingFilters as ListingFiltersState } from "@/features/listings/types/listing.interfaces";
import type { ListingAvailabilityFilter, ListingSortOption } from "@/features/listings/types/listing.types";
import { useDebounce } from "@/hooks/useDebounce";
import { browsePageSeo, DocumentHead, useSiteSeoConfig } from "@/seo";

const AVAILABILITY_LABELS: Record<ListingAvailabilityFilter, string> = {
  active: "Available",
  sold: "Sold",
  unavailable: "Unavailable",
  all: "All public",
};

function formatResultCount(count: number, hasMore: boolean): string {
  const noun = count === 1 ? "listing" : "listings";
  return hasMore ? `Showing ${count} ${noun}` : `${count} ${noun}`;
}

export function BrowseListingsPage() {
  const [searchParams] = useSearchParams();
  const { appName, siteUrl } = useSiteSeoConfig();
  const [searchTerm, setSearchTerm] = useState(() => searchParams.get("q") ?? "");
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

  const selectedCategory = categories.find((category) => category.id === categoryId);
  const hasCustomFilters =
    searchTerm.trim().length > 0 ||
    categoryId.length > 0 ||
    availability !== "active" ||
    sort !== "newest";

  const resetFilters = () => {
    setSearchTerm("");
    setCategoryId("");
    setAvailability("active");
    setSort("newest");
  };

  const resultLabel = isLoading
    ? "Loading the catalog…"
    : formatResultCount(listings.length, hasMore);

  return (
    <div className="space-y-6">
      <DocumentHead seo={browsePageSeo(siteUrl, appName, debouncedSearch || undefined)} />

      <header className="flex flex-col gap-5 border-b border-campus-ink/10 pb-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-campus-ink/50">
            Catalog
          </p>
          <h1 className="font-display mt-2 text-4xl tracking-tight text-campus-ink md:text-5xl">
            Listings
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-campus-ink/70 md:text-base">
            Search active campus listings, narrow by category and availability, and open a record for price, condition, and seller contact.
          </p>
        </div>
        <Link to={ROUTES.createListing}>
          <Button variant="primary">Post a listing</Button>
        </Link>
      </header>

      <div className="grid items-start gap-6 lg:grid-cols-[18rem_minmax(0,1fr)]">
        <aside className="rounded-xl border border-campus-ink/10 bg-white p-4 lg:sticky lg:top-28">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-campus-ink/50">
              Refine
            </h2>
            {hasCustomFilters ? (
              <button
                className="text-sm font-semibold text-campus-ink underline-offset-4 hover:underline"
                type="button"
                onClick={resetFilters}
              >
                Clear
              </button>
            ) : null}
          </div>
          <div className="space-y-4">
            <ListingSearch
              placeholder="Search by title…"
              value={searchTerm}
              onChange={setSearchTerm}
            />
            <ListingFilters
              availability={availability}
              categories={categories}
              categoryId={categoryId}
              isCategoriesLoading={isCategoriesLoading}
              layout="stack"
              sort={sort}
              onAvailabilityChange={setAvailability}
              onCategoryChange={setCategoryId}
              onSortChange={setSort}
            />
          </div>
        </aside>

        <section aria-label="Listing results" className="space-y-4">
          <div className="flex flex-col gap-2 rounded-xl border border-campus-ink/10 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p aria-live="polite" className="text-sm font-semibold text-campus-ink">
              {resultLabel}
            </p>
            <p className="text-sm text-campus-ink/60">
              {AVAILABILITY_LABELS[availability]}
              {" · "}
              {selectedCategory?.name ?? "All categories"}
              {" · "}
              {SORT_LABELS[sort]}
            </p>
          </div>

          {categoriesError ? (
            <ErrorState
              message={categoriesError}
              retryLabel="Retry categories"
              onRetry={() => window.location.reload()}
            />
          ) : null}

          {error ? <ErrorState message={error} onRetry={() => void reload()} /> : null}

          <ListingCatalog
            emptyDescription={
              hasCustomFilters
                ? "No listings match these filters. Clear them or try another search."
                : "Active listings will appear here as members post them."
            }
            emptyTitle={hasCustomFilters ? "No matching listings" : "No listings yet"}
            isLoading={isLoading}
            listings={listings}
          />

          {hasMore ? (
            <div className="flex justify-center pt-1">
              <Button
                isDisabled={isLoadingMore}
                variant="secondary"
                onPress={() => void loadMore()}
              >
                {isLoadingMore ? "Loading…" : "Load more"}
              </Button>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
