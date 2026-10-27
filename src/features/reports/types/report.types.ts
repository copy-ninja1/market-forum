export type ReportReasonCode =
  | "misleading"
  | "prohibited"
  | "spam"
  | "safety"
  | "other";

export type ReportStatus = "open" | "reviewing" | "resolved" | "dismissed";

export type ModerationAction = "dismiss" | "hide" | "remove" | "none";
