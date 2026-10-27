import { Button } from "@heroui/react";
import { Link } from "react-router-dom";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { PageHeader } from "@/components/ui/PageHeader";
import { memberPath } from "@/constants/route.constants";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { ProfileForm } from "@/features/profiles/components/ProfileForm";
import { profileService } from "@/features/profiles/services/profileService";
import type { UpdateProfileSchema } from "@/features/profiles/schemas/profileSchemas";
import { DocumentHead, profilePageSeo, useSiteSeoConfig } from "@/seo";
import { formatRelativeDate } from "@/utils/date.utils";

export function ProfilePage() {
  const { profile, isLoading, refreshProfile } = useAuth();
  const { appName, siteUrl } = useSiteSeoConfig();
  const seo = profilePageSeo(siteUrl, appName);

  if (isLoading) {
    return (
      <>
        <DocumentHead seo={seo} />
        <LoadingState message="Loading profile…" />
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <DocumentHead seo={seo} />
        <ErrorState
          message="We could not load your profile. Try signing out and back in."
          title="Profile unavailable"
        />
      </>
    );
  }

  const handleSubmit = async (values: UpdateProfileSchema) => {
    await profileService.updateProfile(profile.uid, values);
    await refreshProfile();
  };

  const initial = profile.displayName.trim().charAt(0).toUpperCase() || "S";

  return (
    <div className="space-y-8">
      <DocumentHead seo={seo} />
      <PageHeader
        actions={
          <Link to={memberPath(profile.uid)}>
            <Button variant="secondary">Public page</Button>
          </Link>
        }
        description="Your display name and institution appear on your public page, with your current listings. Contact details stay on each listing you publish."
        eyebrow="Account"
        title="Your profile"
      />

      <div className="grid items-start gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="panel p-6">
          {profile.avatarUrl ? (
            <img
              alt=""
              className="size-20 rounded-2xl object-cover"
              height={80}
              src={profile.avatarUrl}
              width={80}
            />
          ) : (
            <div className="font-display flex size-20 items-center justify-center rounded-2xl bg-campus-ink text-3xl text-campus-paper">
              {initial}
            </div>
          )}
          <h2 className="font-display mt-4 text-3xl tracking-tight text-campus-ink">
            {profile.displayName}
          </h2>
          <p className="mt-1 text-sm text-campus-ink/70">{profile.institution || "Campus member"}</p>
          {profile.email ? (
            <p className="mt-4 break-all text-sm text-campus-ink/60">{profile.email}</p>
          ) : null}
          <p className="mt-4 text-xs uppercase tracking-[0.16em] text-campus-ink/45">
            Member since {formatRelativeDate(profile.createdAt)}
          </p>
        </aside>

        <section className="panel p-5 md:p-8">
          <ProfileForm profile={profile} onSubmit={handleSubmit} />
        </section>
      </div>
    </div>
  );
}
