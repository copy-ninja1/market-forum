import { Navigate, NavLink, Outlet } from "react-router-dom";
import { LoadingState } from "@/components/ui/LoadingState";
import { ROUTES } from "@/constants/route.constants";
import { useAuth } from "@/features/auth/hooks/useAuth";

const adminNavClass = ({ isActive }: { isActive: boolean }) =>
  [
    "rounded-md px-3 py-2 text-sm font-medium focus-ring",
    isActive
      ? "bg-campus-leaf/15 text-campus-leaf"
      : "text-campus-ink/75 hover:bg-campus-mist/60 hover:text-campus-ink",
  ].join(" ");

export function AdminLayout() {
  const { isAdmin, isAuthenticated, isLoading } = useAuth();

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
    <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6 md:py-8">
      <div className="mb-6 flex flex-col gap-4 border-b border-campus-mist pb-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-campus-leaf">Admin</p>
          <h1 className="font-display text-2xl text-campus-ink">Campus moderation</h1>
        </div>
        <nav className="flex flex-wrap gap-1" aria-label="Admin">
          <NavLink to={ROUTES.adminReports} className={adminNavClass}>
            Reports
          </NavLink>
          <NavLink to={ROUTES.adminCategories} className={adminNavClass}>
            Categories
          </NavLink>
        </nav>
      </div>
      <Outlet />
    </div>
  );
}
