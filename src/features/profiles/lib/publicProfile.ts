import type { UserProfile } from "@/features/auth/types/auth.interfaces";
import type { AccountStatus } from "@/features/auth/types/auth.types";
import type { PublicProfile } from "@/features/profiles/types/profile.interfaces";

/** Maps a stored profile to the fields published on a member page. */
export function toPublicProfile(profile: UserProfile): PublicProfile {
  return {
    uid: profile.uid,
    displayName: profile.displayName,
    institution: profile.institution,
    avatarUrl: profile.avatarUrl,
    accountStatus: profile.accountStatus,
    createdAt: profile.createdAt,
  };
}

export function accountStandingLabel(status: AccountStatus): string {
  switch (status) {
    case "active":
      return "Active";
    case "restricted":
      return "Restricted";
    case "disabled":
      return "Inactive";
    default: {
      const exhaustive: never = status;
      return exhaustive;
    }
  }
}
