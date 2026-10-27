import { categoryRepository } from "@/features/categories/repositories/categoryRepository";
import type {
  Category,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@/features/categories/types/category.interfaces";

export async function getActiveCategories(): Promise<readonly Category[]> {
  return categoryRepository.getActiveCategories();
}

export async function getCategoryById(categoryId: string): Promise<Category | null> {
  return categoryRepository.getById(categoryId);
}

export async function listAllCategories(): Promise<readonly Category[]> {
  return categoryRepository.listAll();
}

export async function createCategory(input: CreateCategoryInput): Promise<Category> {
  if (!input.name.trim()) {
    throw new Error("Category name is required.");
  }
  if (!input.slug.trim()) {
    throw new Error("Category slug is required.");
  }
  return categoryRepository.create(input);
}

export async function updateCategory(
  categoryId: string,
  input: UpdateCategoryInput,
): Promise<Category> {
  return categoryRepository.update(categoryId, input);
}

export const categoryService = {
  getActiveCategories,
  getCategoryById,
  listAllCategories,
  createCategory,
  updateCategory,
};
