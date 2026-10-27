import { render, type RenderOptions } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter } from "react-router-dom";

type WrapperProps = {
  readonly children: ReactNode;
};

function AllProviders({ children }: WrapperProps) {
  return (
    <HelmetProvider>
      <MemoryRouter>{children}</MemoryRouter>
    </HelmetProvider>
  );
}

export function renderWithProviders(ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) {
  return render(ui, { wrapper: AllProviders, ...options });
}

export * from "@testing-library/react";
