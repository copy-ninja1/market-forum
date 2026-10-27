import { Button } from "@heroui/react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { PageHeader } from "@/components/ui/PageHeader";
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

  return (
    <div className="space-y-8">
      <PageHeader
        actions={
          isOwner ? (
            <Link to={editListingPath(listing.id)}>
              <Button variant="secondary">Edit listing</Button>
            </Link>
          ) : null
        }
        description={`Posted ${formatRelativeDate(listing.createdAt)} by ${listing.ownerDisplayName}`}
        title={listing.title}
      />

      <div className="grid gap-8 lg:grid-cols-2">
        <ListingImageGallery images={listing.images} title={listing.title} />

        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <p className="font-display text-3xl text-campus-leaf">
              {formatMoney(listing.price, listing.currencyCode)}
            </p>
            <ListingStatusBadge status={listing.status} />
          </div>

          <dl className="grid gap-3 text-sm">
            <div>
              <dt className="font-medium text-campus-ink">Category</dt>
              <dd className="text-campus-ink/75">{listing.categoryName}</dd>
            </div>
            <div>
              <dt className="font-medium text-campus-ink">Condition</dt>
              <dd className="text-campus-ink/75">{CONDITION_LABELS[listing.condition]}</dd>
            </div>
            <div>
              <dt className="font-medium text-campus-ink">Location</dt>
              <dd className="text-campus-ink/75">{listing.locationLabel}</dd>
            </div>
            <div>
              <dt className="font-medium text-campus-ink">{contactLabel}</dt>
              <dd className="text-campus-ink/75">{listing.contactValue}</dd>
            </div>
          </dl>

          <section className="rounded-xl border border-campus-mist bg-campus-paper/80 p-4">
            <h2 className="font-display text-lg text-campus-ink">Description</h2>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-campus-ink/80">
              {listing.description}
            </p>
          </section>
        </div>
      </div>

      {!isOwner ? (
        <section className="rounded-xl border border-campus-mist bg-campus-paper/80 p-4 md:p-6">
          <h2 className="font-display text-xl text-campus-ink">Report this listing</h2>
          <p className="mt-1 text-sm text-campus-ink/70">
            Flag suspicious or prohibited content for moderator review.
          </p>

          {!isAuthenticated ? (
            <p className="mt-4 text-sm">
              <Link className="text-campus-leaf hover:underline" to={ROUTES.signIn}>
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
