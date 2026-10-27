import { Navigate, Outlet } from "react-router-dom";
import { LoadingState } from "@/components/ui/LoadingState";
import { ROUTES } from "@/constants/route.constants";
import { useAuth } from "@/features/auth/hooks/useAuth";

export function AdminRoute() {
  const { isAdmin, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingState message="Checking permissions…" fullScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.signIn} replace />;
  }

  if (!isAdmin) {
    return <Navigate to={ROUTES.forbidden} replace />;
  }

  return <Outlet />;
}
