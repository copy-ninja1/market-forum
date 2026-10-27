import {
  Button,
  FieldError,
  Input,
  Label,
  ListBox,
  Select,
  TextArea,
  TextField,
} from "@heroui/react";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import type { ZodError } from "zod";
import { FormError } from "@/components/feedback/FormError";
import { DEFAULT_CURRENCY_CODE, MAX_LISTING_IMAGES } from "@/constants/app.constants";
import {
  CONDITION_LABELS,
  LISTING_CONDITIONS,
  OWNER_EDITABLE_STATUSES,
  STATUS_LABELS,
} from "@/constants/listing.constants";
import { listingFormSchema, type ListingFormSchema } from "@/features/listings/schemas/listingSchemas";
import type { ListingFormProps } from "@/features/listings/types/listing.interfaces";
import type { ContactType, ListingCondition } from "@/features/listings/types/listing.types";
import { createObjectUrl, revokeObjectUrl, validateImageFile } from "@/utils/file.utils";

type FieldErrors = Record<string, string>;

type ImagePreview = {
  readonly id: string;
  readonly file: File;
  readonly url: string;
};

function mapZodErrors(error: ZodError): FieldErrors {
  const errors: FieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path.map(String).join(".");
    if (!errors[key]) {
      errors[key] = issue.message;
    }
  }
  return errors;
}

function defaultValues(initialValues: ListingFormProps["initialValues"]): ListingFormSchema {
  return {
    title: initialValues?.title ?? "",
    description: initialValues?.description ?? "",
    categoryId: initialValues?.categoryId ?? "",
    price: initialValues?.price ?? 0,
    currencyCode: initialValues?.currencyCode ?? DEFAULT_CURRENCY_CODE,
    condition: initialValues?.condition ?? "good",
    locationLabel: initialValues?.locationLabel ?? "",
    contactType: initialValues?.contactType ?? "email",
    contactValue: initialValues?.contactValue ?? "",
    status:
      initialValues?.status === "sold" || initialValues?.status === "unavailable"
        ? initialValues.status
        : "active",
  };
}

export function ListingForm({
  mode,
  categories,
  isCategoriesLoading = false,
  initialValues,
  existingImages = [],
  isSubmitting,
  submitLabel,
  onSubmit,
}: ListingFormProps) {
  const [values, setValues] = useState<ListingFormSchema>(() => defaultValues(initialValues));
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [newPreviews, setNewPreviews] = useState<readonly ImagePreview[]>([]);
  const [isInternalSubmitting, setIsInternalSubmitting] = useState(false);

  useEffect(() => {
    setValues(defaultValues(initialValues));
  }, [initialValues]);

  useEffect(() => {
    return () => {
      for (const preview of newPreviews) {
        revokeObjectUrl(preview.url);
      }
    };
  }, [newPreviews]);

  const totalImages = existingImages.length + newPreviews.length;
  const submitDisabled = isSubmitting || isInternalSubmitting;

  const updateField = <K extends keyof ListingFormSchema>(key: K, next: ListingFormSchema[K]) => {
    setValues((current) => ({ ...current, [key]: next }));
  };

  const handleFilesChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormError(null);
    const fileList = event.target.files;
    if (!fileList) {
      return;
    }

    const incoming = Array.from(fileList);
    event.target.value = "";

    const remainingSlots = MAX_LISTING_IMAGES - totalImages;
    if (remainingSlots <= 0) {
      setFormError(`You can upload up to ${MAX_LISTING_IMAGES} images per listing.`);
      return;
    }

    const accepted = incoming.slice(0, remainingSlots);
    const nextPreviews: ImagePreview[] = [];

    for (const file of accepted) {
      const validation = validateImageFile(file);
      if (!validation.ok) {
        setFormError(validation.message);
        continue;
      }
      nextPreviews.push({
        id: `${file.name}-${file.lastModified}`,
        file,
        url: createObjectUrl(file),
      });
    }

    if (nextPreviews.length > 0) {
      setNewPreviews((current) => [...current, ...nextPreviews]);
    }
  };

  const removePreview = (id: string) => {
    setNewPreviews((current) => {
      const target = current.find((preview) => preview.id === id);
      if (target) {
        revokeObjectUrl(target.url);
      }
      return current.filter((preview) => preview.id !== id);
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    setFieldErrors({});

    const parsed = listingFormSchema.safeParse({
      ...values,
      price: values.price,
      currencyCode: values.currencyCode.toUpperCase(),
    });

    if (!parsed.success) {
      setFieldErrors(mapZodErrors(parsed.error));
      return;
    }

    setIsInternalSubmitting(true);
    try {
      await onSubmit(parsed.data, newPreviews.map((preview) => preview.file));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not save listing.";
      setFormError(message);
    } finally {
      setIsInternalSubmitting(false);
    }
  };

  const resolvedSubmitLabel =
    submitLabel ?? (mode === "create" ? "Publish listing" : "Save changes");

  return (
    <form className="space-y-6" onSubmit={handleSubmit} noValidate>
      {formError ? <FormError message={formError} /> : null}

      <TextField fullWidth isInvalid={Boolean(fieldErrors.title)}>
        <Label>Title</Label>
        <Input value={values.title} onChange={(event) => updateField("title", event.target.value)} />
        {fieldErrors.title ? <FieldError>{fieldErrors.title}</FieldError> : null}
      </TextField>

      <TextField fullWidth isInvalid={Boolean(fieldErrors.description)}>
        <Label>Description</Label>
        <TextArea
          className="min-h-32"
          value={values.description}
          onChange={(event) => updateField("description", event.target.value)}
        />
        {fieldErrors.description ? <FieldError>{fieldErrors.description}</FieldError> : null}
      </TextField>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <Select
            fullWidth
            isDisabled={isCategoriesLoading || categories.length === 0}
            placeholder="Select category"
            selectedKey={values.categoryId || undefined}
            onSelectionChange={(key) => updateField("categoryId", String(key))}
          >
            <Label>Category</Label>
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                {categories.map((category) => (
                  <ListBox.Item id={category.id} key={category.id} textValue={category.name}>
                    {category.name}
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
          {fieldErrors.categoryId ? <FieldError>{fieldErrors.categoryId}</FieldError> : null}
        </div>

        <TextField fullWidth isInvalid={Boolean(fieldErrors.locationLabel)}>
          <Label>Location</Label>
          <Input
            value={values.locationLabel}
            onChange={(event) => updateField("locationLabel", event.target.value)}
          />
          {fieldErrors.locationLabel ? <FieldError>{fieldErrors.locationLabel}</FieldError> : null}
        </TextField>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <TextField fullWidth isInvalid={Boolean(fieldErrors.price)}>
          <Label>Price</Label>
          <Input
            inputMode="decimal"
            type="number"
            value={String(values.price)}
            onChange={(event) => updateField("price", Number(event.target.value))}
          />
          {fieldErrors.price ? <FieldError>{fieldErrors.price}</FieldError> : null}
        </TextField>

        <TextField fullWidth isInvalid={Boolean(fieldErrors.currencyCode)}>
          <Label>Currency</Label>
          <Input
            maxLength={3}
            value={values.currencyCode}
            onChange={(event) => updateField("currencyCode", event.target.value.toUpperCase())}
          />
          {fieldErrors.currencyCode ? <FieldError>{fieldErrors.currencyCode}</FieldError> : null}
        </TextField>

        <Select
          fullWidth
          selectedKey={values.condition}
          onSelectionChange={(key) => updateField("condition", String(key) as ListingCondition)}
        >
          <Label>Condition</Label>
          <Select.Trigger>
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              {LISTING_CONDITIONS.map((condition) => (
                <ListBox.Item id={condition} key={condition} textValue={CONDITION_LABELS[condition]}>
                  {CONDITION_LABELS[condition]}
                </ListBox.Item>
              ))}
            </ListBox>
          </Select.Popover>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Select
          fullWidth
          selectedKey={values.contactType}
          onSelectionChange={(key) => updateField("contactType", String(key) as ContactType)}
        >
          <Label>Contact type</Label>
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

        <TextField fullWidth isInvalid={Boolean(fieldErrors.contactValue)}>
          <Label>Contact value</Label>
          <Input
            value={values.contactValue}
            onChange={(event) => updateField("contactValue", event.target.value)}
          />
          {fieldErrors.contactValue ? <FieldError>{fieldErrors.contactValue}</FieldError> : null}
        </TextField>
      </div>

      {mode === "edit" ? (
        <Select
          fullWidth
          selectedKey={values.status ?? "active"}
          onSelectionChange={(key) => {
            const next = String(key);
            if (next === "active" || next === "sold" || next === "unavailable") {
              updateField("status", next);
            }
          }}
        >
          <Label>Status</Label>
          <Select.Trigger>
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              {OWNER_EDITABLE_STATUSES.map((status) => (
                <ListBox.Item id={status} key={status} textValue={STATUS_LABELS[status]}>
                  {STATUS_LABELS[status]}
                </ListBox.Item>
              ))}
            </ListBox>
          </Select.Popover>
        </Select>
      ) : null}

      <div className="space-y-3">
        <Label>Photos ({totalImages}/{MAX_LISTING_IMAGES})</Label>
        <input
          accept="image/jpeg,image/png,image/webp"
          className="block w-full text-sm text-campus-ink/80 file:mr-3 file:rounded-md file:border-0 file:bg-campus-leaf/15 file:px-3 file:py-2 file:text-campus-ink"
          multiple
          type="file"
          onChange={handleFilesChange}
        />
        <div className="flex flex-wrap gap-3">
          {existingImages.map((image) => (
            <img
              key={image.storagePath}
              alt={image.altText}
              className="size-20 rounded-lg border border-campus-mist object-cover"
              height={80}
              src={image.url}
              width={80}
            />
          ))}
          {newPreviews.map((preview) => (
            <div key={preview.id} className="relative">
              <img
                alt=""
                className="size-20 rounded-lg border border-campus-mist object-cover"
                height={80}
                src={preview.url}
                width={80}
              />
              <Button
                className="absolute -right-2 -top-2 min-w-0 px-2 py-1 text-xs"
                size="sm"
                type="button"
                variant="secondary"
                onPress={() => removePreview(preview.id)}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      </div>

      <Button className="w-full md:w-auto" isDisabled={submitDisabled} type="submit">
        {submitDisabled ? "Saving…" : resolvedSubmitLabel}
      </Button>
    </form>
  );
}
