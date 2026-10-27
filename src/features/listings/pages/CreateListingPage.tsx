import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/PageHeader";
import { MIN_LISTING_IMAGES } from "@/constants/app.constants";
import { listingDetailsPath } from "@/constants/route.constants";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { ListingDraftPreview } from "@/features/listings/components/ListingDraftPreview";
import { ListingForm } from "@/features/listings/components/ListingForm";
import type { ListingFormSchema } from "@/features/listings/schemas/listingSchemas";
import { listingImageService } from "@/features/listings/services/listingImageService";
import { listingService } from "@/features/listings/services/listingService";
import type {
  ListingDraft,
  ListingFormImageSubmission,
} from "@/features/listings/types/listing.interfaces";
import { createListingPageSeo, DocumentHead, useSiteSeoConfig } from "@/seo";
import { getErrorMessage } from "@/utils/error.utils";
import { listingImageCountError } from "@/utils/image.utils";

const EMPTY_DRAFT: ListingDraft = {
  title: "",
  description: "",
  price: Number.NaN,
  categoryName: "",
  condition: "good",
  locationLabel: "",
  photoUrls: [],
};

export function CreateListingPage() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { appName, siteUrl } = useSiteSeoConfig();
  const { categories, isLoading: isCategoriesLoading } = useCategories();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [draft, setDraft] = useState<ListingDraft>(EMPTY_DRAFT);
  const handleDraftChange = useCallback((next: ListingDraft) => {
    setDraft(next);
  }, []);

  const handleSubmit = async (values: ListingFormSchema, images: ListingFormImageSubmission) => {
    if (!user) {
      throw new Error("Please sign in to create a listing.");
    }

    const imageError = listingImageCountError(images.newFiles.length);
    if (imageError || images.newFiles.length < MIN_LISTING_IMAGES) {
      throw new Error(imageError ?? "Add at least one photo.");
    }

    setIsSubmitting(true);
    let createdListingId: string | null = null;
    try {
      const ownerDisplayName =
        profile?.displayName ?? user.displayName?.trim() ?? user.email?.split("@")[0] ?? "Student";

      const listing = await listingService.createListing(user.uid, ownerDisplayName, values);
      createdListingId = listing.id;

      const uploaded = await listingImageService.uploadListingImages(
        user.uid,
        listing.id,
        images.newFiles,
      );
      await listingService.updateListing(listing.id, {
        images: uploaded,
      });

      navigate(listingDetailsPath(listing.id));
    } catch (error) {
      if (createdListingId) {
        try {
          await listingService.deleteListing(createdListingId);
        } catch {
          throw new Error(
            `${getErrorMessage(error, "Could not create listing.")} The unfinished listing is still in My listings.`,
          );
        }
      }
      throw new Error(getErrorMessage(error, "Could not create listing."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <DocumentHead seo={createListingPageSeo(siteUrl, appName)} />
      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,42rem)_minmax(16rem,20rem)]">
        <div>
          <PageHeader
            description="Name the item, set a naira price, and add one or two photos. Buyers contact you directly."
            title="Post a listing"
          />
          <div className="panel p-5 md:p-8">
            <ListingForm
              categories={categories}
              isCategoriesLoading={isCategoriesLoading}
              isSubmitting={isSubmitting}
              mode="create"
              onDraftChange={handleDraftChange}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
        <ListingDraftPreview draft={draft} />
      </div>
    </>
  );
}
