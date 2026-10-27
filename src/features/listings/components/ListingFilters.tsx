import { Label, ListBox, Select } from "@heroui/react";
import { LISTING_SORT_OPTIONS } from "@/constants/listing.constants";
import { SORT_LABELS } from "@/constants/listing.constants";
import type { ListingAvailabilityFilter, ListingSortOption } from "@/features/listings/types/listing.types";
import type { ListingFiltersProps } from "@/features/listings/types/listing.interfaces";

const AVAILABILITY_OPTIONS: readonly { id: ListingAvailabilityFilter; label: string }[] = [
  { id: "active", label: "Available" },
  { id: "sold", label: "Sold" },
  { id: "unavailable", label: "Unavailable" },
  { id: "all", label: "All public" },
];

export function ListingFilters({
  categoryId,
  availability,
  sort,
  categories,
  isCategoriesLoading = false,
  layout = "grid",
  onCategoryChange,
  onAvailabilityChange,
  onSortChange,
}: ListingFiltersProps) {
  const layoutClass = layout === "stack" ? "grid gap-4" : "grid gap-4 md:grid-cols-3";

  return (
    <div className={layoutClass}>
      <Select
        fullWidth
        isDisabled={isCategoriesLoading}
        placeholder="All categories"
        selectedKey={categoryId || "all"}
        onSelectionChange={(key) => {
          const next = String(key);
          onCategoryChange(next === "all" ? "" : next);
        }}
      >
        <Label>Category</Label>
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            <ListBox.Item id="all" textValue="All categories">
              All categories
            </ListBox.Item>
            {categories.map((category) => (
              <ListBox.Item key={category.id} id={category.id} textValue={category.name}>
                {category.name}
              </ListBox.Item>
            ))}
          </ListBox>
        </Select.Popover>
      </Select>

      <Select
        fullWidth
        selectedKey={availability}
        onSelectionChange={(key) => onAvailabilityChange(String(key) as ListingAvailabilityFilter)}
      >
        <Label>Availability</Label>
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            {AVAILABILITY_OPTIONS.map((option) => (
              <ListBox.Item key={option.id} id={option.id} textValue={option.label}>
                {option.label}
              </ListBox.Item>
            ))}
          </ListBox>
        </Select.Popover>
      </Select>

      <Select
        fullWidth
        selectedKey={sort}
        onSelectionChange={(key) => onSortChange(String(key) as ListingSortOption)}
      >
        <Label>Sort</Label>
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            {LISTING_SORT_OPTIONS.map((option) => (
              <ListBox.Item key={option} id={option} textValue={SORT_LABELS[option]}>
                {SORT_LABELS[option]}
              </ListBox.Item>
            ))}
          </ListBox>
        </Select.Popover>
      </Select>
    </div>
  );
}
