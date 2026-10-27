import type { ReportReasonCode } from "@/features/reports/types/report.types";

export const REPORT_REASON_LABELS: Record<ReportReasonCode, string> = {
  misleading: "Misleading",
  prohibited: "Prohibited item",
  spam: "Spam",
  safety: "Safety concern",
  other: "Other",
};
