import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  startAfter,
  updateDoc,
  where,
  type QueryConstraint,
} from "firebase/firestore";
import type {
  CreateListingInput,
  Listing,
  ListingQueryOptions,
  ListingRepositoryContract,
  UpdateListingInput,
} from "@/features/listings/types/listing.interfaces";
import type { ListingAvailabilityFilter, ListingSortOption, ListingStatus } from "@/features/listings/types/listing.types";
import { COLLECTIONS, getFirebaseFirestore } from "@/lib/firebase/firebaseFirestore";
import { buildSearchKeywords, normalizeSearchTerm } from "@/utils/search.utils";
import {
  mapListingFromFirestore,
  mapListingImagesToFirestore,
  type ListingFirestoreRecord,
} from "./listingMapper";

const PUBLIC_STATUS_VALUES: readonly ListingStatus[] = ["active", "sold", "unavailable"];

function resolvePublicStatusFilter(availability: ListingAvailabilityFilter | undefined): ListingStatus | "public-non-hidden" {
  if (!availability || availability === "active") {
    return "active";
  }
  if (availability === "sold" || availability === "unavailable") {
    return availability;
  }
  return "public-non-hidden";
}

function sortConstraints(sort: ListingSortOption | undefined): QueryConstraint[] {
  switch (sort) {
    case "price-ascending":
      return [orderBy("price", "asc"), orderBy("createdAt", "desc")];
    case "price-descending":
      return [orderBy("price", "desc"), orderBy("createdAt", "desc")];
    case "newest":
    default:
      return [orderBy("createdAt", "desc")];
  }
}

function searchToken(searchTerm: string | undefined): string | null {
  if (!searchTerm?.trim()) {
    return null;
  }
  const normalized = normalizeSearchTerm(searchTerm);
  const firstToken = normalized.split(" ").find(Boolean);
  return firstToken ?? null;
}

class ListingRepository implements ListingRepositoryContract {
  private collectionRef() {
    return collection(getFirebaseFirestore(), COLLECTIONS.listings);
  }

  async getById(id: string): Promise<Listing | null> {
    const snapshot = await getDoc(doc(this.collectionRef(), id));
    if (!snapshot.exists()) {
      return null;
    }
    return mapListingFromFirestore(snapshot.id, snapshot.data());
  }

  async getByOwner(ownerUid: string): Promise<readonly Listing[]> {
    const listingsQuery = query(
      this.collectionRef(),
      where("ownerUid", "==", ownerUid),
      orderBy("createdAt", "desc"),
    );
    const snapshot = await getDocs(listingsQuery);
    return snapshot.docs.map((document) =>
      mapListingFromFirestore(document.id, document.data()),
    );
  }

  async getPublicListings(options: ListingQueryOptions): Promise<{
    readonly items: readonly Listing[];
    readonly nextCursor: string | null;
    readonly hasMore: boolean;
  }> {
    const { filters, pageSize, cursor } = options;
    const constraints: QueryConstraint[] = [];
    const token = searchToken(filters.searchTerm);

    if (token) {
      constraints.push(where("searchKeywords", "array-contains", token));
    }

    if (filters.categoryId) {
      constraints.push(where("categoryId", "==", filters.categoryId));
    }

    const statusFilter = resolvePublicStatusFilter(filters.availability);
    if (statusFilter === "public-non-hidden") {
      constraints.push(where("status", "in", [...PUBLIC_STATUS_VALUES]));
    } else {
      constraints.push(where("status", "==", statusFilter));
    }

    constraints.push(...sortConstraints(filters.sort));
    constraints.push(limit(pageSize + 1));

    if (cursor) {
      const cursorSnapshot = await getDoc(doc(this.collectionRef(), cursor));
      if (cursorSnapshot.exists()) {
        constraints.push(startAfter(cursorSnapshot));
      }
    }

    const snapshot = await getDocs(query(this.collectionRef(), ...constraints));
    const hasMore = snapshot.docs.length > pageSize;
    const pageDocs = hasMore ? snapshot.docs.slice(0, pageSize) : snapshot.docs;
    const items = pageDocs.map((document) =>
      mapListingFromFirestore(document.id, document.data()),
    );
    const lastItem = items.at(-1);

    return {
      items,
      nextCursor: hasMore && lastItem ? lastItem.id : null,
      hasMore,
    };
  }

  async create(
    ownerUid: string,
    ownerDisplayName: string,
    categoryName: string,
    input: CreateListingInput,
  ): Promise<Listing> {
    const listingRef = doc(this.collectionRef());
    const searchKeywords = buildSearchKeywords(input.title, input.description);

    const payload: Omit<ListingFirestoreRecord, "createdAt" | "updatedAt"> & {
      createdAt: ReturnType<typeof serverTimestamp>;
      updatedAt: ReturnType<typeof serverTimestamp>;
    } = {
      ownerUid,
      ownerDisplayName,
      title: input.title,
      description: input.description,
      categoryId: input.categoryId,
      categoryName,
      price: input.price,
      currencyCode: input.currencyCode,
      condition: input.condition,
      locationLabel: input.locationLabel,
      images: [],
      contactType: input.contactType,
      contactValue: input.contactValue,
      status: "active",
      searchKeywords,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(listingRef, payload);
    const created = await getDoc(listingRef);
    if (!created.exists()) {
      throw new Error("Failed to load listing after create.");
    }
    return mapListingFromFirestore(created.id, created.data());
  }

  async update(id: string, input: UpdateListingInput, categoryName?: string): Promise<Listing> {
    const existingRef = doc(this.collectionRef(), id);
    const existingSnapshot = await getDoc(existingRef);
    if (!existingSnapshot.exists()) {
      throw new Error("Listing not found.");
    }

    const existing = mapListingFromFirestore(existingSnapshot.id, existingSnapshot.data());
    const nextTitle = input.title ?? existing.title;
    const nextDescription = input.description ?? existing.description;

    const patch: Record<string, unknown> = {
      updatedAt: serverTimestamp(),
    };

    if (input.title !== undefined) {
      patch.title = input.title;
    }
    if (input.description !== undefined) {
      patch.description = input.description;
    }
    if (input.categoryId !== undefined) {
      patch.categoryId = input.categoryId;
    }
    if (categoryName !== undefined) {
      patch.categoryName = categoryName;
    }
    if (input.price !== undefined) {
      patch.price = input.price;
    }
    if (input.currencyCode !== undefined) {
      patch.currencyCode = input.currencyCode;
    }
    if (input.condition !== undefined) {
      patch.condition = input.condition;
    }
    if (input.locationLabel !== undefined) {
      patch.locationLabel = input.locationLabel;
    }
    if (input.contactType !== undefined) {
      patch.contactType = input.contactType;
    }
    if (input.contactValue !== undefined) {
      patch.contactValue = input.contactValue;
    }
    if (input.status !== undefined) {
      patch.status = input.status;
    }
    if (input.images !== undefined) {
      patch.images = mapListingImagesToFirestore(input.images);
    }

    if (input.title !== undefined || input.description !== undefined) {
      patch.searchKeywords = buildSearchKeywords(nextTitle, nextDescription);
    }

    await updateDoc(existingRef, patch);
    const updated = await getDoc(existingRef);
    if (!updated.exists()) {
      throw new Error("Failed to load listing after update.");
    }
    return mapListingFromFirestore(updated.id, updated.data());
  }

  async updateStatus(id: string, status: ListingStatus): Promise<void> {
    const listingRef = doc(this.collectionRef(), id);
    await updateDoc(listingRef, {
      status,
      updatedAt: serverTimestamp(),
    });
  }

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(this.collectionRef(), id));
  }
}

export const listingRepository = new ListingRepository();
