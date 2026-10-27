import { Outlet, useLocation } from "react-router-dom";
import { AppFooter } from "@/components/layout/AppFooter";
import { AppHeader } from "@/components/layout/AppHeader";

export function PublicLayout() {
  const { pathname } = useLocation();
  const isMarketingHome = pathname === "/";

  return (
    <div className="flex min-h-screen flex-col bg-campus-paper">
      <a
        className=" sr-only absolute left-4 top-4 z-50 rounded-full bg-white px-4 py-2 text-sm font-semibold text-campus-ink focus:not-sr-only"
        href="#main-content"
      >
        Skip to content
      </a>
      <AppHeader />
      <main
        id="main-content"
        className={
          isMarketingHome
            ? "flex-1"
            : "mx-auto w-full max-w-7xl flex-1 px-4 pb-16 pt-28 md:px-6 md:pt-32"
        }
      >
        <Outlet />
      </main>
      <AppFooter />
    </div>
  );
}
