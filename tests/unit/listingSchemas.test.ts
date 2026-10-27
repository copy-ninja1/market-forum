import { describe, expect, it } from "vitest";
import { listingFormSchema, listingImagesSchema } from "@/features/listings/schemas/listingSchemas";

describe("listingFormSchema", () => {
  it("accepts a valid listing payload", () => {
    const result = listingFormSchema.safeParse({
      title: "Desk lamp",
      description: "Bright LED desk lamp in working condition.",
      categoryId: "cat-1",
      price: 15,
      currencyCode: "NGN",
      condition: "good",
      locationLabel: "North dorm",
      contactType: "email",
      contactValue: "student@campus.edu",
    });

    expect(result.success).toBe(true);
  });

  it("rejects currencies other than naira", () => {
    const result = listingFormSchema.safeParse({
      title: "Desk lamp",
      description: "Bright LED desk lamp in working condition.",
      categoryId: "cat-1",
      price: 1500,
      currencyCode: "USD",
      condition: "good",
      locationLabel: "North dorm",
      contactType: "email",
      contactValue: "student@campus.edu",
    });

    expect(result.success).toBe(false);
  });

  it("requires one or two listing photos", () => {
    const photo = {
      url: "https://example.com/lamp.webp",
      storagePath: "listings/user/listing/lamp.smf.webp",
      altText: "Desk lamp",
    };

    expect(listingImagesSchema.safeParse([]).success).toBe(false);
    expect(listingImagesSchema.safeParse([photo]).success).toBe(true);
    expect(listingImagesSchema.safeParse([photo, photo]).success).toBe(true);
    expect(listingImagesSchema.safeParse([photo, photo, photo]).success).toBe(false);
  });

  it("rejects short titles and invalid currency", () => {
    const result = listingFormSchema.safeParse({
      title: "ab",
      description: "Too short",
      categoryId: "",
      price: -1,
      currencyCode: "us",
      condition: "good",
      locationLabel: "a",
      contactType: "email",
      contactValue: "x",
    });

    expect(result.success).toBe(false);
  });
});
