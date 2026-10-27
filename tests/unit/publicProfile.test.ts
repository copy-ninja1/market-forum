import { describe, expect, it } from "vitest";
import type { UserProfile } from "@/features/auth/types/auth.interfaces";
import { toPublicProfile } from "@/features/profiles/lib/publicProfile";

const profile: UserProfile = {
  uid: "member-1",
  displayName: "Ada Lovelace",
  email: "ada@campus.edu",
  institution: "North Campus",
  avatarUrl: null,
  preferredContactType: "email",
  preferredContactValue: "ada@campus.edu",
  accountStatus: "active",
  createdAt: new Date("2026-01-15T12:00:00.000Z"),
  updatedAt: new Date("2026-02-01T12:00:00.000Z"),
};

describe("toPublicProfile", () => {
  it("publishes identity fields and omits private contact data", () => {
    const publicProfile = toPublicProfile(profile);

    expect(publicProfile).toEqual({
      uid: "member-1",
      displayName: "Ada Lovelace",
      institution: "North Campus",
      avatarUrl: null,
      accountStatus: "active",
      createdAt: profile.createdAt,
    });
    expect(publicProfile).not.toHaveProperty("email");
    expect(publicProfile).not.toHaveProperty("preferredContactValue");
    expect(publicProfile).not.toHaveProperty("preferredContactType");
  });
});
