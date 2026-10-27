import {
  applyActionCode,
  checkActionCode,
  confirmPasswordReset,
  type ActionCodeSettings,
} from "firebase/auth";
import type {
  AuthActionInfo,
  AuthActionMode,
} from "@/features/auth/types/authAction.types";
import { getFirebaseAuth } from "@/lib/firebase/firebaseAuth";
import { getPublicSiteUrl } from "@/seo/siteUrl";

const AUTH_ACTION_MODES = new Set<AuthActionMode>([
  "verifyEmail",
  "resetPassword",
  "recoverEmail",
  "verifyAndChangeEmail",
  "revertSecondFactorAddition",
]);

export function isAuthActionMode(value: string | null): value is AuthActionMode {
  return value !== null && AUTH_ACTION_MODES.has(value as AuthActionMode);
}

export function getEmailActionCodeSettings(): ActionCodeSettings {
  return {
    url: `${getPublicSiteUrl()}/auth/action`,
    handleCodeInApp: false,
  };
}

/**
 * Validates an out-of-band code. The URL `mode` param is the source of truth for
 * which handler to run; Firebase's `operation` enum uses a different naming scheme.
 */
export async function inspectAuthActionCode(
  oobCode: string,
  mode: AuthActionMode,
): Promise<AuthActionInfo> {
  const result = await checkActionCode(getFirebaseAuth(), oobCode);
  return {
    mode,
    email: result.data.email ?? result.data.previousEmail ?? null,
  };
}

export async function completeEmailVerification(oobCode: string): Promise<void> {
  const auth = getFirebaseAuth();
  await applyActionCode(auth, oobCode);
  if (auth.currentUser) {
    await auth.currentUser.reload();
  }
}

export async function completeEmailRecovery(oobCode: string): Promise<void> {
  const auth = getFirebaseAuth();
  await applyActionCode(auth, oobCode);
  if (auth.currentUser) {
    await auth.currentUser.reload();
  }
}

export async function completePasswordReset(
  oobCode: string,
  newPassword: string,
): Promise<void> {
  await confirmPasswordReset(getFirebaseAuth(), oobCode, newPassword);
}

export const authActionService = {
  getEmailActionCodeSettings,
  inspectAuthActionCode,
  completeEmailVerification,
  completeEmailRecovery,
  completePasswordReset,
  isAuthActionMode,
};
