import { useState } from "react";
import type { ListingImageGalleryProps } from "@/features/listings/types/listing.interfaces";

export function ListingImageGallery({ images, title }: ListingImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex] ?? images[0];

  if (images.length === 0) {
    return (
      <div className="flex aspect-[4/5] items-end rounded-[2rem] bg-[radial-gradient(circle_at_30%_20%,oklch(0.94_0.02_88),oklch(0.86_0.02_88))] p-6">
        <p className="font-display text-4xl text-campus-ink/40">No photos yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="aspect-[4/5] overflow-hidden rounded-[2rem] bg-campus-mist sm:aspect-[5/4]">
        <img
          alt={activeImage?.altText ?? title}
          className="size-full object-cover"
          height={720}
          src={activeImage?.url}
          width={900}
        />
      </div>
      {images.length > 1 ? (
        <ul className="flex gap-2 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <li key={image.storagePath}>
              <button
                aria-label={`Show photo ${index + 1} of ${title}`}
                className={`focus-ring size-20 shrink-0 overflow-hidden rounded-2xl border-2 ${
                  index === activeIndex ? "border-campus-ink" : "border-transparent opacity-75"
                }`}
                type="button"
                onClick={() => setActiveIndex(index)}
              >
                <img alt="" className="size-full object-cover" height={80} src={image.url} width={80} />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
