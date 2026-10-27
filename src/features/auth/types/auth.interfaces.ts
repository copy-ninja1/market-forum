import type { ContactType } from "@/features/listings/types/listing.types";
import type { AccountStatus } from "./auth.types";

export interface AuthUser {
  readonly uid: string;
  readonly email: string | null;
  readonly emailVerified: boolean;
  readonly displayName: string | null;
  readonly isAdmin: boolean;
}

export interface UserProfile {
  readonly uid: string;
  readonly displayName: string;
  readonly email: string | null;
  readonly institution: string;
  readonly avatarUrl: string | null;
  readonly preferredContactType: ContactType;
  readonly preferredContactValue: string;
  readonly accountStatus: AccountStatus;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface SignUpInput {
  readonly email: string;
  readonly password: string;
  readonly displayName: string;
  readonly institution: string;
}

export interface SignInInput {
  readonly email: string;
  readonly password: string;
}

export interface PasswordResetInput {
  readonly email: string;
}

export interface UpdateProfileInput {
  readonly displayName: string;
  readonly institution: string;
  readonly preferredContactType: ContactType;
  readonly preferredContactValue: string;
  readonly avatarUrl?: string | null;
}

export type AuthFieldErrors = Record<string, string>;

export interface AuthContextValue {
  readonly user: AuthUser | null;
  readonly profile: UserProfile | null;
  readonly isLoading: boolean;
  readonly isAuthenticated: boolean;
  readonly isAdmin: boolean;
  readonly refreshProfile: () => Promise<void>;
  readonly signOut: () => Promise<void>;
}
