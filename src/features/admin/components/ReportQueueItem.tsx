import { Card } from "@heroui/react";
import { Link } from "react-router-dom";
import { listingDetailsPath } from "@/constants/route.constants";
import { ModerateReportForm } from "@/features/admin/components/ModerateReportForm";
import {
  REPORT_REASON_LABELS,
  type ReportQueueItemProps,
} from "@/features/admin/types/admin.interfaces";
import { formatRelativeDate } from "@/utils/date.utils";

export function ReportQueueItem({
  report,
  listingTitle,
  isListingLoading,
  isModerating,
  onModerate,
}: ReportQueueItemProps) {
  const listingLabel = isListingLoading
    ? "Loading listing…"
    : listingTitle ?? "Listing unavailable";

  return (
    <Card className="panel shadow-none">
      <Card.Content className="space-y-4 p-5 md:p-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-campus-ink/60">
              {report.status} · {formatRelativeDate(report.createdAt)}
            </p>
            <h2 className="font-display text-xl text-campus-ink">
              {REPORT_REASON_LABELS[report.reasonCode]}
            </h2>
            <p className="text-sm text-campus-ink/75">
              Listing:{" "}
              <Link
                className="text-campus-leaf hover:underline  rounded-sm"
                to={listingDetailsPath(report.listingId)}
              >
                {listingLabel}
              </Link>
            </p>
          </div>
          <p className="text-xs text-campus-ink/60">
            Report #{report.id.slice(0, 8)}
          </p>
        </div>

        {report.details ? (
          <blockquote className="rounded-lg bg-campus-mist/30 px-3 py-2 text-sm text-campus-ink/80">
            {report.details}
          </blockquote>
        ) : (
          <p className="text-sm italic text-campus-ink/60">
            No additional details provided.
          </p>
        )}

        <ModerateReportForm
          reportId={report.id}
          isSubmitting={isModerating}
          onSubmit={(input) => onModerate(input)}
        />
      </Card.Content>
    </Card>
  );
}
