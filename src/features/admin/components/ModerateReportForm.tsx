import { Button, FieldError, Label, ListBox, Select, TextArea, TextField } from "@heroui/react";
import { useState, type FormEvent } from "react";
import type { ZodError } from "zod";
import { FormError } from "@/components/feedback/FormError";
import type { ModerateReportFormProps } from "@/features/admin/types/admin.interfaces";
import { moderateReportSchema } from "@/features/reports/schemas/reportSchemas";
import type { ModerationAction } from "@/features/reports/types/report.types";
import { getErrorMessage } from "@/utils/error.utils";

type ModerationActionChoice = Exclude<ModerationAction, "none">;

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

export function ModerateReportForm({
  reportId,
  isSubmitting,
  onSubmit,
  onCancel,
}: ModerateReportFormProps) {
  const [action, setAction] = useState<ModerationActionChoice>("dismiss");
  const [reason, setReason] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    setFieldErrors({});

    const parsed = moderateReportSchema.safeParse({ reportId, action, reason });
    if (!parsed.success) {
      setFieldErrors(mapZodErrors(parsed.error));
      return;
    }

    try {
      await onSubmit({ action: parsed.data.action, reason: parsed.data.reason });
      setReason("");
    } catch (cause) {
      setFormError(getErrorMessage(cause, "Could not apply moderation action."));
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit} noValidate>
      {formError ? <FormError message={formError} /> : null}

      <Select
        fullWidth
        selectedKey={action}
        onSelectionChange={(key) => setAction(String(key) as ModerationActionChoice)}
      >
        <Label>Action</Label>
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            <ListBox.Item id="dismiss" textValue="Dismiss report">
              Dismiss report
            </ListBox.Item>
            <ListBox.Item id="hide" textValue="Hide listing">
              Hide listing
            </ListBox.Item>
            <ListBox.Item id="remove" textValue="Remove listing">
              Remove listing
            </ListBox.Item>
          </ListBox>
        </Select.Popover>
      </Select>

      <TextField fullWidth isInvalid={Boolean(fieldErrors.reason)}>
        <Label>Moderation reason</Label>
        <TextArea
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          placeholder="Brief note for the audit trail"
        />
        {fieldErrors.reason ? <FieldError>{fieldErrors.reason}</FieldError> : null}
      </TextField>

      <div className="flex flex-wrap gap-2">
        <Button isDisabled={isSubmitting} type="submit" variant="primary">
          {isSubmitting ? "Applying…" : "Apply action"}
        </Button>
        {onCancel ? (
          <Button isDisabled={isSubmitting} type="button" variant="secondary" onPress={onCancel}>
            Cancel
          </Button>
        ) : null}
      </div>
    </form>
  );
}
