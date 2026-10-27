import { useCallback, useEffect, useRef, useState } from "react";
import { PAGE_SIZE } from "@/constants/app.constants";
import { listingService } from "@/features/listings/services/listingService";
import type { Listing, ListingFilters } from "@/features/listings/types/listing.interfaces";
import { getErrorMessage } from "@/utils/error.utils";

export function useListings(filters: ListingFilters) {
  const [listings, setListings] = useState<readonly Listing[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const filtersKeyRef = useRef("");

  const filtersKey = JSON.stringify(filters);

  const loadInitial = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const page = await listingService.listPublic({
        filters,
        pageSize: PAGE_SIZE,
        cursor: null,
      });
      setListings(page.items);
      setCursor(page.nextCursor);
      setHasMore(page.hasMore);
    } catch (cause) {
      setError(getErrorMessage(cause, "Could not load listings."));
      setListings([]);
      setCursor(null);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    if (filtersKeyRef.current === filtersKey) {
      return;
    }
    filtersKeyRef.current = filtersKey;
    void loadInitial();
  }, [filtersKey, loadInitial]);

  const loadMore = useCallback(async () => {
    if (!hasMore || isLoadingMore || isLoading) {
      return;
    }

    setIsLoadingMore(true);
    setError(null);
    try {
      const page = await listingService.listPublic({
        filters,
        pageSize: PAGE_SIZE,
        cursor,
      });
      setListings((current) => [...current, ...page.items]);
      setCursor(page.nextCursor);
      setHasMore(page.hasMore);
    } catch (cause) {
      setError(getErrorMessage(cause, "Could not load more listings."));
    } finally {
      setIsLoadingMore(false);
    }
  }, [cursor, filters, hasMore, isLoading, isLoadingMore]);

  const reload = useCallback(async () => {
    filtersKeyRef.current = "";
    await loadInitial();
  }, [loadInitial]);

  return {
    listings,
    hasMore,
    isLoading,
    isLoadingMore,
    error,
    loadMore,
    reload,
  };
}
