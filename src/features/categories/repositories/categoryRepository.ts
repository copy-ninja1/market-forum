import {
  Timestamp,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import type {
  Category,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@/features/categories/types/category.interfaces";
import { COLLECTIONS, getFirebaseFirestore } from "@/lib/firebase/firebaseFirestore";

type CategoryFirestoreRecord = {
  readonly name: string;
  readonly slug: string;
  readonly description: string;
  readonly isActive: boolean;
  readonly sortOrder: number;
  readonly createdAt: Timestamp;
  readonly updatedAt: Timestamp;
};

function toDate(value: unknown, field: string): Date {
  if (value instanceof Timestamp) {
    return value.toDate();
  }
  if (value instanceof Date) {
    return value;
  }
  throw new Error(`Category field "${field}" is not a valid timestamp.`);
}

function mapCategoryFromFirestore(id: string, data: unknown): Category {
  if (typeof data !== "object" || data === null) {
    throw new Error("Category document data is invalid.");
  }

  const record = data as Record<string, unknown>;
  if (typeof record.name !== "string") {
    throw new Error("Category is missing name.");
  }
  if (typeof record.slug !== "string") {
    throw new Error("Category is missing slug.");
  }
  if (typeof record.description !== "string") {
    throw new Error("Category is missing description.");
  }
  if (typeof record.isActive !== "boolean") {
    throw new Error("Category is missing isActive.");
  }
  if (typeof record.sortOrder !== "number") {
    throw new Error("Category is missing sortOrder.");
  }

  return {
    id,
    name: record.name,
    slug: record.slug,
    description: record.description,
    isActive: record.isActive,
    sortOrder: record.sortOrder,
    createdAt: toDate(record.createdAt, "createdAt"),
    updatedAt: toDate(record.updatedAt, "updatedAt"),
  };
}

class CategoryRepository {
  private collectionRef() {
    return collection(getFirebaseFirestore(), COLLECTIONS.categories);
  }

  async getActiveCategories(): Promise<readonly Category[]> {
    // Categories are a small admin-managed set. Order server-side and
    // filter active client-side so browse works without a composite index.
    const categoriesQuery = query(this.collectionRef(), orderBy("sortOrder", "asc"));
    const snapshot = await getDocs(categoriesQuery);
    return snapshot.docs
      .map((document) => mapCategoryFromFirestore(document.id, document.data()))
      .filter((category) => category.isActive);
  }

  async getById(id: string): Promise<Category | null> {
    const snapshot = await getDoc(doc(this.collectionRef(), id));
    if (!snapshot.exists()) {
      return null;
    }
    return mapCategoryFromFirestore(snapshot.id, snapshot.data());
  }

  async listAll(): Promise<readonly Category[]> {
    const categoriesQuery = query(this.collectionRef(), orderBy("sortOrder", "asc"));
    const snapshot = await getDocs(categoriesQuery);
    return snapshot.docs.map((document) =>
      mapCategoryFromFirestore(document.id, document.data()),
    );
  }

  async create(input: CreateCategoryInput): Promise<Category> {
    const categoryRef = doc(this.collectionRef());
    const payload: Omit<CategoryFirestoreRecord, "createdAt" | "updatedAt"> & {
      createdAt: ReturnType<typeof serverTimestamp>;
      updatedAt: ReturnType<typeof serverTimestamp>;
    } = {
      name: input.name,
      slug: input.slug,
      description: input.description,
      sortOrder: input.sortOrder,
      isActive: input.isActive ?? true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(categoryRef, payload);
    const created = await getDoc(categoryRef);
    if (!created.exists()) {
      throw new Error("Failed to load category after create.");
    }
    return mapCategoryFromFirestore(created.id, created.data());
  }

  async update(id: string, input: UpdateCategoryInput): Promise<Category> {
    const categoryRef = doc(this.collectionRef(), id);
    const existing = await getDoc(categoryRef);
    if (!existing.exists()) {
      throw new Error("Category not found.");
    }

    const patch: Record<string, unknown> = {
      updatedAt: serverTimestamp(),
    };

    if (input.name !== undefined) {
      patch.name = input.name;
    }
    if (input.slug !== undefined) {
      patch.slug = input.slug;
    }
    if (input.description !== undefined) {
      patch.description = input.description;
    }
    if (input.sortOrder !== undefined) {
      patch.sortOrder = input.sortOrder;
    }
    if (input.isActive !== undefined) {
      patch.isActive = input.isActive;
    }

    await updateDoc(categoryRef, patch);
    const updated = await getDoc(categoryRef);
    if (!updated.exists()) {
      throw new Error("Failed to load category after update.");
    }
    return mapCategoryFromFirestore(updated.id, updated.data());
  }
}

export const categoryRepository = new CategoryRepository();
