import { describe, expect, it } from "vitest";
import { listingFormSchema } from "@/features/listings/schemas/listingSchemas";

describe("listingFormSchema", () => {
  it("accepts a valid listing payload", () => {
    const result = listingFormSchema.safeParse({
      title: "Desk lamp",
      description: "Bright LED desk lamp in working condition.",
      categoryId: "cat-1",
      price: 15,
      currencyCode: "USD",
      condition: "good",
      locationLabel: "North dorm",
      contactType: "email",
      contactValue: "student@campus.edu",
    });

    expect(result.success).toBe(true);
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
