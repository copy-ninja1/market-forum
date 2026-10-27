import { Navigate, Outlet, useLocation } from "react-router-dom";
import { LoadingState } from "@/components/ui/LoadingState";
import { ROUTES } from "@/constants/route.constants";
import { useAuth } from "@/features/auth/hooks/useAuth";

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingState message="Checking your session…" fullScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.signIn} replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
