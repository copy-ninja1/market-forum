import type { ReactNode } from "react";
import type {
  ContactType,
  ListingAvailabilityFilter,
  ListingCondition,
  ListingSortOption,
  ListingStatus,
} from "./listing.types";

export interface ListingImage {
  readonly url: string;
  readonly storagePath: string;
  readonly altText: string;
}

export interface Listing {
  readonly id: string;
  readonly ownerUid: string;
  readonly ownerDisplayName: string;
  readonly title: string;
  readonly description: string;
  readonly categoryId: string;
  readonly categoryName: string;
  readonly price: number;
  readonly currencyCode: string;
  readonly condition: ListingCondition;
  readonly locationLabel: string;
  readonly images: readonly ListingImage[];
  readonly contactType: ContactType;
  readonly contactValue: string;
  readonly status: ListingStatus;
  readonly searchKeywords: readonly string[];
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface CreateListingInput {
  readonly title: string;
  readonly description: string;
  readonly categoryId: string;
  readonly price: number;
  readonly currencyCode: string;
  readonly condition: ListingCondition;
  readonly locationLabel: string;
  readonly contactType: ContactType;
  readonly contactValue: string;
}

export interface UpdateListingInput {
  readonly title?: string;
  readonly description?: string;
  readonly categoryId?: string;
  readonly price?: number;
  readonly currencyCode?: string;
  readonly condition?: ListingCondition;
  readonly locationLabel?: string;
  readonly contactType?: ContactType;
  readonly contactValue?: string;
  readonly status?: ListingStatus;
  readonly images?: readonly ListingImage[];
}

export interface ListingFilters {
  readonly searchTerm?: string;
  readonly categoryId?: string;
  readonly availability?: ListingAvailabilityFilter;
  readonly sort?: ListingSortOption;
}

export interface ListingCardProps {
  readonly listing: Listing;
}

export interface ListingGridProps {
  readonly listings: readonly Listing[];
  readonly isLoading?: boolean;
  readonly emptyTitle?: string;
  readonly emptyDescription?: string;
  readonly emptyAction?: ReactNode;
}

export interface ListingCatalogProps extends ListingGridProps {
  readonly showSeller?: boolean;
}

export interface ListingFiltersProps {
  readonly categoryId: string;
  readonly availability: ListingAvailabilityFilter;
  readonly sort: ListingSortOption;
  readonly categories: readonly { id: string; name: string }[];
  readonly isCategoriesLoading?: boolean;
  readonly layout?: "grid" | "stack";
  readonly onCategoryChange: (categoryId: string) => void;
  readonly onAvailabilityChange: (availability: ListingAvailabilityFilter) => void;
  readonly onSortChange: (sort: ListingSortOption) => void;
}

export interface ListingSearchProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly placeholder?: string;
}

export type ListingFormMode = "create" | "edit";

export type ListingFormImageSubmission = {
  readonly newFiles: readonly File[];
  readonly retainedImages: readonly ListingImage[];
};

export type ListingDraft = {
  readonly title: string;
  readonly description: string;
  readonly price: number;
  readonly categoryName: string;
  readonly condition: ListingCondition;
  readonly locationLabel: string;
  readonly photoUrls: readonly string[];
};

export interface ListingFormProps {
  readonly mode: ListingFormMode;
  readonly categories: readonly { id: string; name: string }[];
  readonly isCategoriesLoading?: boolean;
  readonly initialValues?: Partial<
    Pick<
      Listing,
      | "title"
      | "description"
      | "categoryId"
      | "price"
      | "currencyCode"
      | "condition"
      | "locationLabel"
      | "contactType"
      | "contactValue"
      | "status"
    >
  >;
  readonly existingImages?: readonly ListingImage[];
  readonly isSubmitting: boolean;
  readonly submitLabel?: string;
  readonly onDraftChange?: (draft: ListingDraft) => void;
  readonly onSubmit: (
    values: import("@/features/listings/schemas/listingSchemas").ListingFormSchema,
    images: ListingFormImageSubmission,
  ) => Promise<void>;
}

export interface ListingImageGalleryProps {
  readonly images: readonly ListingImage[];
  readonly title: string;
}

export interface ListingStatusBadgeProps {
  readonly status: ListingStatus;
  readonly className?: string;
}

export interface DeleteListingDialogProps {
  readonly listing: Listing;
  readonly isOpen: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onDeleted: () => void;
}

export interface ListingQueryOptions {
  readonly filters: ListingFilters;
  readonly pageSize: number;
  readonly cursor?: string | null;
}

export interface ListingRepositoryContract {
  getById(id: string): Promise<Listing | null>;
  getByOwner(ownerUid: string): Promise<readonly Listing[]>;
  getActiveByOwner(ownerUid: string): Promise<readonly Listing[]>;
  getPublicListings(options: ListingQueryOptions): Promise<{
    readonly items: readonly Listing[];
    readonly nextCursor: string | null;
    readonly hasMore: boolean;
  }>;
  create(
    ownerUid: string,
    ownerDisplayName: string,
    categoryName: string,
    input: CreateListingInput,
  ): Promise<Listing>;
  update(id: string, input: UpdateListingInput, categoryName?: string): Promise<Listing>;
  updateStatus(id: string, status: ListingStatus): Promise<void>;
  delete(id: string): Promise<void>;
}
