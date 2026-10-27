import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { PageHeader } from "@/components/ui/PageHeader";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { ProfileForm } from "@/features/profiles/components/ProfileForm";
import { profileService } from "@/features/profiles/services/profileService";
import type { UpdateProfileSchema } from "@/features/profiles/schemas/profileSchemas";

export function ProfilePage() {
  const { profile, isLoading, refreshProfile } = useAuth();

  if (isLoading) {
    return <LoadingState message="Loading profile…" />;
  }

  if (!profile) {
    return (
      <ErrorState
        message="We could not load your profile. Try signing out and back in."
        title="Profile unavailable"
      />
    );
  }

  const handleSubmit = async (values: UpdateProfileSchema) => {
    await profileService.updateProfile(profile.uid, values);
    await refreshProfile();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        description="Keep your campus details and preferred contact method up to date."
        title="Your profile"
      />
      <ProfileForm profile={profile} onSubmit={handleSubmit} />
    </div>
  );
}
