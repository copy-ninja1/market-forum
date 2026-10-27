import { Button } from "@heroui/react";
import { Link, useParams } from "react-router-dom";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { ROUTES } from "@/constants/route.constants";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { ListingCatalog } from "@/features/listings/components/ListingCatalog";
import { useMemberListings } from "@/features/listings/hooks/useMemberListings";
import { accountStandingLabel } from "@/features/profiles/lib/publicProfile";
import { usePublicProfile } from "@/features/profiles/hooks/usePublicProfile";
import {
  DocumentHead,
  memberNotFoundSeo,
  memberPageSeo,
  useSiteSeoConfig,
} from "@/seo";
import { formatRelativeDate } from "@/utils/date.utils";

export function PublicMemberPage() {
  const { uid: rawUid } = useParams<{ uid: string }>();
  const uid = rawUid ? decodeURIComponent(rawUid) : undefined;
  const { user } = useAuth();
  const { appName, siteUrl } = useSiteSeoConfig();
  const { profile, isLoading, notFound, error, reload } = usePublicProfile(uid);
  const {
    listings,
    isLoading: isListingsLoading,
    error: listingsError,
    reload: reloadListings,
  } = useMemberListings(uid);

  const seo = !uid
    ? memberNotFoundSeo(siteUrl, appName)
    : profile
      ? memberPageSeo(siteUrl, appName, {
          uid: profile.uid,
          displayName: profile.displayName,
          institution: profile.institution,
        })
      : notFound
        ? memberNotFoundSeo(siteUrl, appName)
        : memberPageSeo(siteUrl, appName, {
            uid,
            displayName: "Member",
            institution: "",
          });

  if (isLoading) {
    return (
      <>
        <DocumentHead seo={seo} />
        <LoadingState message="Loading member…" />
      </>
    );
  }

  if (error) {
    return (
      <>
        <DocumentHead seo={seo} />
        <ErrorState message={error} onRetry={() => void reload()} />
      </>
    );
  }

  if (notFound || !profile) {
    return (
      <>
        <DocumentHead seo={memberNotFoundSeo(siteUrl, appName)} />
        <EmptyState
          action={
            <Link to={ROUTES.browse}>
              <Button variant="primary">Back to listings</Button>
            </Link>
          }
          description="This member page is unavailable or the link is incorrect."
          title="Member not found"
        />
      </>
    );
  }

  const initial = profile.displayName.trim().charAt(0).toUpperCase() || "M";
  const institution = profile.institution.trim() || "Campus member";
  const isSelf = user?.uid === profile.uid;
  const listingCountLabel = isListingsLoading
    ? "—"
    : listings.length === 1
      ? "1 current listing"
      : `${listings.length} current listings`;

  return (
    <div className="space-y-6">
      <DocumentHead seo={seo} />
      <nav aria-label="Breadcrumb" className="text-sm text-campus-ink/60">
        <Link className="rounded-sm hover:text-campus-ink" to={ROUTES.browse}>
          Listings
        </Link>
        <span aria-hidden className="px-2">
          /
        </span>
        <span className="text-campus-ink">{profile.displayName}</span>
      </nav>

      <header className="overflow-hidden rounded-xl border border-campus-ink/10 bg-white">
        <div className="border-b border-campus-ink/10 bg-campus-mist/40 px-5 py-2.5">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-campus-ink/50">
            Member
          </p>
        </div>
        <div className="flex flex-col gap-6 p-5 md:flex-row md:items-start md:justify-between md:p-6">
          <div className="flex min-w-0 items-start gap-4">
            {profile.avatarUrl ? (
              <img
                alt=""
                className="size-16 rounded-lg object-cover md:size-20"
                height={80}
                src={profile.avatarUrl}
                width={80}
              />
            ) : (
              <div className="flex size-16 items-center justify-center rounded-lg bg-campus-ink text-2xl font-semibold text-campus-paper md:size-20">
                {initial}
              </div>
            )}
            <div className="min-w-0">
              <h1 className="font-display text-3xl tracking-tight text-campus-ink md:text-4xl">
                {profile.displayName}
              </h1>
              <p className="mt-1 text-sm text-campus-ink/70">{institution}</p>
              <p className="mt-3 text-sm font-medium text-campus-ink">{listingCountLabel}</p>
            </div>
          </div>
          {isSelf ? (
            <Link to={ROUTES.profile}>
              <Button variant="secondary">Edit profile</Button>
            </Link>
          ) : null}
        </div>
        <dl className="grid gap-px border-t border-campus-ink/10 bg-campus-ink/10 sm:grid-cols-3">
          <div className="bg-white px-5 py-4">
            <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-campus-ink/45">
              Institution
            </dt>
            <dd className="mt-1 text-sm font-semibold text-campus-ink">{institution}</dd>
          </div>
          <div className="bg-white px-5 py-4">
            <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-campus-ink/45">
              Member since
            </dt>
            <dd className="mt-1 text-sm font-semibold text-campus-ink">
              {formatRelativeDate(profile.createdAt)}
            </dd>
          </div>
          <div className="bg-white px-5 py-4">
            <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-campus-ink/45">
              Standing
            </dt>
            <dd className="mt-1 text-sm font-semibold text-campus-ink">
              {accountStandingLabel(profile.accountStatus)}
            </dd>
          </div>
        </dl>
      </header>

      <section aria-labelledby="current-listings-heading" className="space-y-4">
        <div>
          <h2
            className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-campus-ink/50"
            id="current-listings-heading"
          >
            Current listings
          </h2>
          <p className="mt-1 text-sm text-campus-ink/65">
            Active listings published by {profile.displayName}.
          </p>
        </div>

        {listingsError ? (
          <ErrorState message={listingsError} onRetry={() => void reloadListings()} />
        ) : null}

        <ListingCatalog
          emptyDescription="This member has no active listings right now."
          emptyTitle="No current listings"
          isLoading={isListingsLoading}
          listings={listings}
          showSeller={false}
        />
      </section>
    </div>
  );
}
