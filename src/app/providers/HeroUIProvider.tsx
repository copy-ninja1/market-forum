import type { ReactNode } from "react";

type HeroUIProviderProps = {
  readonly children: ReactNode;
};

/**
 * HeroUI React v3 does not require a runtime provider.
 * This passthrough exists for app-provider composition symmetry and documentation.
 */
export function HeroUIProvider({ children }: HeroUIProviderProps) {
  return children;
}
