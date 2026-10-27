import type { ReactNode } from "react";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/app/providers/AuthProvider";
import { HeroUIProvider } from "@/app/providers/HeroUIProvider";
import { SeoSsrCleanup } from "@/seo/SeoSsrCleanup";

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <HelmetProvider>
      <HeroUIProvider>
        <AuthProvider>
          <SeoSsrCleanup />
          {children}
        </AuthProvider>
      </HeroUIProvider>
    </HelmetProvider>
  );
}
