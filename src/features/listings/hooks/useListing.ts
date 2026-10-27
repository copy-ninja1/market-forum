import { useCallback, useEffect, useState } from "react";
import { listingService } from "@/features/listings/services/listingService";
import type { Listing } from "@/features/listings/types/listing.interfaces";
import { getErrorMessage } from "@/utils/error.utils";

export function useListing(listingId: string | undefined) {
  const [listing, setListing] = useState<Listing | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(listingId));
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const load = useCallback(async () => {
    if (!listingId) {
      setListing(null);
      setIsLoading(false);
      setNotFound(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    setNotFound(false);
    try {
      const next = await listingService.getListing(listingId);
      if (!next) {
        setListing(null);
        setNotFound(true);
        return;
      }
      setListing(next);
    } catch (cause) {
      setError(getErrorMessage(cause, "Could not load listing."));
      setListing(null);
    } finally {
      setIsLoading(false);
    }
  }, [listingId]);

  useEffect(() => {
    void load();
  }, [load]);

  return {
    listing,
    isLoading,
    error,
    notFound,
    reload: load,
  };
}
