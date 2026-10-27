import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@heroui/react";
import { APP_NAME } from "@/constants/app.constants";
import { ROUTES } from "@/constants/route.constants";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type { AppHeaderProps } from "@/components/layout/layout.interfaces";
import { BrandMark } from "@/components/layout/BrandMark";
import { MainNavigation } from "@/components/layout/MainNavigation";
import { MobileNavigation } from "@/components/layout/MobileNavigation";

export function AppHeader({ className }: AppHeaderProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { isAuthenticated, isAdmin, isLoading, signOut } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isHome = pathname === "/";
  const overlay = isHome && !scrolled && !menuOpen;

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const authLinkClass = ({ isActive }: { isActive: boolean }) =>
    [
      "rounded-full px-3 py-2 text-sm font-semibold ",
      overlay
        ? isActive
          ? "text-white"
          : "text-white/80 hover:text-white"
        : isActive
          ? "text-campus-leaf"
          : "text-campus-ink/75 hover:text-campus-ink",
    ].join(" ");

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        overlay
          ? "bg-transparent text-white"
          : "bg-campus-paper/92 text-campus-ink backdrop-blur-md"
      } ${className ?? ""}`.trim()}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <div className="flex min-w-0 items-center gap-6">
          <Link
            to={ROUTES.home}
            aria-label={APP_NAME}
            className=" flex shrink-0 items-center gap-2.5 rounded-md"
          >
            <BrandMark
              className={overlay ? "bg-white text-campus-ink" : undefined}
            />
            <span className="font-display text-lg leading-none tracking-tight">
              Forum
            </span>
          </Link>
          <MainNavigation tone={overlay ? "light" : "ink"} />
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-1 lg:flex">
            {isLoading ? (
              <span
                className={`text-sm ${overlay ? "text-white/70" : "text-campus-ink/50"}`}
              >
                …
              </span>
            ) : isAuthenticated ? (
              <>
                {isAdmin ? (
                  <NavLink to={ROUTES.adminReports} className={authLinkClass}>
                    Admin
                  </NavLink>
                ) : null}
                <NavLink to={ROUTES.profile} className={authLinkClass}>
                  Profile
                </NavLink>
                <Button
                  variant="secondary"
                  size="sm"
                  onPress={() => {
                    void signOut();
                  }}
                >
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <NavLink to={ROUTES.signIn} className={authLinkClass}>
                  Sign in
                </NavLink>
                <Button
                  size="sm"
                  variant="secondary"
                  onPress={() => {
                    navigate(ROUTES.signUp);
                  }}
                >
                  Join
                </Button>
              </>
            )}
            <Button
              size="sm"
              variant="primary"
              className={overlay ? "bg-white text-campus-ink" : undefined}
              onPress={() => {
                navigate(
                  isAuthenticated ? ROUTES.createListing : ROUTES.signIn,
                  {
                    state: isAuthenticated
                      ? undefined
                      : { from: ROUTES.createListing },
                  },
                );
              }}
            >
              List an item
            </Button>
          </div>
          <MobileNavigation
            tone={overlay ? "light" : "ink"}
            onOpenChange={setMenuOpen}
          />
        </div>
      </div>
    </header>
  );
}
