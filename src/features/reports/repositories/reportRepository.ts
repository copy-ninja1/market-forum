import {
  Timestamp,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import type { CreateReportInput, Report } from "@/features/reports/types/report.interfaces";
import type {
  ModerationAction,
  ReportReasonCode,
  ReportStatus,
} from "@/features/reports/types/report.types";
import { COLLECTIONS, getFirebaseFirestore } from "@/lib/firebase/firebaseFirestore";

type ReportFirestoreRecord = {
  readonly listingId: string;
  readonly reporterUid: string;
  readonly reasonCode: ReportReasonCode;
  readonly details: string;
  readonly status: ReportStatus;
  readonly createdAt: Timestamp;
  readonly reviewedAt: Timestamp | null;
  readonly reviewedByUid: string | null;
  readonly moderationAction: ModerationAction;
  readonly moderationReason: string | null;
};

function isReportReasonCode(value: unknown): value is ReportReasonCode {
  return (
    value === "misleading" ||
    value === "prohibited" ||
    value === "spam" ||
    value === "safety" ||
    value === "other"
  );
}

function isReportStatus(value: unknown): value is ReportStatus {
  return (
    value === "open" ||
    value === "reviewing" ||
    value === "resolved" ||
    value === "dismissed"
  );
}

function isModerationAction(value: unknown): value is ModerationAction {
  return value === "dismiss" || value === "hide" || value === "remove" || value === "none";
}

function toDate(value: unknown, field: string): Date {
  if (value instanceof Timestamp) {
    return value.toDate();
  }
  if (value instanceof Date) {
    return value;
  }
  throw new Error(`Report field "${field}" is not a valid timestamp.`);
}

function toNullableDate(value: unknown): Date | null {
  if (value === null || value === undefined) {
    return null;
  }
  if (value instanceof Timestamp) {
    return value.toDate();
  }
  if (value instanceof Date) {
    return value;
  }
  return null;
}

function mapReportFromFirestore(id: string, data: unknown): Report {
  if (typeof data !== "object" || data === null) {
    throw new Error("Report document data is invalid.");
  }

  const record = data as Record<string, unknown>;
  if (typeof record.listingId !== "string") {
    throw new Error("Report is missing listingId.");
  }
  if (typeof record.reporterUid !== "string") {
    throw new Error("Report is missing reporterUid.");
  }
  if (!isReportReasonCode(record.reasonCode)) {
    throw new Error("Report has an invalid reasonCode.");
  }
  if (typeof record.details !== "string") {
    throw new Error("Report is missing details.");
  }
  if (!isReportStatus(record.status)) {
    throw new Error("Report has an invalid status.");
  }
  if (!isModerationAction(record.moderationAction)) {
    throw new Error("Report has an invalid moderationAction.");
  }

  return {
    id,
    listingId: record.listingId,
    reporterUid: record.reporterUid,
    reasonCode: record.reasonCode,
    details: record.details,
    status: record.status,
    createdAt: toDate(record.createdAt, "createdAt"),
    reviewedAt: toNullableDate(record.reviewedAt),
    reviewedByUid:
      typeof record.reviewedByUid === "string" ? record.reviewedByUid : null,
    moderationAction: record.moderationAction,
    moderationReason:
      typeof record.moderationReason === "string" ? record.moderationReason : null,
  };
}

export type ModerateReportRepositoryInput = {
  readonly reportId: string;
  readonly status: ReportStatus;
  readonly reviewedByUid: string;
  readonly moderationAction: ModerationAction;
  readonly moderationReason: string;
};

class ReportRepository {
  private collectionRef() {
    return collection(getFirebaseFirestore(), COLLECTIONS.reports);
  }

  async create(reporterUid: string, input: CreateReportInput): Promise<Report> {
    const reportRef = doc(this.collectionRef());
    const payload: Omit<ReportFirestoreRecord, "createdAt" | "reviewedAt"> & {
      createdAt: ReturnType<typeof serverTimestamp>;
      reviewedAt: null;
    } = {
      listingId: input.listingId,
      reporterUid,
      reasonCode: input.reasonCode,
      details: input.details?.trim() ?? "",
      status: "open",
      moderationAction: "none",
      moderationReason: null,
      reviewedByUid: null,
      createdAt: serverTimestamp(),
      reviewedAt: null,
    };

    await setDoc(reportRef, payload);
    const created = await getDoc(reportRef);
    if (!created.exists()) {
      throw new Error("Failed to load report after create.");
    }
    return mapReportFromFirestore(created.id, created.data());
  }

  async getOpenReports(): Promise<readonly Report[]> {
    const reportsQuery = query(
      this.collectionRef(),
      where("status", "in", ["open", "reviewing"]),
      orderBy("createdAt", "desc"),
    );
    const snapshot = await getDocs(reportsQuery);
    return snapshot.docs.map((document) =>
      mapReportFromFirestore(document.id, document.data()),
    );
  }

  async getById(reportId: string): Promise<Report | null> {
    const snapshot = await getDoc(doc(this.collectionRef(), reportId));
    if (!snapshot.exists()) {
      return null;
    }
    return mapReportFromFirestore(snapshot.id, snapshot.data());
  }

  async moderate(input: ModerateReportRepositoryInput): Promise<Report> {
    const reportRef = doc(this.collectionRef(), input.reportId);
    const existing = await getDoc(reportRef);
    if (!existing.exists()) {
      throw new Error("Report not found.");
    }

    await updateDoc(reportRef, {
      status: input.status,
      reviewedByUid: input.reviewedByUid,
      reviewedAt: serverTimestamp(),
      moderationAction: input.moderationAction,
      moderationReason: input.moderationReason,
    });

    const updated = await getDoc(reportRef);
    if (!updated.exists()) {
      throw new Error("Failed to load report after moderation.");
    }
    return mapReportFromFirestore(updated.id, updated.data());
  }
}

export const reportRepository = new ReportRepository();
