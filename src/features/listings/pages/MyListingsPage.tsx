import { Button } from "@heroui/react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { FormError } from "@/components/feedback/FormError";
import { ErrorState } from "@/components/ui/ErrorState";
import { PageHeader } from "@/components/ui/PageHeader";
import { editListingPath, listingDetailsPath, ROUTES } from "@/constants/route.constants";
import { DeleteListingDialog } from "@/features/listings/components/DeleteListingDialog";
import { ListingStatusBadge } from "@/features/listings/components/ListingStatusBadge";
import { LoadingState } from "@/components/ui/LoadingState";
import { EmptyState } from "@/components/ui/EmptyState";
import { useMyListings } from "@/features/listings/hooks/useMyListings";
import type { Listing } from "@/features/listings/types/listing.interfaces";
import { listingService } from "@/features/listings/services/listingService";
import type { ListingStatus } from "@/features/listings/types/listing.types";
import { formatMoney } from "@/utils/currency.utils";
import { getErrorMessage } from "@/utils/error.utils";
import { OWNER_EDITABLE_STATUSES, STATUS_LABELS } from "@/constants/listing.constants";

export function MyListingsPage() {
  const { listings, isLoading, error, reload } = useMyListings();
  const [deleteTarget, setDeleteTarget] = useState<Listing | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleStatusChange = async (listing: Listing, status: ListingStatus) => {
    setActionError(null);
    setUpdatingId(listing.id);
    try {
      await listingService.updateListingStatus(listing.id, status);
      await reload();
    } catch (cause) {
      setActionError(getErrorMessage(cause, "Could not update status."));
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        actions={
          <Link to={ROUTES.createListing}>
            <Button variant="primary">New listing</Button>
          </Link>
        }
        description="Manage availability, edit details, or remove posts you no longer need."
        title="My listings"
      />

      {actionError ? <FormError message={actionError} /> : null}
      {error ? <ErrorState message={error} onRetry={() => void reload()} /> : null}

      {isLoading ? <LoadingState message="Loading your listings…" /> : null}

      {!isLoading && listings.length === 0 ? (
        <EmptyState
          action={
            <Link to={ROUTES.createListing}>
              <Button variant="primary">Post your first listing</Button>
            </Link>
          }
          description="When you publish items, they will show up here."
          title="You have no listings yet"
        />
      ) : null}

      {!isLoading && listings.length > 0 ? (
        <ul className="space-y-4">
          {listings.map((listing) => (
            <li
              key={listing.id}
              className="flex flex-col gap-4 rounded-xl border border-campus-mist bg-campus-paper/90 p-4 md:flex-row md:items-center md:justify-between"
            >
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Link className="font-display text-lg text-campus-ink hover:text-campus-leaf" to={listingDetailsPath(listing.id)}>
                    {listing.title}
                  </Link>
                  <ListingStatusBadge status={listing.status} />
                </div>
                <p className="text-sm text-campus-ink/70">{formatMoney(listing.price, listing.currencyCode)}</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <label className="sr-only" htmlFor={`status-${listing.id}`}>
                  Status for {listing.title}
                </label>
                <select
                  className="focus-ring rounded-md border border-campus-mist bg-white px-3 py-2 text-sm"
                  disabled={updatingId === listing.id}
                  id={`status-${listing.id}`}
                  value={listing.status}
                  onChange={(event) => {
                    const next = event.target.value as ListingStatus;
                    if (OWNER_EDITABLE_STATUSES.includes(next)) {
                      void handleStatusChange(listing, next);
                    }
                  }}
                >
                  {OWNER_EDITABLE_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {STATUS_LABELS[status]}
                    </option>
                  ))}
                </select>

                <Link to={editListingPath(listing.id)}>
                  <Button variant="secondary">Edit</Button>
                </Link>
                <Button variant="danger" onPress={() => setDeleteTarget(listing)}>
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      ) : null}

      {deleteTarget ? (
        <DeleteListingDialog
          isOpen
          listing={deleteTarget}
          onDeleted={() => {
            setDeleteTarget(null);
            void reload();
          }}
          onOpenChange={(open) => {
            if (!open) {
              setDeleteTarget(null);
            }
          }}
        />
      ) : null}
    </div>
  );
}
