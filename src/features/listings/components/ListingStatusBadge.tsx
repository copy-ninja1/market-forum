import { Chip } from "@heroui/react";
import { STATUS_LABELS } from "@/constants/listing.constants";
import type { ListingStatusBadgeProps } from "@/features/listings/types/listing.interfaces";

function statusColor(status: ListingStatusBadgeProps["status"]) {
  switch (status) {
    case "active":
      return "success" as const;
    case "sold":
      return "warning" as const;
    case "unavailable":
      return "default" as const;
    case "hidden":
      return "danger" as const;
    default: {
      const exhaustive: never = status;
      return exhaustive;
    }
  }
}

export function ListingStatusBadge({ status, className }: ListingStatusBadgeProps) {
  return (
    <Chip className={className} color={statusColor(status)} size="sm" variant="soft">
      <Chip.Label>{STATUS_LABELS[status]}</Chip.Label>
    </Chip>
  );
}
