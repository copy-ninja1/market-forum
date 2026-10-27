import { Link } from "react-router-dom";
import { listingDetailsPath } from "@/constants/route.constants";
import { ListingStatusBadge } from "@/features/listings/components/ListingStatusBadge";
import type { ListingCardProps } from "@/features/listings/types/listing.interfaces";
import { formatMoney } from "@/utils/currency.utils";

export function ListingCard({ listing }: ListingCardProps) {
  const cover = listing.images[0];
  const detailPath = listingDetailsPath(listing.id);

  return (
    <article className="h-full">
      <Link className="focus-ring group flex h-full flex-col overflow-hidden rounded-3xl bg-white" to={detailPath}>
        <div className="relative aspect-[4/5] overflow-hidden bg-campus-mist">
          {cover ? (
            <img
              alt={cover.altText}
              className="size-full object-cover transition duration-500 group-hover:scale-[1.04]"
              height={480}
              loading="lazy"
              src={cover.url}
              width={360}
            />
          ) : (
            <div className="flex size-full items-end bg-[radial-gradient(circle_at_30%_20%,oklch(0.93_0.02_88),oklch(0.86_0.02_88))] p-4">
              <span className="font-display text-2xl text-campus-ink/35">No photo</span>
            </div>
          )}
          <div className="absolute left-3 top-3">
            <ListingStatusBadge status={listing.status} />
          </div>
          <p className="absolute bottom-3 left-3 rounded-full bg-campus-paper/95 px-3 py-1 text-sm font-semibold text-campus-ink">
            {formatMoney(listing.price, listing.currencyCode)}
          </p>
        </div>
        <div className="flex flex-1 flex-col gap-2 px-4 py-4">
          <h2 className="font-display line-clamp-2 text-xl leading-snug tracking-tight text-campus-ink">
            {listing.title}
          </h2>
          <p className="mt-auto text-sm text-campus-ink/65">
            {listing.categoryName} · {listing.locationLabel}
          </p>
        </div>
      </Link>
    </article>
  );
}
