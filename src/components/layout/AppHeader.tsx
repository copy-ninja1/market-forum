import { Link, NavLink, useNavigate } from "react-router-dom";
import { Button } from "@heroui/react";
import { APP_NAME } from "@/constants/app.constants";
import { ROUTES } from "@/constants/route.constants";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type { AppHeaderProps } from "@/components/layout/layout.interfaces";
import { MainNavigation } from "@/components/layout/MainNavigation";
import { MobileNavigation } from "@/components/layout/MobileNavigation";

const authLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    "text-sm font-medium focus-ring rounded-md px-2 py-1",
    isActive ? "text-campus-leaf" : "text-campus-ink/75 hover:text-campus-ink",
  ].join(" ");

export function AppHeader({ className }: AppHeaderProps) {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, isLoading, signOut } = useAuth();

  return (
    <header
      className={`relative sticky top-0 z-40 border-b border-campus-mist/80 bg-campus-paper/90 backdrop-blur-md ${className ?? ""}`.trim()}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <div className="flex min-w-0 items-center gap-6">
          <Link
            to={ROUTES.home}
            className="focus-ring flex min-w-0 items-center gap-2 rounded-md"
          >
            <img src="/favicon.svg" alt="" className="size-8 shrink-0" width={32} height={32} />
            <span className="font-display truncate text-lg text-campus-ink md:text-xl">{APP_NAME}</span>
          </Link>
          <MainNavigation />
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 md:flex">
            {isLoading ? (
              <span className="text-sm text-campus-ink/50">…</span>
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
                  variant="primary"
                  size="sm"
                  onPress={() => {
                    navigate(ROUTES.signUp);
                  }}
                >
                  Join
                </Button>
              </>
            )}
          </div>
          <MobileNavigation />
        </div>
      </div>
    </header>
  );
}
