import { useState } from "react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { listingService } from "@/features/listings/services/listingService";
import type { DeleteListingDialogProps } from "@/features/listings/types/listing.interfaces";
import { getErrorMessage } from "@/utils/error.utils";

export function DeleteListingDialog({
  listing,
  isOpen,
  onOpenChange,
  onDeleted,
}: DeleteListingDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleConfirm = async () => {
    setIsDeleting(true);
    setErrorMessage(null);
    try {
      await listingService.deleteListing(listing.id);
      onOpenChange(false);
      onDeleted();
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Could not delete listing."));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {errorMessage ? (
        <p className="sr-only" role="status">
          {errorMessage}
        </p>
      ) : null}
      <ConfirmDialog
        cancelLabel="Keep listing"
        confirmLabel="Delete listing"
        description={`"${listing.title}" will be removed permanently along with its photos.`}
        isConfirmLoading={isDeleting}
        isDestructive
        isOpen={isOpen}
        title="Delete this listing?"
        onConfirm={() => {
          void handleConfirm();
        }}
        onOpenChange={onOpenChange}
      />
    </>
  );
}
