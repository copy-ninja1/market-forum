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

export interface ListingQueryOptions {
  readonly filters: ListingFilters;
  readonly pageSize: number;
  readonly cursor?: string | null;
}

export interface ListingRepositoryContract {
  getById(id: string): Promise<Listing | null>;
  getByOwner(ownerUid: string): Promise<readonly Listing[]>;
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
