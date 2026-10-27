import { Button } from "@heroui/react";
import { Link } from "react-router-dom";
import { APP_NAME } from "@/constants/app.constants";
import { ROUTES } from "@/constants/route.constants";
import { useAuth } from "@/features/auth/hooks/useAuth";

export function HomePage() {
  const { isAuthenticated } = useAuth();
  const postTarget = isAuthenticated ? ROUTES.createListing : ROUTES.signIn;

  return (
    <section className="relative overflow-hidden rounded-2xl border border-campus-mist/80 bg-campus-paper/80 px-6 py-16 md:px-12 md:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,oklch(0.88_0.05_155/.55),transparent_42%),radial-gradient(circle_at_85%_10%,oklch(0.9_0.04_230/.45),transparent_36%)]"
      />

      <div className="relative">
        <h1 className="font-display text-5xl leading-[1.05] tracking-tight text-campus-ink md:text-7xl">
          {APP_NAME}
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-campus-ink/80 md:text-xl">
          The campus marketplace for textbooks, gear, and everyday student essentials.
        </p>
        <p className="mt-3 max-w-lg text-sm text-campus-ink/65 md:text-base">
          Browse trusted community listings or post an item in minutes.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link to={ROUTES.browse}>
            <Button size="lg">Browse listings</Button>
          </Link>
          <Link to={postTarget} state={isAuthenticated ? undefined : { from: ROUTES.createListing }}>
            <Button size="lg" variant="secondary">
              {isAuthenticated ? "Post a listing" : "Sign in to post"}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
