import { describe, expect, it } from "vitest";
import { validateImageFile } from "@/utils/file.utils";

describe("validateImageFile", () => {
  it("accepts allowed image types under size limit", () => {
    const file = new File(["abcdef"], "photo.png", { type: "image/png" });
    expect(validateImageFile(file)).toEqual({ ok: true });
  });

  it("rejects unsupported mime types", () => {
    const file = new File(["abcdef"], "notes.pdf", { type: "application/pdf" });
    const result = validateImageFile(file);
    expect(result.ok).toBe(false);
  });

  it("rejects oversized files", () => {
    const large = new File([new Uint8Array(5 * 1024 * 1024 + 1)], "big.jpg", {
      type: "image/jpeg",
    });
    const result = validateImageFile(large);
    expect(result.ok).toBe(false);
  });
});
