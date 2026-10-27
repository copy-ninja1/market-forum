import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import {
  passwordResetSchema,
  signInSchema,
  signUpSchema,
} from "@/features/auth/schemas/authSchemas";
import type {
  AuthUser,
  PasswordResetInput,
  SignInInput,
  SignUpInput,
} from "@/features/auth/types/auth.interfaces";
import { getFirebaseAuth } from "@/lib/firebase/firebaseAuth";
import { COLLECTIONS, getFirebaseFirestore } from "@/lib/firebase/firebaseFirestore";

export async function mapUser(firebaseUser: User): Promise<AuthUser> {
  const tokenResult = await firebaseUser.getIdTokenResult();
  const adminClaim = tokenResult.claims.admin;
  const isAdmin = adminClaim === true;

  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    emailVerified: firebaseUser.emailVerified,
    displayName: firebaseUser.displayName,
    isAdmin,
  };
}

async function createUserDocument(user: User, displayName: string, institution: string): Promise<void> {
  const userRef = doc(getFirebaseFirestore(), COLLECTIONS.users, user.uid);
  await setDoc(userRef, {
    uid: user.uid,
    displayName,
    email: user.email,
    institution,
    avatarUrl: null,
    preferredContactType: "email",
    preferredContactValue: user.email ?? "",
    accountStatus: "active",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function signUp(input: SignUpInput): Promise<AuthUser> {
  const parsed = signUpSchema.parse(input);
  const auth = getFirebaseAuth();

  const credential = await createUserWithEmailAndPassword(auth, parsed.email, parsed.password);
  await updateProfile(credential.user, { displayName: parsed.displayName });
  await sendEmailVerification(credential.user);
  await createUserDocument(credential.user, parsed.displayName, parsed.institution);

  return mapUser(credential.user);
}

export async function signIn(input: SignInInput): Promise<AuthUser> {
  const parsed = signInSchema.parse(input);
  const auth = getFirebaseAuth();
  const credential = await signInWithEmailAndPassword(auth, parsed.email, parsed.password);
  return mapUser(credential.user);
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(getFirebaseAuth());
}

export async function resetPassword(input: PasswordResetInput): Promise<void> {
  const parsed = passwordResetSchema.parse(input);
  await sendPasswordResetEmail(getFirebaseAuth(), parsed.email);
}

export async function getCurrentAuthUser(): Promise<AuthUser | null> {
  const auth = getFirebaseAuth();
  const user = auth.currentUser;
  if (!user) {
    return null;
  }
  return mapUser(user);
}

export const authService = {
  signUp,
  signIn,
  signOut,
  resetPassword,
  mapUser,
  getCurrentAuthUser,
};
