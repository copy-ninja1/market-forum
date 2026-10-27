import { useState } from "react";
import type { ListingImageGalleryProps } from "@/features/listings/types/listing.interfaces";

export function ListingImageGallery({ images, title }: ListingImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex] ?? images[0];

  if (images.length === 0) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center rounded-xl border border-campus-mist bg-campus-mist/30 text-campus-ink/60">
        No photos for this listing
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="aspect-[4/3] overflow-hidden rounded-xl border border-campus-mist bg-campus-mist/20">
        <img
          alt={activeImage?.altText ?? title}
          className="size-full object-cover"
          height={480}
          src={activeImage?.url}
          width={640}
        />
      </div>
      {images.length > 1 ? (
        <ul className="flex gap-2 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <li key={image.storagePath}>
              <button
                className={`focus-ring size-16 shrink-0 overflow-hidden rounded-lg border-2 ${
                  index === activeIndex ? "border-campus-leaf" : "border-transparent opacity-80"
                }`}
                type="button"
                onClick={() => setActiveIndex(index)}
              >
                <img alt={image.altText} className="size-full object-cover" height={64} src={image.url} width={64} />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
