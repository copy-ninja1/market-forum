import { Button, Input, Label, TextArea, TextField } from "@heroui/react";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { FormError } from "@/components/feedback/FormError";
import { SuccessMessage } from "@/components/feedback/SuccessMessage";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { PageHeader } from "@/components/ui/PageHeader";
import { categoryService } from "@/features/categories/services/categoryService";
import type { Category } from "@/features/categories/types/category.interfaces";
import { getErrorMessage } from "@/utils/error.utils";

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function AdminCategoriesPage() {
  const [categories, setCategories] = useState<readonly Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [sortOrder, setSortOrder] = useState("0");
  const [isActive, setIsActive] = useState(true);
  const [slugTouched, setSlugTouched] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const next = await categoryService.listAllCategories();
      setCategories(next);
    } catch (cause) {
      setLoadError(getErrorMessage(cause, "Could not load categories."));
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleNameChange = (value: string) => {
    setName(value);
    if (!slugTouched) {
      setSlug(slugify(value));
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    setFormSuccess(false);

    const parsedSort = Number.parseInt(sortOrder, 10);
    if (Number.isNaN(parsedSort)) {
      setFormError("Sort order must be a number.");
      return;
    }

    setIsSaving(true);
    try {
      await categoryService.createCategory({
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim(),
        sortOrder: parsedSort,
        isActive,
      });
      setFormSuccess(true);
      setName("");
      setSlug("");
      setDescription("");
      setSortOrder("0");
      setIsActive(true);
      setSlugTouched(false);
      await load();
    } catch (cause) {
      setFormError(getErrorMessage(cause, "Could not create category."));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <LoadingState message="Loading categories…" />;
  }

  if (loadError) {
    return <ErrorState message={loadError} onRetry={() => void load()} />;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        description="Manage browse filters and listing categories for the campus marketplace."
        title="Categories"
      />

      <section className="rounded-xl border border-campus-mist bg-campus-paper/80 p-4 md:p-6">
        <h2 className="font-display text-lg text-campus-ink">Create category</h2>
        <form className="mt-4 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit} noValidate>
          {formSuccess ? (
            <div className="md:col-span-2">
              <SuccessMessage message="Category is now available for listings." title="Created" />
            </div>
          ) : null}
          {formError ? (
            <div className="md:col-span-2">
              <FormError message={formError} />
            </div>
          ) : null}

          <TextField fullWidth isRequired>
            <Label>Name</Label>
            <Input value={name} onChange={(event) => handleNameChange(event.target.value)} />
          </TextField>

          <TextField fullWidth isRequired>
            <Label>Slug</Label>
            <Input
              value={slug}
              onChange={(event) => {
                setSlugTouched(true);
                setSlug(event.target.value);
              }}
            />
          </TextField>

          <TextField fullWidth className="md:col-span-2">
            <Label>Description</Label>
            <TextArea value={description} onChange={(event) => setDescription(event.target.value)} />
          </TextField>

          <TextField fullWidth isRequired>
            <Label>Sort order</Label>
            <Input
              inputMode="numeric"
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value)}
            />
          </TextField>

          <label className="flex items-center gap-2 pt-6 text-sm text-campus-ink">
            <input
              checked={isActive}
              className="size-4 rounded border-campus-mist accent-campus-leaf"
              type="checkbox"
              onChange={(event) => setIsActive(event.target.checked)}
            />
            Active
          </label>

          <div className="md:col-span-2">
            <Button isDisabled={isSaving} type="submit" variant="primary">
              {isSaving ? "Saving…" : "Add category"}
            </Button>
          </div>
        </form>
      </section>

      <section>
        <h2 className="font-display text-lg text-campus-ink">All categories</h2>
        {categories.length === 0 ? (
          <EmptyState
            className="mt-4"
            description="Run the seed script or create categories above."
            title="No categories yet"
          />
        ) : (
          <ul className="mt-4 divide-y divide-campus-mist rounded-xl border border-campus-mist bg-campus-paper/80">
            {categories.map((category) => (
              <li
                key={category.id}
                className="flex flex-col gap-1 px-4 py-3 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="font-medium text-campus-ink">{category.name}</p>
                  <p className="text-sm text-campus-ink/70">
                    {category.slug} · order {category.sortOrder}
                  </p>
                  {category.description ? (
                    <p className="text-sm text-campus-ink/60">{category.description}</p>
                  ) : null}
                </div>
                <span
                  className={
                    category.isActive
                      ? "text-xs font-semibold uppercase tracking-wide text-campus-leaf"
                      : "text-xs font-semibold uppercase tracking-wide text-campus-ink/50"
                  }
                >
                  {category.isActive ? "Active" : "Inactive"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
