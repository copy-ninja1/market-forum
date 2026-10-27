import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { listingService } from "@/features/listings/services/listingService";
import { reportService } from "@/features/reports/services/reportService";
import type { Report } from "@/features/reports/types/report.interfaces";
import type { ModerationAction } from "@/features/reports/types/report.types";
import { getErrorMessage } from "@/utils/error.utils";

export type ModerationQueueListingMeta = {
  readonly title: string | null;
  readonly isLoading: boolean;
};

export function useModerationQueue() {
  const { user } = useAuth();
  const [reports, setReports] = useState<readonly Report[]>([]);
  const [listingMeta, setListingMeta] = useState<Readonly<Record<string, ModerationQueueListingMeta>>>(
    {},
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [moderatingReportId, setModeratingReportId] = useState<string | null>(null);

  const loadListingTitles = useCallback(async (queue: readonly Report[]) => {
    const listingIds = [...new Set(queue.map((report) => report.listingId))];
    setListingMeta((previous) => {
      const next = { ...previous };
      for (const listingId of listingIds) {
        next[listingId] = { title: previous[listingId]?.title ?? null, isLoading: true };
      }
      return next;
    });

    await Promise.all(
      listingIds.map(async (listingId) => {
        try {
          const listing = await listingService.getListing(listingId);
          setListingMeta((previous) => ({
            ...previous,
            [listingId]: { title: listing?.title ?? null, isLoading: false },
          }));
        } catch {
          setListingMeta((previous) => ({
            ...previous,
            [listingId]: { title: null, isLoading: false },
          }));
        }
      }),
    );
  }, []);

  const load = useCallback(async () => {
    if (!user?.isAdmin) {
      setReports([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const queue = await reportService.listOpenReports(user);
      setReports(queue);
      void loadListingTitles(queue);
    } catch (cause) {
      setError(getErrorMessage(cause, "Could not load moderation queue."));
      setReports([]);
    } finally {
      setIsLoading(false);
    }
  }, [loadListingTitles, user]);

  useEffect(() => {
    void load();
  }, [load]);

  const moderate = useCallback(
    async (reportId: string, action: Exclude<ModerationAction, "none">, reason: string) => {
      if (!user?.isAdmin) {
        throw new Error("You do not have permission to moderate reports.");
      }

      setModeratingReportId(reportId);
      try {
        await reportService.moderateReport(user, { reportId, action, reason });
        await load();
      } finally {
        setModeratingReportId(null);
      }
    },
    [load, user],
  );

  return {
    reports,
    listingMeta,
    isLoading,
    error,
    moderatingReportId,
    reload: load,
    moderate,
  };
}
