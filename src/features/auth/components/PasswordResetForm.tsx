import { Button, FieldError, Input, Label, TextField } from "@heroui/react";
import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import type { ZodError } from "zod";
import { FormError } from "@/components/feedback/FormError";
import { SuccessMessage } from "@/components/feedback/SuccessMessage";
import { ROUTES } from "@/constants/route.constants";
import { passwordResetSchema } from "@/features/auth/schemas/authSchemas";
import { authService } from "@/features/auth/services/authService";
import type { AuthFieldErrors } from "@/features/auth/types/auth.interfaces";
import { getErrorMessage } from "@/utils/error.utils";

function mapZodErrors(error: ZodError): AuthFieldErrors {
  const errors: AuthFieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !errors[key]) {
      errors[key] = issue.message;
    }
  }
  return errors;
}

export function PasswordResetForm() {
  const [email, setEmail] = useState("");
  const [fieldErrors, setFieldErrors] = useState<AuthFieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    setFieldErrors({});
    setIsSuccess(false);

    const parsed = passwordResetSchema.safeParse({ email });
    if (!parsed.success) {
      setFieldErrors(mapZodErrors(parsed.error));
      return;
    }

    setIsSubmitting(true);
    try {
      await authService.resetPassword(parsed.data);
      setIsSuccess(true);
    } catch (error) {
      setFormError(getErrorMessage(error, "Could not send reset email."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit} noValidate>
      <div className="space-y-2">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-campus-leaf">
          Account recovery
        </p>
        <h1 className="font-display text-4xl tracking-tight text-campus-ink">
          Reset password
        </h1>
        <p className="text-sm leading-relaxed text-campus-ink/70">
          We will email you a link to choose a new password.
        </p>
      </div>

      {isSuccess ? (
        <SuccessMessage
          title="Email sent"
          message="If an account exists for that address, you will receive reset instructions shortly."
        />
      ) : null}

      {formError ? (
        <FormError message={formError} title="Reset failed" />
      ) : null}

      <TextField isInvalid={Boolean(fieldErrors.email)} fullWidth>
        <Label>Email</Label>
        <Input
          autoComplete="email"
          inputMode="email"
          name="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        {fieldErrors.email ? (
          <FieldError>{fieldErrors.email}</FieldError>
        ) : null}
      </TextField>

      <Button className="w-full" type="submit" isDisabled={isSubmitting}>
        {isSubmitting ? "Sending…" : "Send reset link"}
      </Button>

      <p className="text-center text-sm text-campus-ink/70">
        <Link
          className=" font-medium text-campus-leaf hover:underline"
          to={ROUTES.signIn}
        >
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
