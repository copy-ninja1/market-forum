import { Link, Navigate, NavLink, Outlet } from "react-router-dom";
import { LoadingState } from "@/components/ui/LoadingState";
import { BrandMark } from "@/components/layout/BrandMark";
import { APP_NAME } from "@/constants/app.constants";
import { ROUTES } from "@/constants/route.constants";
import { useAuth } from "@/features/auth/hooks/useAuth";

const adminNavClass = ({ isActive }: { isActive: boolean }) =>
  [
    "block rounded-xl px-3 py-2.5 text-sm font-semibold ",
    isActive
      ? "bg-white text-campus-ink"
      : "text-white/75 hover:bg-white/10 hover:text-white",
  ].join(" ");

export function AdminLayout() {
  const { isAdmin, isAuthenticated, isLoading, profile, signOut } = useAuth();

  if (isLoading) {
    return <LoadingState message="Loading admin tools…" fullScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.signIn} replace />;
  }

  if (!isAdmin) {
    return <Navigate to={ROUTES.forbidden} replace />;
  }

  return (
    <div className="min-h-screen bg-campus-paper lg:grid lg:grid-cols-[270px_1fr]">
      <aside className="bg-campus-ink text-campus-paper lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:px-5 lg:py-6">
        <div className="flex items-center justify-between gap-4 px-4 py-4 lg:px-0 lg:py-0">
          <Link
            to={ROUTES.home}
            className=" flex items-center gap-2.5 rounded-md"
          >
            <BrandMark className="bg-campus-paper text-campus-ink" />
            <span>
              <span className="font-display block text-lg leading-none">
                {APP_NAME}
              </span>
              <span className="mt-1 block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-white/55">
                Admin desk
              </span>
            </span>
          </Link>
        </div>

        <nav
          className="mt-2 flex gap-2 px-4 pb-4 lg:mt-10 lg:flex-col lg:px-0"
          aria-label="Admin"
        >
          <NavLink to={ROUTES.adminReports} className={adminNavClass}>
            Moderation queue
          </NavLink>
          <NavLink to={ROUTES.adminCategories} className={adminNavClass}>
            Categories
          </NavLink>
          <NavLink to={ROUTES.browse} className={adminNavClass}>
            View marketplace
          </NavLink>
        </nav>

        <div className="mt-auto hidden pt-5 lg:block">
          <p className="text-sm font-semibold">
            {profile?.displayName ?? "Administrator"}
          </p>
          <p className="mt-1 text-xs text-white/55">Moderator access</p>
          <button
            className=" mt-4 rounded-full px-3 py-2 text-sm font-semibold text-white/80 hover:bg-white/10 hover:text-white"
            type="button"
            onClick={() => {
              void signOut();
            }}
          >
            Sign out
          </button>
        </div>
      </aside>

      <div className="px-4 py-6 md:px-8 md:py-8">
        <Outlet />
      </div>
    </div>
  );
}
