import { useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { Button } from "@heroui/react";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { PageHeader } from "@/components/ui/PageHeader";
import { listingDetailsPath, ROUTES } from "@/constants/route.constants";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { ListingForm } from "@/features/listings/components/ListingForm";
import { useListing } from "@/features/listings/hooks/useListing";
import type { ListingFormSchema } from "@/features/listings/schemas/listingSchemas";
import type { ListingFormImageSubmission } from "@/features/listings/types/listing.interfaces";
import { listingImageService } from "@/features/listings/services/listingImageService";
import { listingService } from "@/features/listings/services/listingService";
import { DocumentHead, editListingPageSeo, useSiteSeoConfig } from "@/seo";
import { getErrorMessage } from "@/utils/error.utils";
import { listingImageCountError } from "@/utils/image.utils";

export function EditListingPage() {
  const { listingId } = useParams<{ listingId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { appName, siteUrl } = useSiteSeoConfig();
  const { listing, isLoading, error, notFound, reload } = useListing(listingId);
  const { categories, isLoading: isCategoriesLoading } = useCategories();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const seo = editListingPageSeo(siteUrl, appName, listingId ?? "unknown");

  if (isLoading) {
    return (
      <>
        <DocumentHead seo={seo} />
        <LoadingState message="Loading listing…" />
      </>
    );
  }

  if (error) {
    return (
      <>
        <DocumentHead seo={seo} />
        <ErrorState message={error} onRetry={() => void reload()} />
      </>
    );
  }

  if (notFound || !listing) {
    return (
      <>
        <DocumentHead seo={seo} />
        <EmptyState
          action={
            <Link to={ROUTES.myListings}>
              <Button variant="primary">My listings</Button>
            </Link>
          }
          title="Listing not found"
        />
      </>
    );
  }

  if (!user) {
    return <Navigate replace to={ROUTES.signIn} state={{ from: listingDetailsPath(listing.id) }} />;
  }

  if (user.uid !== listing.ownerUid) {
    return <Navigate replace to={listingDetailsPath(listing.id)} />;
  }

  const handleSubmit = async (values: ListingFormSchema, images: ListingFormImageSubmission) => {
    setIsSubmitting(true);
    try {
      const uploaded =
        images.newFiles.length > 0
          ? await listingImageService.uploadListingImages(user.uid, listing.id, images.newFiles)
          : [];
      const nextImages = [...images.retainedImages, ...uploaded];
      const imageError = listingImageCountError(nextImages.length);
      if (imageError) {
        throw new Error(imageError);
      }

      await listingService.updateListing(listing.id, {
        ...values,
        images: nextImages,
      });

      const retainedPaths = new Set(images.retainedImages.map((image) => image.storagePath));
      const removedPaths = listing.images
        .filter((image) => !retainedPaths.has(image.storagePath))
        .map((image) => image.storagePath);
      if (removedPaths.length > 0) {
        await listingImageService.deleteImagesByPaths(removedPaths);
      }

      navigate(listingDetailsPath(listing.id));
    } catch (cause) {
      throw new Error(getErrorMessage(cause, "Could not update listing."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <DocumentHead seo={seo} />
      <PageHeader
        description="Update details, photos, or the contact method buyers will see."
        eyebrow="Your listing"
        title="Edit listing"
      />
      <div className="panel p-5 md:p-8">
        <ListingForm
          categories={categories}
          existingImages={listing.images}
          initialValues={listing}
          isCategoriesLoading={isCategoriesLoading}
          isSubmitting={isSubmitting}
          mode="edit"
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
