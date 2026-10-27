import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";
import { updateProfileSchema } from "@/features/profiles/schemas/profileSchemas";
import type { AuthUser, UserProfile } from "@/features/auth/types/auth.interfaces";
import type { PublicProfile } from "@/features/profiles/types/profile.interfaces";
import { toPublicProfile } from "@/features/profiles/lib/publicProfile";
import type { AccountStatus } from "@/features/auth/types/auth.types";
import type { ContactType } from "@/features/listings/types/listing.types";
import { COLLECTIONS, getFirebaseFirestore } from "@/lib/firebase/firebaseFirestore";

type UserProfileFirestoreRecord = {
  readonly uid: string;
  readonly displayName: string;
  readonly email: string | null;
  readonly institution: string;
  readonly avatarUrl: string | null;
  readonly preferredContactType: ContactType;
  readonly preferredContactValue: string;
  readonly accountStatus: AccountStatus;
  readonly createdAt: Timestamp;
  readonly updatedAt: Timestamp;
};

function isContactType(value: unknown): value is ContactType {
  return value === "email" || value === "phone" || value === "other";
}

function isAccountStatus(value: unknown): value is AccountStatus {
  return value === "active" || value === "restricted" || value === "disabled";
}

function toDate(value: unknown, field: string): Date {
  if (value instanceof Timestamp) {
    return value.toDate();
  }
  if (value instanceof Date) {
    return value;
  }
  throw new Error(`Profile field "${field}" is not a valid timestamp.`);
}

function mapProfileFromFirestore(uid: string, data: unknown): UserProfile {
  if (typeof data !== "object" || data === null) {
    throw new Error("Profile document data is invalid.");
  }

  const record = data as Record<string, unknown>;
  if (typeof record.displayName !== "string") {
    throw new Error("Profile is missing displayName.");
  }
  if (typeof record.institution !== "string") {
    throw new Error("Profile is missing institution.");
  }
  if (!isContactType(record.preferredContactType)) {
    throw new Error("Profile has an invalid preferredContactType.");
  }
  if (typeof record.preferredContactValue !== "string") {
    throw new Error("Profile is missing preferredContactValue.");
  }
  if (!isAccountStatus(record.accountStatus)) {
    throw new Error("Profile has an invalid accountStatus.");
  }

  return {
    uid,
    displayName: record.displayName,
    email: typeof record.email === "string" ? record.email : null,
    institution: record.institution,
    avatarUrl: typeof record.avatarUrl === "string" ? record.avatarUrl : null,
    preferredContactType: record.preferredContactType,
    preferredContactValue: record.preferredContactValue,
    accountStatus: record.accountStatus,
    createdAt: toDate(record.createdAt, "createdAt"),
    updatedAt: toDate(record.updatedAt, "updatedAt"),
  };
}

function userDocRef(uid: string) {
  return doc(getFirebaseFirestore(), COLLECTIONS.users, uid);
}

export async function getPublicProfile(uid: string): Promise<PublicProfile | null> {
  const profile = await getProfile(uid);
  if (!profile) {
    return null;
  }
  return toPublicProfile(profile);
}

export async function getProfile(uid: string): Promise<UserProfile | null> {
  const snapshot = await getDoc(userDocRef(uid));
  if (!snapshot.exists()) {
    return null;
  }
  return mapProfileFromFirestore(uid, snapshot.data());
}

export async function updateProfile(uid: string, input: unknown): Promise<UserProfile> {
  const parsed = updateProfileSchema.parse(input);

  const profileRef = userDocRef(uid);
  const existing = await getDoc(profileRef);
  if (!existing.exists()) {
    throw new Error("Profile not found.");
  }

  await updateDoc(profileRef, {
    displayName: parsed.displayName,
    institution: parsed.institution,
    preferredContactType: parsed.preferredContactType,
    preferredContactValue: parsed.preferredContactValue,
    updatedAt: serverTimestamp(),
  });
  const updated = await getDoc(profileRef);
  if (!updated.exists()) {
    throw new Error("Failed to load profile after update.");
  }
  return mapProfileFromFirestore(uid, updated.data());
}

export async function ensureProfileExists(user: AuthUser): Promise<UserProfile> {
  const existing = await getProfile(user.uid);
  if (existing) {
    return existing;
  }

  const displayName =
    user.displayName?.trim() ||
    user.email?.split("@")[0]?.trim() ||
    "Student";

  const payload: Omit<UserProfileFirestoreRecord, "createdAt" | "updatedAt"> & {
    createdAt: ReturnType<typeof serverTimestamp>;
    updatedAt: ReturnType<typeof serverTimestamp>;
  } = {
    uid: user.uid,
    displayName,
    email: user.email,
    institution: "",
    avatarUrl: null,
    preferredContactType: "email",
    preferredContactValue: user.email ?? "",
    accountStatus: "active",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(userDocRef(user.uid), payload);
  const created = await getProfile(user.uid);
  if (!created) {
    throw new Error("Failed to load profile after ensureProfileExists.");
  }
  return created;
}

export const profileService = {
  getProfile,
  getPublicProfile,
  updateProfile,
  ensureProfileExists,
};
