import { useCallback, useEffect, useState } from "react";
import { profileService } from "@/features/profiles/services/profileService";
import type { PublicProfile } from "@/features/profiles/types/profile.interfaces";
import { getErrorMessage } from "@/utils/error.utils";

export function usePublicProfile(uid: string | undefined) {
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!uid) {
      setProfile(null);
      setNotFound(true);
      setError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const next = await profileService.getPublicProfile(uid);
      setProfile(next);
      setNotFound(next === null);
    } catch (cause) {
      setProfile(null);
      setNotFound(false);
      setError(getErrorMessage(cause, "Could not load this member."));
    } finally {
      setIsLoading(false);
    }
  }, [uid]);

  useEffect(() => {
    void load();
  }, [load]);

  return {
    profile,
    isLoading,
    notFound,
    error,
    reload: load,
  };
}
