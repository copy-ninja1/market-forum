import { initializeApp, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

export function ensureAdminApp() {
  if (getApps().length === 0) {
    initializeApp();
  }
  return getFirestore();
}
