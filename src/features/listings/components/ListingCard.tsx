import { Card } from "@heroui/react";
import { Link } from "react-router-dom";
import { listingDetailsPath } from "@/constants/route.constants";
import { ListingStatusBadge } from "@/features/listings/components/ListingStatusBadge";
import type { ListingCardProps } from "@/features/listings/types/listing.interfaces";
import { formatMoney } from "@/utils/currency.utils";

export function ListingCard({ listing }: ListingCardProps) {
  const cover = listing.images[0];
  const detailPath = listingDetailsPath(listing.id);

  return (
    <Link className="focus-ring block rounded-xl" to={detailPath}>
    <Card
      className="group overflow-hidden border border-campus-mist/80 bg-campus-paper transition hover:border-campus-leaf/40 hover:shadow-md"
      variant="secondary"
    >
      <div className="aspect-[4/3] overflow-hidden bg-campus-mist/40">
        {cover ? (
          <img
            alt={cover.altText}
            className="size-full object-cover transition duration-300 group-hover:scale-[1.02]"
            height={240}
            loading="lazy"
            src={cover.url}
            width={320}
          />
        ) : (
          <div className="flex size-full items-center justify-center text-sm text-campus-ink/50">No photo</div>
        )}
      </div>
      <Card.Content className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <Card.Title className="line-clamp-2 font-display text-lg leading-snug text-campus-ink">
            {listing.title}
          </Card.Title>
          <ListingStatusBadge status={listing.status} />
        </div>
        <p className="font-medium text-campus-leaf">{formatMoney(listing.price, listing.currencyCode)}</p>
        <Card.Description className="line-clamp-1 text-sm">
          {listing.categoryName} · {listing.locationLabel}
        </Card.Description>
      </Card.Content>
    </Card>
    </Link>
  );
}
