import type { Report } from "@/features/reports/types/report.interfaces";
import type { ModerationAction } from "@/features/reports/types/report.types";

export { REPORT_REASON_LABELS } from "@/features/reports/constants/report.constants";

export type ReportQueueItemProps = {
  readonly report: Report;
  readonly listingTitle: string | null;
  readonly isListingLoading: boolean;
  readonly isModerating: boolean;
  readonly onModerate: (input: {
    action: Exclude<ModerationAction, "none">;
    reason: string;
  }) => Promise<void>;
};

export type ModerateReportFormProps = {
  readonly reportId: string;
  readonly isSubmitting: boolean;
  readonly onSubmit: (input: { action: Exclude<ModerationAction, "none">; reason: string }) => void;
  readonly onCancel?: () => void;
};
