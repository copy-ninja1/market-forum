import { ROUTES } from "@/constants/route.constants";
import type { NavItem } from "@/components/layout/layout.interfaces";

export const PRIMARY_NAV_ITEMS: NavItem[] = [
  { label: "Browse", to: ROUTES.browse },
  { label: "My Listings", to: ROUTES.myListings },
  { label: "Post", to: ROUTES.createListing },
];
