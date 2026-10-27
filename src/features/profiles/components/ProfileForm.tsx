import { Button, FieldError, Input, Label, ListBox, Select, TextField } from "@heroui/react";
import { useState, type FormEvent } from "react";
import type { ZodError } from "zod";
import { FormError } from "@/components/feedback/FormError";
import { SuccessMessage } from "@/components/feedback/SuccessMessage";
import { updateProfileSchema } from "@/features/profiles/schemas/profileSchemas";
import type { ProfileFormProps } from "@/features/profiles/types/profile.interfaces";
import type { ContactType } from "@/features/listings/types/listing.types";
import { getErrorMessage } from "@/utils/error.utils";

type FieldErrors = Record<string, string>;

function mapZodErrors(error: ZodError): FieldErrors {
  const errors: FieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !errors[key]) {
      errors[key] = issue.message;
    }
  }
  return errors;
}

export function ProfileForm({ profile, isSubmitting = false, onSubmit }: ProfileFormProps) {
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [institution, setInstitution] = useState(profile.institution);
  const [preferredContactType, setPreferredContactType] = useState<ContactType>(
    profile.preferredContactType,
  );
  const [preferredContactValue, setPreferredContactValue] = useState(profile.preferredContactValue);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    setSuccessMessage(null);
    setFieldErrors({});

    const parsed = updateProfileSchema.safeParse({
      displayName,
      institution,
      preferredContactType,
      preferredContactValue,
    });

    if (!parsed.success) {
      setFieldErrors(mapZodErrors(parsed.error));
      return;
    }

    setIsSaving(true);
    try {
      await onSubmit(parsed.data);
      setSuccessMessage("Profile updated successfully.");
    } catch (error) {
      setFormError(getErrorMessage(error, "Could not update profile."));
    } finally {
      setIsSaving(false);
    }
  };

  const disabled = isSubmitting || isSaving;

  return (
    <form className="mx-auto max-w-xl space-y-5" onSubmit={handleSubmit} noValidate>
      {successMessage ? <SuccessMessage message={successMessage} title="Saved" /> : null}
      {formError ? <FormError message={formError} /> : null}

      <TextField fullWidth isInvalid={Boolean(fieldErrors.displayName)}>
        <Label>Display name</Label>
        <Input value={displayName} onChange={(event) => setDisplayName(event.target.value)} />
        {fieldErrors.displayName ? <FieldError>{fieldErrors.displayName}</FieldError> : null}
      </TextField>

      <TextField fullWidth isInvalid={Boolean(fieldErrors.institution)}>
        <Label>Institution</Label>
        <Input value={institution} onChange={(event) => setInstitution(event.target.value)} />
        {fieldErrors.institution ? <FieldError>{fieldErrors.institution}</FieldError> : null}
      </TextField>

      <Select
        fullWidth
        selectedKey={preferredContactType}
        onSelectionChange={(key) => setPreferredContactType(String(key) as ContactType)}
      >
        <Label>Preferred contact type</Label>
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            <ListBox.Item id="email" textValue="Email">
              Email
            </ListBox.Item>
            <ListBox.Item id="phone" textValue="Phone">
              Phone
            </ListBox.Item>
            <ListBox.Item id="other" textValue="Other">
              Other
            </ListBox.Item>
          </ListBox>
        </Select.Popover>
      </Select>

      <TextField fullWidth isInvalid={Boolean(fieldErrors.preferredContactValue)}>
        <Label>Preferred contact value</Label>
        <Input
          value={preferredContactValue}
          onChange={(event) => setPreferredContactValue(event.target.value)}
        />
        {fieldErrors.preferredContactValue ? (
          <FieldError>{fieldErrors.preferredContactValue}</FieldError>
        ) : null}
      </TextField>

      <Button isDisabled={disabled} type="submit">
        {disabled ? "Saving…" : "Save profile"}
      </Button>
    </form>
  );
}
