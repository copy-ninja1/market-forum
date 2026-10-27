import { Button, FieldError, Input, Label, TextField } from "@heroui/react";
import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FormError } from "@/components/feedback/FormError";
import { signInSchema } from "@/features/auth/schemas/authSchemas";
import { authService } from "@/features/auth/services/authService";
import type { AuthFieldErrors } from "@/features/auth/types/auth.interfaces";
import { ROUTES } from "@/constants/route.constants";
import { getErrorMessage } from "@/utils/error.utils";
import type { ZodError } from "zod";

type SignInLocationState = {
  from?: string;
};

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

export function SignInForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<AuthFieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    setFieldErrors({});

    const parsed = signInSchema.safeParse({ email, password });
    if (!parsed.success) {
      setFieldErrors(mapZodErrors(parsed.error));
      return;
    }

    setIsSubmitting(true);
    try {
      await authService.signIn(parsed.data);
      const state = location.state as SignInLocationState | null;
      const redirectTo = state?.from && state.from !== ROUTES.signIn ? state.from : ROUTES.browse;
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setFormError(getErrorMessage(error, "Could not sign in."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit} noValidate>
      <div className="space-y-2">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-campus-leaf">
          Sign in
        </p>
        <h1 className="font-display text-4xl tracking-tight text-campus-ink">Welcome back</h1>
        <p className="text-sm leading-relaxed text-campus-ink/70">
          Sign in to manage listings and contact sellers.
        </p>
      </div>

      {formError ? <FormError message={formError} title="Sign in failed" /> : null}

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
        {fieldErrors.email ? <FieldError>{fieldErrors.email}</FieldError> : null}
      </TextField>

      <TextField isInvalid={Boolean(fieldErrors.password)} fullWidth>
        <Label>Password</Label>
        <Input
          autoComplete="current-password"
          name="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        {fieldErrors.password ? <FieldError>{fieldErrors.password}</FieldError> : null}
      </TextField>

      <div className="flex justify-end">
        <Link className="focus-ring text-sm text-campus-leaf hover:underline" to={ROUTES.passwordReset}>
          Forgot password?
        </Link>
      </div>

      <Button className="w-full" type="submit" isDisabled={isSubmitting}>
        {isSubmitting ? "Signing in…" : "Sign in"}
      </Button>

      <p className="text-center text-sm text-campus-ink/70">
        New here?{" "}
        <Link className="focus-ring font-medium text-campus-leaf hover:underline" to={ROUTES.signUp}>
          Create an account
        </Link>
      </p>
    </form>
  );
}
