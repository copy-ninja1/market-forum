import type { ReactNode } from "react";
import { AuthProvider } from "@/app/providers/AuthProvider";
import { HeroUIProvider } from "@/app/providers/HeroUIProvider";

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <HeroUIProvider>
      <AuthProvider>{children}</AuthProvider>
    </HeroUIProvider>
  );
}
