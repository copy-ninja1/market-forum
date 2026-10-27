export type AuthActionMode =
  | "verifyEmail"
  | "resetPassword"
  | "recoverEmail"
  | "verifyAndChangeEmail"
  | "revertSecondFactorAddition";

export type AuthActionStatus =
  | "idle"
  | "loading"
  | "ready"
  | "success"
  | "error"
  | "unsupported";

export type AuthActionInfo = {
  readonly mode: AuthActionMode;
  readonly email: string | null;
};
