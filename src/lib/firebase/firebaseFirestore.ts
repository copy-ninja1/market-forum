export { getFirebaseFirestore } from "./firebase";

export const COLLECTIONS = {
  users: "users",
  listings: "listings",
  categories: "categories",
  reports: "reports",
} as const;
