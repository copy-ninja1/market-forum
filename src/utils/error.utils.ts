import type { AppError, AppErrorCode } from "@/types/api.types";

const FIREBASE_CODE_MAP: Record<string, AppErrorCode> = {
  "auth/invalid-email": "validation",
  "auth/user-disabled": "forbidden",
  "auth/user-not-found": "not-found",
  "auth/wrong-password": "validation",
  "auth/invalid-credential": "validation",
  "auth/email-already-in-use": "conflict",
  "auth/weak-password": "validation",
  "auth/expired-action-code": "validation",
  "auth/invalid-action-code": "validation",
  "auth/user-disabled": "forbidden",
  "auth/too-many-requests": "network",
  "auth/network-request-failed": "network",
  "permission-denied": "forbidden",
  "not-found": "not-found",
  unauthenticated: "unauthenticated",
};

const FIREBASE_MESSAGE_MAP: Record<string, string> = {
  "auth/invalid-email": "Enter a valid email address.",
  "auth/user-disabled": "This account has been disabled.",
  "auth/user-not-found": "No account was found with those credentials.",
  "auth/wrong-password": "Incorrect email or password.",
  "auth/invalid-credential": "Incorrect email or password.",
  "auth/email-already-in-use": "An account with this email already exists.",
  "auth/weak-password": "Choose a stronger password (at least 6 characters).",
  "auth/too-many-requests": "Too many attempts. Please try again later.",
  "auth/network-request-failed": "Network error. Check your connection and retry.",
  "permission-denied": "You do not have permission to perform this action.",
  "not-found": "The requested resource was not found.",
  unauthenticated: "Please sign in to continue.",
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function toAppError(error: unknown, fallbackMessage = "Something went wrong."): AppError {
  if (isRecord(error) && typeof error.code === "string" && typeof error.message === "string") {
    const code = FIREBASE_CODE_MAP[error.code] ?? "unknown";
    const message = FIREBASE_MESSAGE_MAP[error.code] ?? fallbackMessage;
    return { code, message, cause: error };
  }

  if (error instanceof Error) {
    return { code: "unknown", message: error.message || fallbackMessage, cause: error };
  }

  return { code: "unknown", message: fallbackMessage, cause: error };
}

export function getErrorMessage(error: unknown, fallbackMessage = "Something went wrong."): string {
  return toAppError(error, fallbackMessage).message;
}
