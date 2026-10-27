import { Button, FieldError, Input, Label, TextField } from "@heroui/react";
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { ZodError } from "zod";
import { FormError } from "@/components/feedback/FormError";
import { ROUTES } from "@/constants/route.constants";
import { signUpSchema } from "@/features/auth/schemas/authSchemas";
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

export function SignUpForm() {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [institution, setInstitution] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<AuthFieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    setFieldErrors({});

    const parsed = signUpSchema.safeParse({ email, password, displayName, institution });
    if (!parsed.success) {
      setFieldErrors(mapZodErrors(parsed.error));
      return;
    }

    setIsSubmitting(true);
    try {
      await authService.signUp(parsed.data);
      navigate(ROUTES.browse, { replace: true });
    } catch (error) {
      setFormError(getErrorMessage(error, "Could not create your account."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit} noValidate>
      <div className="space-y-1 text-center">
        <h1 className="font-display text-2xl text-campus-ink">Join the marketplace</h1>
        <p className="text-sm text-campus-ink/70">Create a student account to buy and sell on campus.</p>
      </div>

      {formError ? <FormError message={formError} title="Sign up failed" /> : null}

      <TextField isInvalid={Boolean(fieldErrors.displayName)} fullWidth>
        <Label>Display name</Label>
        <Input
          autoComplete="name"
          name="displayName"
          value={displayName}
          onChange={(event) => setDisplayName(event.target.value)}
        />
        {fieldErrors.displayName ? <FieldError>{fieldErrors.displayName}</FieldError> : null}
      </TextField>

      <TextField isInvalid={Boolean(fieldErrors.institution)} fullWidth>
        <Label>Institution</Label>
        <Input
          autoComplete="organization"
          name="institution"
          value={institution}
          onChange={(event) => setInstitution(event.target.value)}
        />
        {fieldErrors.institution ? <FieldError>{fieldErrors.institution}</FieldError> : null}
      </TextField>

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
          autoComplete="new-password"
          name="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        {fieldErrors.password ? <FieldError>{fieldErrors.password}</FieldError> : null}
      </TextField>

      <Button className="w-full" type="submit" isDisabled={isSubmitting}>
        {isSubmitting ? "Creating account…" : "Create account"}
      </Button>

      <p className="text-center text-sm text-campus-ink/70">
        Already have an account?{" "}
        <Link className="focus-ring font-medium text-campus-leaf hover:underline" to={ROUTES.signIn}>
          Sign in
        </Link>
      </p>
    </form>
  );
}
