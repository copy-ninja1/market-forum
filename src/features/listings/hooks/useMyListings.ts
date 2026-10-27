import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { listingService } from "@/features/listings/services/listingService";
import type { Listing } from "@/features/listings/types/listing.interfaces";
import { getErrorMessage } from "@/utils/error.utils";

export function useMyListings() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [listings, setListings] = useState<readonly Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user) {
      setListings([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const next = await listingService.listMine(user.uid);
      setListings(next);
    } catch (cause) {
      setError(getErrorMessage(cause, "Could not load your listings."));
      setListings([]);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }
    void load();
  }, [isAuthLoading, load]);

  return {
    listings,
    isLoading: isAuthLoading || isLoading,
    error,
    reload: load,
    setListings,
  };
}
