import { useCallback, useEffect, useState } from "react";
import { listingService } from "@/features/listings/services/listingService";
import type { Listing } from "@/features/listings/types/listing.interfaces";
import { getErrorMessage } from "@/utils/error.utils";

export function useMemberListings(ownerUid: string | undefined) {
  const [listings, setListings] = useState<readonly Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!ownerUid) {
      setListings([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const next = await listingService.listActiveByOwner(ownerUid);
      setListings(next);
    } catch (cause) {
      setListings([]);
      setError(getErrorMessage(cause, "Could not load this member's listings."));
    } finally {
      setIsLoading(false);
    }
  }, [ownerUid]);

  useEffect(() => {
    void load();
  }, [load]);

  return {
    listings,
    isLoading,
    error,
    reload: load,
  };
}
