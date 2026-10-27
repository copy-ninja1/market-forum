import { Button } from "@heroui/react";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { ReportQueueItem } from "@/features/admin/components/ReportQueueItem";
import { useModerationQueue } from "@/features/admin/hooks/useModerationQueue";

export function ModerationQueuePage() {
  const { reports, listingMeta, isLoading, error, moderatingReportId, reload, moderate } =
    useModerationQueue();

  if (isLoading) {
    return <LoadingState message="Loading reports…" />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => void reload()} />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        actions={
          <Button variant="secondary" onPress={() => void reload()}>
            Refresh
          </Button>
        }
        description="Review open reports and take action on listings that violate campus guidelines."
        title="Moderation queue"
      />

      {reports.length === 0 ? (
        <EmptyState
          description="New reports from students will appear here for review."
          title="Queue is clear"
        />
      ) : (
        <ul className="space-y-4">
          {reports.map((report) => {
            const meta = listingMeta[report.listingId];
            return (
              <li key={report.id}>
                <ReportQueueItem
                  report={report}
                  listingTitle={meta?.title ?? null}
                  isListingLoading={meta?.isLoading ?? true}
                  isModerating={moderatingReportId === report.id}
                  onModerate={(input) => moderate(report.id, input.action, input.reason)}
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
