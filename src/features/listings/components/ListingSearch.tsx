import { Label, SearchField } from "@heroui/react";
import type { ListingSearchProps } from "@/features/listings/types/listing.interfaces";

export function ListingSearch({
  value,
  onChange,
  placeholder = "Search listings…",
}: ListingSearchProps) {
  return (
    <SearchField aria-label="Search listings" fullWidth value={value} onChange={onChange}>
      <Label className="sr-only">Search listings</Label>
      <SearchField.Group>
        <SearchField.SearchIcon />
        <SearchField.Input placeholder={placeholder} />
        <SearchField.ClearButton />
      </SearchField.Group>
    </SearchField>
  );
}
