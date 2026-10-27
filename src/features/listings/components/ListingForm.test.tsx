import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ListingForm } from "@/features/listings/components/ListingForm";

const originalGetContext = HTMLCanvasElement.prototype.getContext;
const originalToBlob = HTMLCanvasElement.prototype.toBlob;

afterEach(() => {
  HTMLCanvasElement.prototype.getContext = originalGetContext;
  HTMLCanvasElement.prototype.toBlob = originalToBlob;
  vi.unstubAllGlobals();
});

describe("ListingForm", () => {
  it("prices listings in naira and requires a photo", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(
      <ListingForm
        categories={[{ id: "books", name: "Books" }]}
        isSubmitting={false}
        mode="create"
        onSubmit={onSubmit}
      />,
    );

    expect(screen.getByText(/Nigerian naira only/i)).toBeInTheDocument();
    expect(screen.queryByRole("textbox", { name: "Currency" })).not.toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Price" })).toHaveAttribute("inputmode", "numeric");
    expect(screen.getByRole("button", { name: "Increase Price" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Decrease Price" })).toBeInTheDocument();
    expect(screen.getByLabelText(/Add photo/i)).toHaveAttribute(
      "accept",
      "image/jpeg,image/png,image/webp",
    );

    await user.click(screen.getByRole("button", { name: "Publish listing" }));

    expect(await screen.findByText(/at least one photo/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("steps the naira price and stores a selected photo as webp", async () => {
    vi.stubGlobal(
      "createImageBitmap",
      async () =>
        ({
          width: 2000,
          height: 1000,
          close() {
            return undefined;
          },
        }) satisfies Partial<ImageBitmap>,
    );
    HTMLCanvasElement.prototype.getContext = (() => ({
      drawImage() {
        return undefined;
      },
    })) as unknown as typeof HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.toBlob = (callback) => {
      callback(new Blob([new Uint8Array(180)], { type: "image/webp" }));
    };

    const user = userEvent.setup();
    render(
      <ListingForm
        categories={[{ id: "books", name: "Books" }]}
        isSubmitting={false}
        mode="create"
        onSubmit={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Increase Price" }));
    expect(screen.getByRole("textbox", { name: "Price" })).toHaveValue("₦100.00");

    const file = new File([new Uint8Array(20)], "lamp.jpg", { type: "image/jpeg" });
    await user.upload(screen.getByLabelText(/Add photo/i), file);

    expect(await screen.findByText("WebP · 1 KB")).toBeInTheDocument();
    expect(screen.getByText("1/2")).toBeInTheDocument();
  });
});
