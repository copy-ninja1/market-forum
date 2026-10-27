import { Button } from "@heroui/react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { CONDITION_LABELS } from "@/constants/listing.constants";
import { editListingPath, ROUTES } from "@/constants/route.constants";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { ListingImageGallery } from "@/features/listings/components/ListingImageGallery";
import { ListingStatusBadge } from "@/features/listings/components/ListingStatusBadge";
import { useListing } from "@/features/listings/hooks/useListing";
import { ReportListingForm } from "@/features/reports/components/ReportListingForm";
import { formatMoney } from "@/utils/currency.utils";
import { formatRelativeDate } from "@/utils/date.utils";

export function ListingDetailsPage() {
  const { listingId } = useParams<{ listingId: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { listing, isLoading, error, notFound, reload } = useListing(listingId);

  if (isLoading) {
    return <LoadingState message="Loading listing…" />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => void reload()} />;
  }

  if (notFound || !listing) {
    return (
      <EmptyState
        action={
          <Link to={ROUTES.browse}>
            <Button variant="primary">Back to browse</Button>
          </Link>
        }
        description="This listing may have been removed or the link is incorrect."
        title="Listing not found"
      />
    );
  }

  const isOwner = user?.uid === listing.ownerUid;
  const contactLabel =
    listing.contactType === "email"
      ? "Email"
      : listing.contactType === "phone"
        ? "Phone"
        : "Contact";
  const contactHref =
    listing.contactType === "email"
      ? `mailto:${listing.contactValue}`
      : listing.contactType === "phone"
        ? `tel:${listing.contactValue}`
        : undefined;

  return (
    <div className="space-y-10">
      <nav aria-label="Breadcrumb" className="text-sm text-campus-ink/60">
        <Link className="focus-ring rounded-sm hover:text-campus-ink" to={ROUTES.browse}>
          Browse
        </Link>
        <span aria-hidden className="px-2">
          /
        </span>
        <span className="text-campus-ink">{listing.categoryName}</span>
      </nav>

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
        <ListingImageGallery images={listing.images} title={listing.title} />

        <div className="space-y-5 lg:sticky lg:top-28">
          <div className="flex flex-wrap items-center gap-2">
            <ListingStatusBadge status={listing.status} />
            <span className="text-sm text-campus-ink/60">{CONDITION_LABELS[listing.condition]}</span>
          </div>
          <h1 className="font-display text-4xl tracking-tight text-campus-ink md:text-5xl">
            {listing.title}
          </h1>
          <p className="font-display text-4xl text-campus-copper">
            {formatMoney(listing.price, listing.currencyCode)}
          </p>
          <p className="text-sm text-campus-ink/65">
            Posted {formatRelativeDate(listing.createdAt)} by {listing.ownerDisplayName}
          </p>

          <dl className="grid grid-cols-2 gap-4 rounded-3xl bg-white p-5 text-sm">
            <div>
              <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-campus-ink/50">
                Category
              </dt>
              <dd className="mt-1 font-semibold text-campus-ink">{listing.categoryName}</dd>
            </div>
            <div>
              <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-campus-ink/50">
                Location
              </dt>
              <dd className="mt-1 font-semibold text-campus-ink">{listing.locationLabel}</dd>
            </div>
          </dl>

          <section className="panel p-5">
            <h2 className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-campus-ink/50">
              {contactLabel}
            </h2>
            <p className="mt-2 break-all text-lg font-semibold text-campus-ink">{listing.contactValue}</p>
            <p className="mt-2 text-sm leading-relaxed text-campus-ink/65">
              This is the contact method the seller chose to publish. Meet in a public campus place.
            </p>
            {contactHref ? (
              <a
                className="focus-ring mt-4 inline-flex h-11 items-center rounded-full bg-campus-ink px-5 text-sm font-semibold text-campus-paper"
                href={contactHref}
              >
                Contact seller
              </a>
            ) : null}
            {isOwner ? (
              <div className="mt-4">
                <Link to={editListingPath(listing.id)}>
                  <Button variant="secondary">Edit listing</Button>
                </Link>
              </div>
            ) : null}
          </section>
        </div>
      </div>

      <section className="max-w-3xl">
        <h2 className="font-display text-3xl tracking-tight text-campus-ink">Description</h2>
        <p className="mt-4 whitespace-pre-wrap text-base leading-relaxed text-campus-ink/80">
          {listing.description}
        </p>
      </section>

      {!isOwner ? (
        <section className="panel max-w-3xl p-5 md:p-7">
          <h2 className="font-display text-2xl text-campus-ink">Report this listing</h2>
          <p className="mt-1 text-sm text-campus-ink/70">
            Flag suspicious or prohibited content for moderator review.
          </p>

          {!isAuthenticated ? (
            <p className="mt-4 text-sm">
              <Link className="font-semibold text-campus-leaf hover:underline" to={ROUTES.signIn}>
                Sign in
              </Link>{" "}
              to submit a report.
            </p>
          ) : (
            <ReportListingForm
              listingId={listing.id}
              reporterUid={user?.uid ?? ""}
              onRequireSignIn={() =>
                navigate(ROUTES.signIn, { state: { from: window.location.pathname } })
              }
            />
          )}
        </section>
      ) : null}
    </div>
  );
}
