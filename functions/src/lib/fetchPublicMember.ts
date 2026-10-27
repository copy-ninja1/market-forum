import type { PublicMemberSeoSource } from "@/seo/seo.types";
import { ensureAdminApp } from "./admin";

export async function fetchPublicMember(uid: string): Promise<PublicMemberSeoSource | null> {
  const trimmed = uid.trim();
  if (!trimmed) {
    return null;
  }

  const db = ensureAdminApp();
  const snapshot = await db.collection("users").doc(trimmed).get();
  if (!snapshot.exists) {
    return null;
  }

  const data = snapshot.data();
  if (!data || typeof data !== "object") {
    return null;
  }

  const displayName = typeof data.displayName === "string" ? data.displayName.trim() : "";
  if (!displayName) {
    return null;
  }

  return {
    uid: snapshot.id,
    displayName,
    institution: typeof data.institution === "string" ? data.institution : "",
  };
}
