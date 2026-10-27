import { Outlet } from "react-router-dom";
import { AppFooter } from "@/components/layout/AppFooter";
import { AppHeader } from "@/components/layout/AppHeader";

export function PublicLayout() {
  return (
    <div className="flex min-h-full flex-col">
      <AppHeader />
      <main id="main-content" className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 md:px-6 md:py-8">
        <Outlet />
      </main>
      <AppFooter />
    </div>
  );
}
