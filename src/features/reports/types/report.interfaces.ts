import type { ModerationAction, ReportReasonCode, ReportStatus } from "./report.types";

export interface Report {
  readonly id: string;
  readonly listingId: string;
  readonly reporterUid: string;
  readonly reasonCode: ReportReasonCode;
  readonly details: string;
  readonly status: ReportStatus;
  readonly createdAt: Date;
  readonly reviewedAt: Date | null;
  readonly reviewedByUid: string | null;
  readonly moderationAction: ModerationAction;
  readonly moderationReason: string | null;
}

export interface CreateReportInput {
  readonly listingId: string;
  readonly reasonCode: ReportReasonCode;
  readonly details?: string;
}

export interface ModerateReportInput {
  readonly reportId: string;
  readonly action: Exclude<ModerationAction, "none">;
  readonly reason: string;
}
