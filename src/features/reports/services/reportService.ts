import { moderateReportSchema, createReportSchema } from "@/features/reports/schemas/reportSchemas";
import { reportRepository } from "@/features/reports/repositories/reportRepository";
import { listingRepository } from "@/features/listings/repositories/listingRepository";
import { deleteImagesByPaths } from "@/features/listings/services/listingImageService";
import type { AuthUser } from "@/features/auth/types/auth.interfaces";
import type { CreateReportInput, Report } from "@/features/reports/types/report.interfaces";
import type { ModerationAction, ReportStatus } from "@/features/reports/types/report.types";

function mapModerationStatus(action: Exclude<ModerationAction, "none">): ReportStatus {
  return action === "dismiss" ? "dismissed" : "resolved";
}

export async function createReport(
  reporterUid: string,
  input: unknown,
): Promise<Report> {
  const parsed = createReportSchema.parse(input);
  const listing = await listingRepository.getById(parsed.listingId);
  if (!listing) {
    throw new Error("Listing not found.");
  }

  const payload: CreateReportInput = {
    listingId: parsed.listingId,
    reasonCode: parsed.reasonCode,
    ...(parsed.details !== undefined && parsed.details !== ""
      ? { details: parsed.details }
      : {}),
  };

  return reportRepository.create(reporterUid, payload);
}

export async function moderateReport(
  moderator: AuthUser,
  input: unknown,
): Promise<Report> {
  if (!moderator.isAdmin) {
    throw new Error("You do not have permission to moderate reports.");
  }

  const parsed = moderateReportSchema.parse(input);
  const existing = await reportRepository.getById(parsed.reportId);
  if (!existing) {
    throw new Error("Report not found.");
  }

  const moderated = await reportRepository.moderate({
    reportId: parsed.reportId,
    status: mapModerationStatus(parsed.action),
    reviewedByUid: moderator.uid,
    moderationAction: parsed.action,
    moderationReason: parsed.reason,
  });

  if (parsed.action === "hide") {
    await listingRepository.updateStatus(existing.listingId, "hidden");
  }

  if (parsed.action === "remove") {
    const listing = await listingRepository.getById(existing.listingId);
    if (listing) {
      await deleteImagesByPaths(listing.images.map((image) => image.storagePath));
      await listingRepository.delete(existing.listingId);
    }
  }

  return moderated;
}

export const reportService = {
  createReport,
  moderateReport,
};
