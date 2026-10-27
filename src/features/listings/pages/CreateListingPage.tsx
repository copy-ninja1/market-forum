import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/PageHeader";
import { MARKET_IMAGES } from "@/constants/marketing.constants";
import { listingDetailsPath } from "@/constants/route.constants";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { ListingForm } from "@/features/listings/components/ListingForm";
import type { ListingFormSchema } from "@/features/listings/schemas/listingSchemas";
import { listingImageService } from "@/features/listings/services/listingImageService";
import { listingService } from "@/features/listings/services/listingService";
import { createListingPageSeo, DocumentHead, useSiteSeoConfig } from "@/seo";
import { getErrorMessage } from "@/utils/error.utils";

export function CreateListingPage() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { appName, siteUrl } = useSiteSeoConfig();
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
    <div className="space-y-8">
      <DocumentHead seo={createListingPageSeo(siteUrl, appName)} />
      <PageHeader
        description="Share a clear title, price, photo, and the contact method you want buyers to use."
        eyebrow="New listing"
        title="Post a listing"
      />
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="panel p-5 md:p-8">
          <ListingForm
            categories={categories}
            isCategoriesLoading={isCategoriesLoading}
            isSubmitting={isSubmitting}
            mode="create"
            onSubmit={handleSubmit}
          />
        </div>
        <aside className="space-y-4 lg:sticky lg:top-28">
          <img
            alt="A stack of books on a desk"
            className="aspect-[4/3] w-full rounded-3xl object-cover"
            height={420}
            src={MARKET_IMAGES.books}
            width={560}
          />
          <div className="panel p-5 text-sm leading-relaxed text-campus-ink/75">
            <p className="font-display text-2xl text-campus-ink">What buyers look for</p>
            <ul className="mt-3 list-disc space-y-2 pl-4">
              <li>A title that names the item, not a slogan.</li>
              <li>The real condition and a campus meeting spot.</li>
              <li>A contact method you are comfortable publishing.</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
