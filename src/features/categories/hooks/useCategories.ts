import { useCallback, useEffect, useState } from "react";
import { categoryService } from "@/features/categories/services/categoryService";
import type { Category } from "@/features/categories/types/category.interfaces";
import { getErrorMessage } from "@/utils/error.utils";

export function useCategories() {
  const [categories, setCategories] = useState<readonly Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const next = await categoryService.getActiveCategories();
      setCategories(next);
    } catch (cause) {
      setError(getErrorMessage(cause, "Could not load categories."));
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return {
    categories,
    isLoading,
    error,
    reload: load,
  };
}
