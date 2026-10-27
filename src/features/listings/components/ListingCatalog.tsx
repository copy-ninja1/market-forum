import { Link } from "react-router-dom";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingState } from "@/components/ui/LoadingState";
import { CONDITION_LABELS } from "@/constants/listing.constants";
import { listingDetailsPath, memberPath } from "@/constants/route.constants";
import { ListingStatusBadge } from "@/features/listings/components/ListingStatusBadge";
import type { Listing, ListingCatalogProps } from "@/features/listings/types/listing.interfaces";
import { formatMoney } from "@/utils/currency.utils";
import { formatRelativeDate } from "@/utils/date.utils";

type CatalogFact = {
  readonly label: string;
  readonly value: string;
  readonly href?: string;
};

function ListingCatalogRow({
  listing,
  showSeller,
}: {
  readonly listing: Listing;
  readonly showSeller: boolean;
}) {
  const cover = listing.images[0];
  const facts: CatalogFact[] = [
    ...(showSeller
      ? [
          {
            label: "Seller",
            value: listing.ownerDisplayName,
            href: memberPath(listing.ownerUid),
          },
        ]
      : []),
    { label: "Category", value: listing.categoryName },
    { label: "Condition", value: CONDITION_LABELS[listing.condition] },
    { label: "Location", value: listing.locationLabel },
    { label: "Posted", value: formatRelativeDate(listing.createdAt) },
  ];

  return (
    <li className="border-b border-campus-ink/10 last:border-b-0">
      <article className="flex gap-4 px-4 py-4 transition-colors hover:bg-campus-paper/70 md:px-5">
        <Link
          aria-label={`Open ${listing.title}`}
          className="size-20 shrink-0 overflow-hidden rounded-md bg-campus-mist md:size-24"
          to={listingDetailsPath(listing.id)}
        >
          {cover ? (
            <img
              alt={cover.altText}
              className="size-full object-cover"
              height={96}
              loading="lazy"
              src={cover.url}
              width={96}
            />
          ) : (
            <span className="flex size-full items-center justify-center px-2 text-center text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-campus-ink/40">
              No photo
            </span>
          )}
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-semibold tracking-tight text-campus-ink">
                  <Link
                    className="rounded-sm hover:text-campus-leaf"
                    to={listingDetailsPath(listing.id)}
                  >
                    {listing.title}
                  </Link>
                </h2>
                <ListingStatusBadge status={listing.status} />
              </div>
              <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-campus-ink/65">
                {listing.description}
              </p>
            </div>
            <p className="shrink-0 text-right text-base font-semibold tabular-nums text-campus-ink">
              <span className="sr-only">Price </span>
              {formatMoney(listing.price, listing.currencyCode)}
            </p>
          </div>

          <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3 lg:grid-cols-5">
            {facts.map((fact) => (
              <div key={fact.label} className="min-w-0">
                <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-campus-ink/45">
                  {fact.label}
                </dt>
                <dd className="mt-0.5 truncate text-sm font-medium text-campus-ink">
                  {fact.href ? (
                    <Link className="rounded-sm hover:text-campus-leaf" to={fact.href}>
                      {fact.value}
                    </Link>
                  ) : (
                    fact.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </article>
    </li>
  );
}

export function ListingCatalog({
  listings,
  isLoading = false,
  emptyTitle = "No listings yet",
  emptyDescription = "Try adjusting filters or check back soon for new posts.",
  emptyAction,
  showSeller = true,
}: ListingCatalogProps) {
  if (isLoading && listings.length === 0) {
    return <LoadingState message="Loading listings…" />;
  }

  if (!isLoading && listings.length === 0) {
    return (
      <EmptyState action={emptyAction} description={emptyDescription} title={emptyTitle} />
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-campus-ink/10 bg-white">
      <div className="flex items-center justify-between border-b border-campus-ink/10 bg-campus-mist/40 px-4 py-2.5 md:px-5">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-campus-ink/50">
          Catalog
        </p>
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-campus-ink/50">
          {listings.length} shown
        </p>
      </div>
      <ul>
        {listings.map((listing) => (
          <ListingCatalogRow key={listing.id} listing={listing} showSeller={showSeller} />
        ))}
      </ul>
    </div>
  );
}
