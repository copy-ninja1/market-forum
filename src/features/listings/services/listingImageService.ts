import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
  type UploadTaskSnapshot,
} from "firebase/storage";
import type { ListingImage } from "@/features/listings/types/listing.interfaces";
import { MAX_LISTING_IMAGES } from "@/constants/app.constants";
import { getFirebaseStorage, listingImagePath } from "@/lib/firebase/firebaseStorage";
import { validateImageFile } from "@/utils/file.utils";
import { isPreparedListingImage, prepareListingImage } from "@/utils/image.utils";

export type ListingImageUploadProgress = {
  readonly fileIndex: number;
  readonly fileName: string;
  readonly percent: number;
};

function sanitizeFileName(fileName: string): string {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
}

function buildAltText(fileName: string, index: number): string {
  const base = fileName
    .replace(/\.smf\.webp$/i, "")
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .trim();
  return base.length > 0 ? base : `Listing image ${index + 1}`;
}

async function uploadSingleImage(
  ownerUid: string,
  listingId: string,
  file: File,
  fileIndex: number,
  onProgress?: (progress: ListingImageUploadProgress) => void,
): Promise<ListingImage> {
  const prepared = isPreparedListingImage(file) ? file : await prepareListingImage(file);
  const validation = validateImageFile(prepared);
  if (!validation.ok) {
    throw new Error(validation.message);
  }
  if (prepared.type !== "image/webp") {
    throw new Error("Photos must be converted to WebP before upload.");
  }

  const storagePath = listingImagePath(
    ownerUid,
    listingId,
    `${Date.now()}-${fileIndex}-${sanitizeFileName(prepared.name)}`,
  );
  const storageRef = ref(getFirebaseStorage(), storagePath);
  const uploadTask = uploadBytesResumable(storageRef, prepared, {
    contentType: prepared.type,
  });

  await new Promise<void>((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot: UploadTaskSnapshot) => {
        const percent =
          snapshot.totalBytes > 0
            ? Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
            : 0;
        onProgress?.({
          fileIndex,
          fileName: prepared.name,
          percent,
        });
      },
      (error) => {
        reject(error);
      },
      () => {
        resolve();
      },
    );
  });

  const url = await getDownloadURL(uploadTask.snapshot.ref);
  return {
    url,
    storagePath,
    altText: buildAltText(prepared.name, fileIndex),
  };
}

export async function uploadListingImages(
  ownerUid: string,
  listingId: string,
  files: readonly File[],
  onProgress?: (progress: ListingImageUploadProgress) => void,
): Promise<readonly ListingImage[]> {
  if (files.length === 0) {
    return [];
  }
  if (files.length > MAX_LISTING_IMAGES) {
    throw new Error(`You can upload up to ${MAX_LISTING_IMAGES} images per listing.`);
  }

  const uploaded: ListingImage[] = [];
  for (let index = 0; index < files.length; index += 1) {
    const file = files[index];
    if (!file) {
      continue;
    }
    const image = await uploadSingleImage(ownerUid, listingId, file, index, onProgress);
    uploaded.push(image);
  }
  return uploaded;
}

export async function deleteImagesByPaths(storagePaths: readonly string[]): Promise<void> {
  if (storagePaths.length === 0) {
    return;
  }

  const storage = getFirebaseStorage();
  const results = await Promise.allSettled(
    storagePaths.map((path) => deleteObject(ref(storage, path))),
  );

  const failures = results.filter((result) => result.status === "rejected");
  if (failures.length > 0) {
    throw new Error("One or more listing images could not be deleted from storage.");
  }
}

export const listingImageService = {
  uploadListingImages,
  deleteImagesByPaths,
};
