import { describe, expect, it } from "vitest";
import { signInSchema, signUpSchema } from "@/features/auth/schemas/authSchemas";

describe("auth schemas", () => {
  it("validates sign-in input", () => {
    expect(
      signInSchema.safeParse({
        email: "student@campus.edu",
        password: "secret1",
      }).success,
    ).toBe(true);
  });

  it("rejects incomplete sign-up input", () => {
    const result = signUpSchema.safeParse({
      email: "bad",
      password: "123",
      displayName: "A",
      institution: "",
    });
    expect(result.success).toBe(false);
  });
});
