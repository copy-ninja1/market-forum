import { describe, expect, it } from "vitest";
import { EmptyState } from "@/components/ui/EmptyState";
import { renderWithProviders, screen } from "@/test/test-utils";

describe("EmptyState", () => {
  it("renders title and description", () => {
    renderWithProviders(
      <EmptyState title="No listings yet" description="Be the first to post an item." />,
    );

    expect(screen.getByText("No listings yet")).toBeInTheDocument();
    expect(screen.getByText("Be the first to post an item.")).toBeInTheDocument();
  });
});
