import {
  ALLOWED_IMAGE_MIME_TYPES,
  LISTING_IMAGE_MAX_EDGE_PX,
  MAX_IMAGE_BYTES,
  MAX_LISTING_IMAGES,
  MAX_SOURCE_IMAGE_BYTES,
  MIN_LISTING_IMAGES,
} from "@/constants/app.constants";
import type { ImageValidationResult } from "@/utils/file.utils";

const PREPARED_SUFFIX = ".smf.webp";
const WEBP_QUALITIES = [0.82, 0.68, 0.52] as const;
const EDGE_STEPS = [LISTING_IMAGE_MAX_EDGE_PX, 1280, 960] as const;

export type ScaledSize = {
  readonly width: number;
  readonly height: number;
};

/**
 * Fit an image inside a square edge without enlarging it.
 */
export function scaledSize(width: number, height: number, maxEdge: number): ScaledSize {
  const longest = Math.max(width, height);
  if (longest <= maxEdge) {
    return {
      width: Math.max(1, Math.round(width)),
      height: Math.max(1, Math.round(height)),
    };
  }

  const scale = maxEdge / longest;
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

export function webpFileName(originalName: string): string {
  const withoutPreparedSuffix = originalName.replace(/\.smf\.webp$/i, "");
  const withoutExtension = withoutPreparedSuffix.replace(/\.[^.]+$/, "");
  const cleaned = withoutExtension
    .replace(/[^a-zA-Z0-9._-]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "")
    .slice(0, 60);

  return `${cleaned.length > 0 ? cleaned : "photo"}${PREPARED_SUFFIX}`;
}

export function formatImageSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  const kilobytes = bytes / 1024;
  if (kilobytes < 1024) {
    return `${Math.max(1, Math.round(kilobytes))} KB`;
  }
  return `${(kilobytes / 1024).toFixed(1)} MB`;
}

export function listingImageCountError(count: number): string | null {
  if (count < MIN_LISTING_IMAGES) {
    return "Add at least one photo.";
  }
  if (count > MAX_LISTING_IMAGES) {
    return `A listing can have at most ${MAX_LISTING_IMAGES} photos.`;
  }
  return null;
}

/** True when this file was already minified by `prepareListingImage`. */
export function isPreparedListingImage(file: File): boolean {
  return (
    file.type === "image/webp" &&
    file.name.endsWith(PREPARED_SUFFIX) &&
    file.size > 0 &&
    file.size <= MAX_IMAGE_BYTES
  );
}

export function validateSelectableImage(file: File): ImageValidationResult {
  if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_MIME_TYPES)[number])) {
    return {
      ok: false,
      message: "Use a JPEG, PNG, or WebP photo.",
    };
  }

  if (file.size <= 0) {
    return {
      ok: false,
      message: "That file is empty.",
    };
  }

  if (file.size > MAX_SOURCE_IMAGE_BYTES) {
    return {
      ok: false,
      message: "Each photo must be 15 MB or smaller.",
    };
  }

  return { ok: true };
}

function canvasToWebpBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Could not convert this photo to WebP."));
          return;
        }
        resolve(blob);
      },
      "image/webp",
      quality,
    );
  });
}

/**
 * Resize a photo and encode it as WebP before it is stored or uploaded.
 * Files this function creates use a `.smf.webp` name so a later upload can skip a second pass.
 */
export async function prepareListingImage(file: File): Promise<File> {
  const selectable = validateSelectableImage(file);
  if (!selectable.ok) {
    throw new Error(selectable.message);
  }

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new Error("Could not read this photo. Use a JPEG, PNG, or WebP image.");
  }

  try {
    if (bitmap.width < 1 || bitmap.height < 1) {
      throw new Error("Could not read this photo. Use a JPEG, PNG, or WebP image.");
    }

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Could not prepare this photo.");
    }

    let preparedBlob: Blob | null = null;
    for (const edge of EDGE_STEPS) {
      const size = scaledSize(bitmap.width, bitmap.height, edge);
      canvas.width = size.width;
      canvas.height = size.height;
      context.drawImage(bitmap, 0, 0, size.width, size.height);

      for (const quality of WEBP_QUALITIES) {
        const blob = await canvasToWebpBlob(canvas, quality);
        if (blob.size <= MAX_IMAGE_BYTES) {
          preparedBlob = blob;
          break;
        }
      }

      if (preparedBlob) {
        break;
      }
    }

    if (!preparedBlob) {
      throw new Error("This photo is still too large after compression. Try a different image.");
    }

    return new File([preparedBlob], webpFileName(file.name), {
      type: "image/webp",
      lastModified: Date.now(),
    });
  } finally {
    bitmap.close();
  }
}
