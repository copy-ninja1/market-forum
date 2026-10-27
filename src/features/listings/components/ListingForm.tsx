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
import { useEffect, useRef, useState, type FormEvent } from "react";
import type { ZodError } from "zod";
import { FormError } from "@/components/feedback/FormError";
import { LISTING_CURRENCY_CODE, MAX_LISTING_IMAGES } from "@/constants/app.constants";
import {
  CONDITION_LABELS,
  LISTING_CONDITIONS,
  OWNER_EDITABLE_STATUSES,
  STATUS_LABELS,
} from "@/constants/listing.constants";
import { ListingPhotoPicker, type ListingPhotoPreview } from "@/features/listings/components/ListingPhotoPicker";
import { ListingPriceField } from "@/features/listings/components/ListingPriceField";
import { listingFormSchema, type ListingFormSchema } from "@/features/listings/schemas/listingSchemas";
import type { ListingFormProps, ListingImage } from "@/features/listings/types/listing.interfaces";
import type { ContactType, ListingCondition } from "@/features/listings/types/listing.types";
import { getErrorMessage } from "@/utils/error.utils";
import { createObjectUrl, revokeObjectUrl } from "@/utils/file.utils";
import { listingImageCountError, prepareListingImage } from "@/utils/image.utils";

const NO_EXISTING_IMAGES: readonly ListingImage[] = [];

type FieldErrors = Record<string, string>;

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

function contactPlaceholder(contactType: ContactType): string {
  switch (contactType) {
    case "email":
      return "you@university.edu";
    case "phone":
      return "08012345678";
    case "other":
      return "Hall, WhatsApp, or another way to reach you";
    default: {
      const exhaustive: never = contactType;
      return exhaustive;
    }
  }
}

function initialValueKey(initialValues: ListingFormProps["initialValues"]): string {
  return [
    initialValues?.title ?? "",
    initialValues?.description ?? "",
    initialValues?.categoryId ?? "",
    initialValues?.price ?? "",
    initialValues?.currencyCode ?? "",
    initialValues?.condition ?? "",
    initialValues?.locationLabel ?? "",
    initialValues?.contactType ?? "",
    initialValues?.contactValue ?? "",
    initialValues?.status ?? "",
  ].join("\u001f");
}

function defaultValues(initialValues: ListingFormProps["initialValues"]): ListingFormSchema {
  return {
    title: initialValues?.title ?? "",
    description: initialValues?.description ?? "",
    categoryId: initialValues?.categoryId ?? "",
    price: initialValues?.price ?? Number.NaN,
    currencyCode: LISTING_CURRENCY_CODE,
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
  existingImages = NO_EXISTING_IMAGES,
  isSubmitting,
  submitLabel,
  onDraftChange,
  onSubmit,
}: ListingFormProps) {
  const [values, setValues] = useState<ListingFormSchema>(() => defaultValues(initialValues));
  const [trackedValueKey, setTrackedValueKey] = useState(() => initialValueKey(initialValues));
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [retainedImages, setRetainedImages] = useState<readonly ListingImage[]>(existingImages);
  const [previews, setPreviews] = useState<readonly ListingPhotoPreview[]>([]);
  const [isPreparingPhotos, setIsPreparingPhotos] = useState(false);
  const [isInternalSubmitting, setIsInternalSubmitting] = useState(false);
  const previewsRef = useRef(previews);
  const isPreparingRef = useRef(false);
  const existingImageKey = existingImages.map((image) => image.storagePath).join("|");
  const [trackedImageKey, setTrackedImageKey] = useState(existingImageKey);
  const nextValueKey = initialValueKey(initialValues);

  if (trackedValueKey !== nextValueKey) {
    setTrackedValueKey(nextValueKey);
    setValues(defaultValues(initialValues));
  }

  if (trackedImageKey !== existingImageKey) {
    setTrackedImageKey(existingImageKey);
    setRetainedImages(existingImages);
  }

  useEffect(() => {
    previewsRef.current = previews;
  }, [previews]);

  useEffect(() => {
    return () => {
      for (const preview of previewsRef.current) {
        revokeObjectUrl(preview.url);
      }
    };
  }, []);

  useEffect(() => {
    onDraftChange?.({
      title: values.title,
      description: values.description,
      price: values.price,
      categoryName: categories.find((category) => category.id === values.categoryId)?.name ?? "",
      condition: values.condition,
      locationLabel: values.locationLabel,
      photoUrls: [
        ...retainedImages.map((image) => image.url),
        ...previews.map((preview) => preview.url),
      ],
    });
  }, [categories, onDraftChange, previews, retainedImages, values]);

  const totalImages = retainedImages.length + previews.length;
  const submitDisabled = isSubmitting || isInternalSubmitting || isPreparingPhotos;
  const showCurrencyChangeNote = Boolean(
    initialValues?.currencyCode && initialValues.currencyCode !== LISTING_CURRENCY_CODE,
  );

  const updateField = <K extends keyof ListingFormSchema>(key: K, next: ListingFormSchema[K]) => {
    setValues((current) => ({ ...current, [key]: next }));
  };

  const addFiles = async (incoming: readonly File[]) => {
    if (isPreparingRef.current) {
      return;
    }
    setFormError(null);
    const remainingSlots = Math.max(0, MAX_LISTING_IMAGES - totalImages);
    if (remainingSlots <= 0) {
      setFormError(listingImageCountError(totalImages + 1) ?? "Too many photos.");
      return;
    }

    const accepted = incoming.slice(0, remainingSlots);
    if (incoming.length > remainingSlots) {
      setFormError(
        remainingSlots === 1
          ? "You can add 1 more photo."
          : `You can add ${remainingSlots} more photos.`,
      );
    }

    isPreparingRef.current = true;
    setIsPreparingPhotos(true);
    try {
      const nextPreviews: ListingPhotoPreview[] = [];
      for (const file of accepted) {
        try {
          const prepared = await prepareListingImage(file);
          nextPreviews.push({
            id: crypto.randomUUID(),
            file: prepared,
            url: createObjectUrl(prepared),
          });
        } catch (error) {
          setFormError(getErrorMessage(error, "Could not prepare that photo."));
        }
      }
      if (nextPreviews.length > 0) {
        setPreviews((current) => [...current, ...nextPreviews]);
      }
    } finally {
      isPreparingRef.current = false;
      setIsPreparingPhotos(false);
    }
  };

  const removePreview = (id: string) => {
    setPreviews((current) => {
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

    const imageError = listingImageCountError(totalImages);
    const parsed = listingFormSchema.safeParse({
      ...values,
      currencyCode: LISTING_CURRENCY_CODE,
    });

    if (!parsed.success) {
      setFieldErrors(mapZodErrors(parsed.error));
    }
    if (imageError) {
      setFormError(imageError);
    }
    if (!parsed.success || imageError) {
      return;
    }

    setIsInternalSubmitting(true);
    try {
      await onSubmit(parsed.data, {
        newFiles: previews.map((preview) => preview.file),
        retainedImages,
      });
    } catch (error) {
      setFormError(getErrorMessage(error, "Could not save listing."));
    } finally {
      setIsInternalSubmitting(false);
    }
  };

  const resolvedSubmitLabel = submitLabel ?? (mode === "create" ? "Publish listing" : "Save changes");
  const busyLabel = isPreparingPhotos ? "Preparing photos…" : "Saving…";

  return (
    <form className="space-y-10" onSubmit={handleSubmit} noValidate>
      {formError ? <FormError message={formError} /> : null}

      <fieldset className="space-y-4 border-0 p-0">
        <legend className="mb-4 text-lg font-semibold text-campus-ink">The item</legend>
        <TextField fullWidth isInvalid={Boolean(fieldErrors.title)}>
          <Label>Title</Label>
          <Input
            placeholder="Calculus textbook, barely marked"
            value={values.title}
            onChange={(event) => updateField("title", event.target.value)}
          />
          {fieldErrors.title ? <FieldError>{fieldErrors.title}</FieldError> : null}
        </TextField>

        <TextField fullWidth isInvalid={Boolean(fieldErrors.description)}>
          <Label>Description</Label>
          <TextArea
            className="min-h-32"
            placeholder="What it is, the condition, and anything a buyer should know."
            value={values.description}
            onChange={(event) => updateField("description", event.target.value)}
          />
          {fieldErrors.description ? <FieldError>{fieldErrors.description}</FieldError> : null}
        </TextField>
      </fieldset>

      <fieldset className="space-y-4 border-0 p-0">
        <legend className="mb-4 text-lg font-semibold text-campus-ink">Details</legend>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <Select
              fullWidth
              isDisabled={isCategoriesLoading || categories.length === 0}
              placeholder={isCategoriesLoading ? "Loading categories" : "Select category"}
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

        <TextField fullWidth isInvalid={Boolean(fieldErrors.locationLabel)}>
          <Label>Location</Label>
          <Input
            placeholder="Faculty of Science, main campus"
            value={values.locationLabel}
            onChange={(event) => updateField("locationLabel", event.target.value)}
          />
          {fieldErrors.locationLabel ? <FieldError>{fieldErrors.locationLabel}</FieldError> : null}
        </TextField>
      </fieldset>

      <ListingPriceField
        error={fieldErrors.price}
        showCurrencyChangeNote={showCurrencyChangeNote}
        value={values.price}
        onChange={(next) => updateField("price", next)}
      />

      <ListingPhotoPicker
        isPreparing={isPreparingPhotos}
        previews={previews}
        retainedImages={retainedImages}
        onAddFiles={(files) => {
          void addFiles(files);
        }}
        onRemovePreview={removePreview}
        onRemoveRetained={(storagePath) => {
          setRetainedImages((current) => current.filter((image) => image.storagePath !== storagePath));
        }}
      />

      <fieldset className="space-y-4 border-0 p-0">
        <legend className="mb-4 text-lg font-semibold text-campus-ink">How buyers reach you</legend>
        <p className="max-w-prose text-sm leading-relaxed text-campus-ink/75">
          This contact is public on the listing. The forum does not take payment.
        </p>
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
            <Label>Contact</Label>
            <Input
              placeholder={contactPlaceholder(values.contactType)}
              value={values.contactValue}
              onChange={(event) => updateField("contactValue", event.target.value)}
            />
            {fieldErrors.contactValue ? <FieldError>{fieldErrors.contactValue}</FieldError> : null}
          </TextField>
        </div>
      </fieldset>

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

      <Button className="w-full md:w-auto" isDisabled={submitDisabled} type="submit">
        {submitDisabled ? busyLabel : resolvedSubmitLabel}
      </Button>
    </form>
  );
}
