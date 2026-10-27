import { Button } from "@heroui/react";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
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

  const openCount = reports.filter((report) => report.status === "open" || report.status === "reviewing").length;

  return (
    <div className="space-y-8">
      <PageHeader
        actions={
          <Button variant="secondary" onPress={() => void reload()}>
            Refresh
          </Button>
        }
        description="Review reports and record a reason when you hide or dismiss a listing."
        eyebrow="Trust"
        title="Moderation queue"
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard hint="Waiting in this view" label="In queue" value={reports.length} />
        <StatCard hint="Open or still in review" label="Needs action" value={openCount} />
        <StatCard hint="Resolved or dismissed" label="Closed" value={reports.length - openCount} />
      </div>

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
