export const ROUTES = {
  home: "/",
  browse: "/browse",
  listingDetails: "/listings/:listingId",
  createListing: "/listings/new",
  editListing: "/listings/:listingId/edit",
  myListings: "/my-listings",
  signIn: "/auth/sign-in",
  signUp: "/auth/sign-up",
  passwordReset: "/auth/password-reset",
  authAction: "/auth/action",
  profile: "/profile",
  member: "/members/:uid",
  adminReports: "/admin/reports",
  adminCategories: "/admin/categories",
  forbidden: "/forbidden",
  notFound: "*",
} as const;

export function listingDetailsPath(listingId: string): string {
  return `/listings/${listingId}`;
}

export function editListingPath(listingId: string): string {
  return `/listings/${listingId}/edit`;
}

export function memberPath(uid: string): string {
  return `/members/${encodeURIComponent(uid)}`;
}
