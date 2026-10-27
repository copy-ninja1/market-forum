import { afterEach, describe, expect, it, vi } from "vitest";
import {
  isPreparedListingImage,
  listingImageCountError,
  prepareListingImage,
  scaledSize,
  webpFileName,
} from "@/utils/image.utils";

describe("listing image preparation", () => {
  const originalGetContext = HTMLCanvasElement.prototype.getContext;
  const originalToBlob = HTMLCanvasElement.prototype.toBlob;

  afterEach(() => {
    HTMLCanvasElement.prototype.getContext = originalGetContext;
    HTMLCanvasElement.prototype.toBlob = originalToBlob;
    vi.unstubAllGlobals();
  });

  it("fits a photo inside the longest edge without enlarging it", () => {
    expect(scaledSize(4000, 2000, 1600)).toEqual({ width: 1600, height: 800 });
    expect(scaledSize(800, 600, 1600)).toEqual({ width: 800, height: 600 });
  });

  it("names prepared files as webp", () => {
    expect(webpFileName("Desk Lamp.jpg")).toBe("Desk_Lamp.smf.webp");
    expect(webpFileName("photo.smf.webp")).toBe("photo.smf.webp");
  });

  it("requires one or two photos", () => {
    expect(listingImageCountError(0)).toMatch(/at least one/);
    expect(listingImageCountError(1)).toBeNull();
    expect(listingImageCountError(2)).toBeNull();
    expect(listingImageCountError(3)).toMatch(/at most 2/);
  });

  it("rejects files that are not photos", async () => {
    const file = new File(["notes"], "notes.pdf", { type: "application/pdf" });
    await expect(prepareListingImage(file)).rejects.toThrow(/JPEG, PNG, or WebP/);
  });

  it("resizes a photo and encodes it as webp", async () => {
    let drawnWidth = 0;
    vi.stubGlobal(
      "createImageBitmap",
      async () =>
        ({
          width: 4000,
          height: 2000,
          close() {
            return undefined;
          },
        }) satisfies Partial<ImageBitmap>,
    );

    HTMLCanvasElement.prototype.getContext = (() => ({
      drawImage(_image: unknown, _x: number, _y: number, width: number) {
        drawnWidth = width;
      },
    })) as unknown as typeof HTMLCanvasElement.prototype.getContext;

    HTMLCanvasElement.prototype.toBlob = (callback) => {
      callback(new Blob([new Uint8Array(32)], { type: "image/webp" }));
    };

    const file = new File([new Uint8Array(8)], "lamp.jpg", { type: "image/jpeg" });
    const prepared = await prepareListingImage(file);

    expect(prepared.type).toBe("image/webp");
    expect(prepared.name).toBe("lamp.smf.webp");
    expect(prepared.size).toBe(32);
    expect(drawnWidth).toBe(1600);
    expect(isPreparedListingImage(prepared)).toBe(true);
  });
});
