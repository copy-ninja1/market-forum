import { Button } from "@heroui/react";
import { useState, type DragEvent } from "react";
import { MAX_LISTING_IMAGES, MIN_LISTING_IMAGES } from "@/constants/app.constants";
import type { ListingImage } from "@/features/listings/types/listing.interfaces";
import { formatImageSize } from "@/utils/image.utils";

export type ListingPhotoPreview = {
  readonly id: string;
  readonly file: File;
  readonly url: string;
};

type ListingPhotoPickerProps = {
  readonly retainedImages: readonly ListingImage[];
  readonly previews: readonly ListingPhotoPreview[];
  readonly isPreparing: boolean;
  readonly onAddFiles: (files: readonly File[]) => void;
  readonly onRemovePreview: (id: string) => void;
  readonly onRemoveRetained: (storagePath: string) => void;
};

function RemoveIcon() {
  return (
    <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 16 16">
      <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
    </svg>
  );
}

export function ListingPhotoPicker({
  retainedImages,
  previews,
  isPreparing,
  onAddFiles,
  onRemovePreview,
  onRemoveRetained,
}: ListingPhotoPickerProps) {
  const [isDragging, setIsDragging] = useState(false);
  const total = retainedImages.length + previews.length;
  const canAdd = total < MAX_LISTING_IMAGES && !isPreparing;

  const takeFiles = (list: FileList | null) => {
    if (!list || list.length === 0) {
      return;
    }
    onAddFiles(Array.from(list));
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    takeFiles(event.dataTransfer.files);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-sm font-semibold text-campus-ink">Photos</p>
        <p className="text-sm tabular-nums text-campus-ink/75">
          {total}/{MAX_LISTING_IMAGES}
        </p>
      </div>
      <p className="max-w-prose text-sm leading-relaxed text-campus-ink">
        Add {MIN_LISTING_IMAGES} or {MAX_LISTING_IMAGES} photos. They are resized and saved as WebP
        before upload, and cropped to this tall frame in browse.
      </p>
      <div
        className={`grid grid-cols-2 gap-3 sm:max-w-md ${isDragging ? "rounded-2xl outline outline-2 outline-offset-4 outline-campus-leaf" : ""}`}
        onDragLeave={() => setIsDragging(false)}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDrop={handleDrop}
      >
        {retainedImages.map((image) => (
          <figure key={image.storagePath} className="relative">
            <img
              alt={image.altText}
              className="aspect-[4/5] w-full rounded-2xl object-cover"
              height={320}
              src={image.url}
              width={256}
            />
            <Button
              aria-label={`Remove ${image.altText}`}
              className="absolute right-2 top-2 size-11 min-w-11 rounded-full bg-campus-paper px-0 text-campus-ink"
              size="sm"
              variant="secondary"
              onPress={() => onRemoveRetained(image.storagePath)}
            >
              <RemoveIcon />
            </Button>
          </figure>
        ))}
        {previews.map((preview) => (
          <figure key={preview.id} className="relative">
            <img
              alt=""
              className="aspect-[4/5] w-full rounded-2xl object-cover"
              height={320}
              src={preview.url}
              width={256}
            />
            <figcaption className="absolute bottom-3 left-3 rounded-full bg-campus-paper px-2.5 py-1 text-xs tabular-nums text-campus-ink">
              WebP · {formatImageSize(preview.file.size)}
            </figcaption>
            <Button
              aria-label="Remove new photo"
              className="absolute right-2 top-2 size-11 min-w-11 rounded-full bg-campus-paper px-0 text-campus-ink"
              size="sm"
              variant="secondary"
              onPress={() => onRemovePreview(preview.id)}
            >
              <RemoveIcon />
            </Button>
          </figure>
        ))}
        {canAdd ? (
          <label
            className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-campus-ink/25 bg-campus-paper px-4 text-center text-campus-ink hover:border-campus-leaf ${
              total === 0 ? "col-span-2 min-h-48" : "aspect-[4/5]"
            }`}
          >
            <input
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              multiple
              type="file"
              onChange={(event) => {
                takeFiles(event.target.files);
                event.target.value = "";
              }}
            />
            <span className="text-sm font-semibold">Add photo</span>
            <span className="mt-1 text-sm text-campus-ink/75">JPEG, PNG, or WebP</span>
          </label>
        ) : null}
        {isPreparing ? (
          <p className="col-span-2 text-sm text-campus-ink" role="status">
            Compressing photo to WebP…
          </p>
        ) : null}
      </div>
    </div>
  );
}
