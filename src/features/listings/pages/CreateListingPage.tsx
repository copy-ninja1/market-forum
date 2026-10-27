import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/PageHeader";
import { listingDetailsPath } from "@/constants/route.constants";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { ListingForm } from "@/features/listings/components/ListingForm";
import type { ListingFormSchema } from "@/features/listings/schemas/listingSchemas";
import { listingImageService } from "@/features/listings/services/listingImageService";
import { listingService } from "@/features/listings/services/listingService";
import { getErrorMessage } from "@/utils/error.utils";

export function CreateListingPage() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { categories, isLoading: isCategoriesLoading } = useCategories();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: ListingFormSchema, newImageFiles: readonly File[]) => {
    if (!user) {
      throw new Error("Please sign in to create a listing.");
    }

    setIsSubmitting(true);
    try {
      const ownerDisplayName =
        profile?.displayName ?? user.displayName?.trim() ?? user.email?.split("@")[0] ?? "Student";

      const listing = await listingService.createListing(user.uid, ownerDisplayName, values);

      if (newImageFiles.length > 0) {
        const uploaded = await listingImageService.uploadListingImages(
          user.uid,
          listing.id,
          newImageFiles,
        );
        await listingService.updateListing(listing.id, {
          images: [...listing.images, ...uploaded],
        });
      }

      navigate(listingDetailsPath(listing.id));
    } catch (error) {
      throw new Error(getErrorMessage(error, "Could not create listing."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        description="Share what you are selling with clear photos, price, and contact details."
        title="Post a listing"
      />
      <ListingForm
        categories={categories}
        isCategoriesLoading={isCategoriesLoading}
        isSubmitting={isSubmitting}
        mode="create"
        onSubmit={handleSubmit}
      />
    </div>
  );
}
