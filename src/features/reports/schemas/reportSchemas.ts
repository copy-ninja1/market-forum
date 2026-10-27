import { z } from "zod";
import { REPORT_DETAILS_MAX } from "@/constants/app.constants";

export const createReportSchema = z.object({
  listingId: z.string().min(1),
  reasonCode: z.enum(["misleading", "prohibited", "spam", "safety", "other"]),
  details: z
    .string()
    .trim()
    .max(REPORT_DETAILS_MAX, `Details must be ${REPORT_DETAILS_MAX} characters or fewer.`)
    .optional()
    .or(z.literal("")),
});

export const moderateReportSchema = z.object({
  reportId: z.string().min(1),
  action: z.enum(["dismiss", "hide", "remove"]),
  reason: z
    .string()
    .trim()
    .min(3, "Provide a moderation reason.")
    .max(500, "Reason must be 500 characters or fewer."),
});

export type CreateReportSchema = z.infer<typeof createReportSchema>;
export type ModerateReportSchema = z.infer<typeof moderateReportSchema>;
