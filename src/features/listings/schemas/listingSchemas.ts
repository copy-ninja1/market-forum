import { z } from "zod";
import {
  LISTING_DESCRIPTION_MAX,
  LISTING_LOCATION_MAX,
  LISTING_TITLE_MAX,
  LISTING_CONTACT_VALUE_MAX,
} from "@/constants/app.constants";

export const listingFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters.")
    .max(LISTING_TITLE_MAX, `Title must be ${LISTING_TITLE_MAX} characters or fewer.`),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters.")
    .max(
      LISTING_DESCRIPTION_MAX,
      `Description must be ${LISTING_DESCRIPTION_MAX} characters or fewer.`,
    ),
  categoryId: z.string().min(1, "Select a category."),
  price: z.coerce
    .number()
    .finite()
    .min(0, "Price cannot be negative.")
    .max(1_000_000, "Price is too high."),
  currencyCode: z
    .string()
    .trim()
    .length(3, "Currency code must be 3 letters.")
    .regex(/^[A-Z]{3}$/, "Use a 3-letter currency code like USD."),
  condition: z.enum(["new", "like-new", "good", "fair"]),
  locationLabel: z
    .string()
    .trim()
    .min(2, "Location must be at least 2 characters.")
    .max(LISTING_LOCATION_MAX, `Location must be ${LISTING_LOCATION_MAX} characters or fewer.`),
  contactType: z.enum(["email", "phone", "other"]),
  contactValue: z
    .string()
    .trim()
    .min(3, "Contact value must be at least 3 characters.")
    .max(
      LISTING_CONTACT_VALUE_MAX,
      `Contact value must be ${LISTING_CONTACT_VALUE_MAX} characters or fewer.`,
    ),
  status: z.enum(["active", "sold", "unavailable"]).optional(),
});

export type ListingFormSchema = z.infer<typeof listingFormSchema>;
