import { listingFormSchema, listingUpdateSchema } from "@/features/listings/schemas/listingSchemas";
import { listingRepository } from "@/features/listings/repositories/listingRepository";
import { categoryRepository } from "@/features/categories/repositories/categoryRepository";
import type {
  CreateListingInput,
  Listing,
  ListingQueryOptions,
  UpdateListingInput,
} from "@/features/listings/types/listing.interfaces";
import type { ListingStatus } from "@/features/listings/types/listing.types";
import type { CursorPage } from "@/types/pagination.types";
import { deleteImagesByPaths } from "@/features/listings/services/listingImageService";

async function resolveCategoryName(categoryId: string): Promise<string> {
  const category = await categoryRepository.getById(categoryId);
  if (!category) {
    throw new Error("Selected category was not found.");
  }
  if (!category.isActive) {
    throw new Error("Selected category is not available.");
  }
  return category.name;
}

function toCreateListingInput(
  parsed: ReturnType<typeof listingFormSchema.parse>,
): CreateListingInput {
  return {
    title: parsed.title,
    description: parsed.description,
    categoryId: parsed.categoryId,
    price: parsed.price,
    currencyCode: parsed.currencyCode,
    condition: parsed.condition,
    locationLabel: parsed.locationLabel,
    contactType: parsed.contactType,
    contactValue: parsed.contactValue,
  };
}

export async function createListing(
  ownerUid: string,
  ownerDisplayName: string,
  input: unknown,
): Promise<Listing> {
  const parsed = listingFormSchema.parse(input);
  const categoryName = await resolveCategoryName(parsed.categoryId);
  return listingRepository.create(
    ownerUid,
    ownerDisplayName,
    categoryName,
    toCreateListingInput(parsed),
  );
}

export async function updateListing(
  listingId: string,
  input: unknown,
): Promise<Listing> {
  const parsed = listingUpdateSchema.parse(input);
  const updateInput: UpdateListingInput = {
    ...(parsed.title !== undefined ? { title: parsed.title } : {}),
    ...(parsed.description !== undefined ? { description: parsed.description } : {}),
    ...(parsed.categoryId !== undefined ? { categoryId: parsed.categoryId } : {}),
    ...(parsed.price !== undefined ? { price: parsed.price } : {}),
    ...(parsed.currencyCode !== undefined ? { currencyCode: parsed.currencyCode } : {}),
    ...(parsed.condition !== undefined ? { condition: parsed.condition } : {}),
    ...(parsed.locationLabel !== undefined ? { locationLabel: parsed.locationLabel } : {}),
    ...(parsed.contactType !== undefined ? { contactType: parsed.contactType } : {}),
    ...(parsed.contactValue !== undefined ? { contactValue: parsed.contactValue } : {}),
    ...(parsed.status !== undefined ? { status: parsed.status } : {}),
    ...(parsed.images !== undefined ? { images: parsed.images } : {}),
  };

  let categoryName: string | undefined;
  if (parsed.categoryId !== undefined) {
    categoryName = await resolveCategoryName(parsed.categoryId);
  }

  return listingRepository.update(listingId, updateInput, categoryName);
}

export async function updateListingStatus(
  listingId: string,
  status: ListingStatus,
): Promise<void> {
  await listingRepository.updateStatus(listingId, status);
}

export async function deleteListing(listingId: string): Promise<void> {
  const listing = await listingRepository.getById(listingId);
  if (!listing) {
    throw new Error("Listing not found.");
  }

  const storagePaths = listing.images.map((image) => image.storagePath);
  await deleteImagesByPaths(storagePaths);
  await listingRepository.delete(listingId);
}

export async function getListing(listingId: string): Promise<Listing | null> {
  return listingRepository.getById(listingId);
}

export async function listPublic(
  options: ListingQueryOptions,
): Promise<CursorPage<Listing>> {
  return listingRepository.getPublicListings(options);
}

export async function listMine(ownerUid: string): Promise<readonly Listing[]> {
  return listingRepository.getByOwner(ownerUid);
}

export async function listActiveByOwner(ownerUid: string): Promise<readonly Listing[]> {
  return listingRepository.getActiveByOwner(ownerUid);
}

export const listingService = {
  createListing,
  updateListing,
  updateListingStatus,
  deleteListing,
  getListing,
  listPublic,
  listMine,
  listActiveByOwner,
};
