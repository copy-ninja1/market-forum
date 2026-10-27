import type { UserProfile } from "@/features/auth/types/auth.interfaces";
import type { UpdateProfileSchema } from "@/features/profiles/schemas/profileSchemas";

export interface ProfileFormProps {
  readonly profile: UserProfile;
  readonly isSubmitting?: boolean;
  readonly onSubmit: (values: UpdateProfileSchema) => Promise<void>;
}
