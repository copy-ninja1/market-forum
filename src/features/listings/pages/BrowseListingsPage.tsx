import { Button } from "@heroui/react";
import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ErrorState } from "@/components/ui/ErrorState";
import { MARKET_IMAGES } from "@/constants/marketing.constants";
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
  const [searchParams] = useSearchParams();
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

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[2rem] bg-campus-ink text-campus-paper">
        <img
          alt=""
          className="absolute inset-0 size-full object-cover opacity-40"
          height={640}
          src={MARKET_IMAGES.desk}
          width={1600}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-campus-ink via-campus-ink/80 to-campus-ink/35" />
        <div className="relative flex flex-col gap-6 px-6 py-10 md:flex-row md:items-end md:justify-between md:px-10 md:py-14">
          <div className="max-w-xl">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-white/70">
              Marketplace
            </p>
            <h1 className="font-display mt-2 text-4xl tracking-tight md:text-6xl">
              Browse listings
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-white/80 md:text-base">
              Textbooks, furniture, electronics, and the rest of campus — posted
              by people here.
            </p>
          </div>
          <Link to={ROUTES.createListing}>
            <Button className="bg-white text-campus-ink" variant="secondary">
              Post a listing
            </Button>
          </Link>
        </div>
      </section>

      <div className="panel space-y-5 p-4 md:p-6">
        <ListingSearch
          placeholder="Search by title…"
          value={searchTerm}
          onChange={setSearchTerm}
        />
        {categories.length > 0 ? (
          <div
            className="flex gap-2 overflow-x-auto pb-1"
            role="group"
            aria-label="Categories"
          >
            <button
              className={` shrink-0 rounded-full px-3.5 py-1.5 text-sm font-semibold ${
                categoryId === ""
                  ? "bg-campus-ink text-campus-paper"
                  : "bg-campus-mist/70 text-campus-ink"
              }`}
              type="button"
              onClick={() => setCategoryId("")}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                aria-pressed={categoryId === category.id}
                className={` shrink-0 rounded-full px-3.5 py-1.5 text-sm font-semibold ${
                  categoryId === category.id
                    ? "bg-campus-ink text-campus-paper"
                    : "bg-campus-mist/70 text-campus-ink"
                }`}
                type="button"
                onClick={() => setCategoryId(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        ) : null}
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
        <ErrorState
          message={categoriesError}
          retryLabel="Retry categories"
          onRetry={() => window.location.reload()}
        />
      ) : null}

      {error ? (
        <ErrorState message={error} onRetry={() => void reload()} />
      ) : null}

      <ListingGrid isLoading={isLoading} listings={listings} />

      {hasMore ? (
        <div className="flex justify-center pt-2">
          <Button
            isDisabled={isLoadingMore}
            variant="secondary"
            onPress={() => void loadMore()}
          >
            {isLoadingMore ? "Loading…" : "Load more"}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
