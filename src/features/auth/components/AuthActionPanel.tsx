import { Button, FieldError, Input, Label, TextField } from "@heroui/react";
import { useEffect, useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import type { ZodError } from "zod";
import { FormError } from "@/components/feedback/FormError";
import { ROUTES } from "@/constants/route.constants";
import { AuthActionStatusMark } from "@/features/auth/components/AuthActionStatusMark";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { confirmPasswordResetSchema } from "@/features/auth/schemas/authSchemas";
import { authActionService } from "@/features/auth/services/authActionService";
import type { AuthActionMode, AuthActionStatus } from "@/features/auth/types/authAction.types";
import { getErrorMessage } from "@/utils/error.utils";

type FieldErrors = {
  password?: string;
  confirmPassword?: string;
};

function mapZodErrors(error: ZodError): FieldErrors {
  const errors: FieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if ((key === "password" || key === "confirmPassword") && !errors[key]) {
      errors[key] = issue.message;
    }
  }
  return errors;
}

function assertNever(value: never): never {
  throw new Error(`Unhandled auth action mode: ${String(value)}`);
}

function successCopy(mode: AuthActionMode, email: string | null): {
  title: string;
  body: string;
} {
  switch (mode) {
    case "verifyEmail":
    case "verifyAndChangeEmail":
      return {
        title: "Email confirmed",
        body: email
          ? `${email} is verified. You can post listings and manage your campus account.`
          : "Your email is verified. You can post listings and manage your campus account.",
      };
    case "resetPassword":
      return {
        title: "Password updated",
        body: "Your new password is ready. Sign in to get back to the marketplace.",
      };
    case "recoverEmail":
      return {
        title: "Email restored",
        body: email
          ? `Your account email is back to ${email}.`
          : "Your previous email address has been restored.",
      };
    case "revertSecondFactorAddition":
      return {
        title: "Change reverted",
        body: "The recent security change on your account was cancelled.",
      };
    default:
      return assertNever(mode);
  }
}

export function AuthActionPanel() {
  const [searchParams] = useSearchParams();
  const { user, isLoading: isAuthLoading, refreshUser } = useAuth();
  const modeParam = searchParams.get("mode");
  const oobCode = searchParams.get("oobCode");

  const [status, setStatus] = useState<AuthActionStatus>("idle");
  const [mode, setMode] = useState<AuthActionMode | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [didCompleteCode, setDidCompleteCode] = useState(false);

  useEffect(() => {
    if (didCompleteCode) {
      return;
    }

    let cancelled = false;

    async function run(): Promise<void> {
      if (oobCode && authActionService.isAuthActionMode(modeParam)) {
        setMode(modeParam);
        setStatus("loading");
        setErrorMessage(null);

        try {
          const info = await authActionService.inspectAuthActionCode(oobCode, modeParam);
          if (cancelled) {
            return;
          }

          setEmail(info.email);

          if (modeParam === "resetPassword") {
            setStatus("ready");
            return;
          }

          if (modeParam === "verifyEmail" || modeParam === "verifyAndChangeEmail") {
            await authActionService.completeEmailVerification(oobCode);
            if (!cancelled) {
              await refreshUser();
            }
          } else if (modeParam === "recoverEmail") {
            await authActionService.completeEmailRecovery(oobCode);
            if (!cancelled) {
              await refreshUser();
            }
          } else if (modeParam === "revertSecondFactorAddition") {
            await authActionService.completeEmailRecovery(oobCode);
            if (!cancelled) {
              await refreshUser();
            }
          } else {
            assertNever(modeParam);
          }

          if (!cancelled) {
            setDidCompleteCode(true);
            setStatus("success");
          }
        } catch (cause) {
          if (!cancelled) {
            setStatus("error");
            setErrorMessage(
              getErrorMessage(cause, "Could not complete this email action."),
            );
          }
        }
        return;
      }

      if (isAuthLoading) {
        setStatus("loading");
        return;
      }

      const alreadyVerified = user?.emailVerified === true;
      const verifiedEmail = user?.email ?? null;

      if (!modeParam && !oobCode && alreadyVerified) {
        setMode("verifyEmail");
        setEmail(verifiedEmail);
        setStatus("success");
        return;
      }

      if (!authActionService.isAuthActionMode(modeParam)) {
        setStatus("unsupported");
        setErrorMessage("This email link is missing a valid action.");
        return;
      }

      if (
        (modeParam === "verifyEmail" || modeParam === "verifyAndChangeEmail") &&
        alreadyVerified
      ) {
        setMode(modeParam);
        setEmail(verifiedEmail);
        setStatus("success");
        return;
      }

      setStatus("error");
      setErrorMessage("This email link is incomplete. Open the latest message and try again.");
      setMode(modeParam);
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, [
    didCompleteCode,
    isAuthLoading,
    modeParam,
    oobCode,
    refreshUser,
    user?.email,
    user?.emailVerified,
  ]);

  const handlePasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!oobCode) {
      return;
    }

    setFieldErrors({});
    setErrorMessage(null);

    const parsed = confirmPasswordResetSchema.safeParse({ password, confirmPassword });
    if (!parsed.success) {
      setFieldErrors(mapZodErrors(parsed.error));
      return;
    }

    setIsSubmitting(true);
    try {
      await authActionService.completePasswordReset(oobCode, parsed.data.password);
      setDidCompleteCode(true);
      setStatus("success");
    } catch (cause) {
      setErrorMessage(getErrorMessage(cause, "Could not update your password."));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "idle" || status === "loading") {
    return (
      <div className="space-y-3" aria-busy="true" aria-live="polite">
        <AuthActionStatusMark variant="loading" />
        <h1 className="font-display text-4xl tracking-tight text-campus-ink">
          Opening your link
        </h1>
        <p className="text-sm leading-relaxed text-campus-ink/70">
          One moment while we finish the request from your inbox.
        </p>
      </div>
    );
  }

  if (status === "unsupported" || (status === "error" && mode === null)) {
    return (
      <div className="space-y-5">
        <AuthActionStatusMark variant="error" />
        <div className="space-y-2">
          <h1 className="font-display text-4xl tracking-tight text-campus-ink">
            Link not recognized
          </h1>
          <p className="text-sm leading-relaxed text-campus-ink/70">
            {errorMessage ?? "Open the latest email from Student Market Forum and use that link."}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link className="w-full sm:w-auto" to={ROUTES.signIn}>
            <Button className="w-full" variant="primary">
              Back to sign in
            </Button>
          </Link>
          <Link className="w-full sm:w-auto" to={ROUTES.passwordReset}>
            <Button className="w-full" variant="secondary">
              Request a new link
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="space-y-5">
        <AuthActionStatusMark variant="error" />
        <div className="space-y-2">
          <h1 className="font-display text-4xl tracking-tight text-campus-ink">
            Could not finish
          </h1>
          <p className="text-sm leading-relaxed text-campus-ink/70">
            {errorMessage ?? "This link may have expired or already been used."}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link className="w-full sm:w-auto" to={ROUTES.signIn}>
            <Button className="w-full" variant="primary">
              Sign in
            </Button>
          </Link>
          <Link
            className="w-full sm:w-auto"
            to={mode === "resetPassword" ? ROUTES.passwordReset : ROUTES.signUp}
          >
            <Button className="w-full" variant="secondary">
              {mode === "resetPassword" ? "Request a new reset" : "Create account"}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (status === "ready" && mode === "resetPassword") {
    return (
      <form className="space-y-5" onSubmit={handlePasswordSubmit} noValidate>
        <div className="space-y-2">
          <h1 className="font-display text-4xl tracking-tight text-campus-ink">
            Choose a new password
          </h1>
          <p className="text-sm leading-relaxed text-campus-ink/70">
            {email
              ? `Set a new password for ${email}.`
              : "Set a new password for your campus account."}
          </p>
        </div>

        {errorMessage ? (
          <FormError message={errorMessage} title="Reset failed" />
        ) : null}

        <TextField isInvalid={Boolean(fieldErrors.password)} fullWidth>
          <Label>New password</Label>
          <Input
            autoComplete="new-password"
            name="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          {fieldErrors.password ? <FieldError>{fieldErrors.password}</FieldError> : null}
        </TextField>

        <TextField isInvalid={Boolean(fieldErrors.confirmPassword)} fullWidth>
          <Label>Confirm password</Label>
          <Input
            autoComplete="new-password"
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
          {fieldErrors.confirmPassword ? (
            <FieldError>{fieldErrors.confirmPassword}</FieldError>
          ) : null}
        </TextField>

        <Button className="w-full" type="submit" isDisabled={isSubmitting}>
          {isSubmitting ? "Saving…" : "Save new password"}
        </Button>
      </form>
    );
  }

  if (status === "success" && mode) {
    const copy = successCopy(mode, email);
    return (
      <div className="space-y-5 auth-action-success">
        <AuthActionStatusMark variant="success" />
        <div className="space-y-2">
          <h1 className="font-display text-4xl tracking-tight text-campus-ink">{copy.title}</h1>
          <p className="text-sm leading-relaxed text-campus-ink/70">{copy.body}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            className="w-full sm:w-auto"
            to={mode === "resetPassword" ? ROUTES.signIn : ROUTES.browse}
          >
            <Button className="w-full" variant="primary">
              {mode === "resetPassword" ? "Sign in" : "Browse listings"}
            </Button>
          </Link>
          {mode !== "resetPassword" ? (
            <Link className="w-full sm:w-auto" to={ROUTES.signIn}>
              <Button className="w-full" variant="secondary">
                Sign in
              </Button>
            </Link>
          ) : null}
        </div>
      </div>
    );
  }

  return null;
}
