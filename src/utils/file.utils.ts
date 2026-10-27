import {
  ALLOWED_IMAGE_MIME_TYPES,
  MAX_IMAGE_BYTES,
} from "@/constants/app.constants";

export type ImageValidationResult =
  | { readonly ok: true }
  | { readonly ok: false; readonly message: string };

export function validateImageFile(file: File): ImageValidationResult {
  if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_MIME_TYPES)[number])) {
    return {
      ok: false,
      message: "Only JPEG, PNG, and WebP images are allowed.",
    };
  }

  if (file.size > MAX_IMAGE_BYTES) {
    return {
      ok: false,
      message: "Each image must be 5 MB or smaller.",
    };
  }

  return { ok: true };
}

export function createObjectUrl(file: File): string {
  return URL.createObjectURL(file);
}

export function revokeObjectUrl(url: string): void {
  URL.revokeObjectURL(url);
}
