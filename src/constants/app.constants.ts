export const APP_NAME =
  import.meta.env.VITE_APP_NAME?.trim() || "Student Market Forum";

export const DEFAULT_CURRENCY_CODE =
  import.meta.env.VITE_DEFAULT_CURRENCY_CODE?.trim() || "USD";

export const MAX_LISTING_IMAGES = 5;
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const ALLOWED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const LISTING_TITLE_MAX = 80;
export const LISTING_DESCRIPTION_MAX = 2000;
export const LISTING_LOCATION_MAX = 80;
export const LISTING_CONTACT_VALUE_MAX = 120;
export const REPORT_DETAILS_MAX = 500;
export const PAGE_SIZE = 12;
