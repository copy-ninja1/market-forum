import { Button, FieldError, Label, ListBox, Select, TextArea, TextField } from "@heroui/react";
import { useState, type FormEvent } from "react";
import type { ZodError } from "zod";
import { FormError } from "@/components/feedback/FormError";
import { SuccessMessage } from "@/components/feedback/SuccessMessage";
import { REPORT_REASON_LABELS } from "@/features/reports/constants/report.constants";
import { createReportSchema } from "@/features/reports/schemas/reportSchemas";
import { reportService } from "@/features/reports/services/reportService";
import type { ReportReasonCode } from "@/features/reports/types/report.types";
import { getErrorMessage } from "@/utils/error.utils";

type ReportListingFormProps = {
  readonly listingId: string;
  readonly reporterUid: string;
  readonly onRequireSignIn?: () => void;
};

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

const REASON_CODES = Object.keys(REPORT_REASON_LABELS) as ReportReasonCode[];

export function ReportListingForm({ listingId, reporterUid, onRequireSignIn }: ReportListingFormProps) {
  const [reasonCode, setReasonCode] = useState<ReportReasonCode>("misleading");
  const [details, setDetails] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!reporterUid) {
      onRequireSignIn?.();
      return;
    }

    setFormError(null);
    setFieldErrors({});
    setSuccess(false);

    const parsed = createReportSchema.safeParse({ listingId, reasonCode, details });
    if (!parsed.success) {
      setFieldErrors(mapZodErrors(parsed.error));
      return;
    }

    setIsSubmitting(true);
    try {
      await reportService.createReport(reporterUid, parsed.data);
      setSuccess(true);
      setDetails("");
    } catch (cause) {
      setFormError(getErrorMessage(cause, "Could not submit report."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="mt-4 space-y-4" onSubmit={handleSubmit} noValidate>
      {success ? (
        <SuccessMessage message="Thanks — moderators will review your report." title="Report submitted" />
      ) : null}
      {formError ? <FormError message={formError} /> : null}

      <Select
        fullWidth
        selectedKey={reasonCode}
        onSelectionChange={(key) => setReasonCode(String(key) as ReportReasonCode)}
      >
        <Label>Reason</Label>
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            {REASON_CODES.map((code) => (
              <ListBox.Item key={code} id={code} textValue={REPORT_REASON_LABELS[code]}>
                {REPORT_REASON_LABELS[code]}
              </ListBox.Item>
            ))}
          </ListBox>
        </Select.Popover>
      </Select>

      <TextField fullWidth isInvalid={Boolean(fieldErrors.details)}>
        <Label>Details (optional)</Label>
        <TextArea value={details} onChange={(event) => setDetails(event.target.value)} />
        {fieldErrors.details ? <FieldError>{fieldErrors.details}</FieldError> : null}
      </TextField>

      <Button isDisabled={isSubmitting} type="submit" variant="secondary">
        {isSubmitting ? "Submitting…" : "Submit report"}
      </Button>
    </form>
  );
}
