import type { UserProfile } from "@/features/auth/types/auth.interfaces";
import type { AccountStatus } from "@/features/auth/types/auth.types";
import type { UpdateProfileSchema } from "@/features/profiles/schemas/profileSchemas";

/** Fields safe to show on a member's public page. Email and contact preferences stay private. */
export type PublicProfile = {
  readonly uid: string;
  readonly displayName: string;
  readonly institution: string;
  readonly avatarUrl: string | null;
  readonly accountStatus: AccountStatus;
  readonly createdAt: Date;
};

export interface ProfileFormProps {
  readonly profile: UserProfile;
  readonly isSubmitting?: boolean;
  readonly onSubmit: (values: UpdateProfileSchema) => Promise<void>;
}
