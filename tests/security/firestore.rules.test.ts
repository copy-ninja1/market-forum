/**
 * Firestore security rule tests (Firebase Emulator Suite).
 *
 * Prerequisites:
 * 1. `firebase emulators:exec --only firestore "pnpm test:security"`
 *    or start emulators and set FIRESTORE_EMULATOR_HOST=127.0.0.1:8080
 * 2. Project ID can be any local string when using emulators.
 *
 * These tests are excluded from the default vitest run (see vite.config.ts).
 */
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { afterAll, beforeAll, beforeEach, describe, it } from "vitest";

const PROJECT_ID = "student-market-forum-test";

let testEnv: RulesTestEnvironment;

function listingPayload(ownerUid: string) {
  return {
    ownerUid,
    ownerDisplayName: "Owner",
    title: "Campus bike",
    description: "A reliable bike for getting across campus quickly.",
    categoryId: "cat-1",
    categoryName: "Transport",
    price: 120,
    currencyCode: "USD",
    condition: "good",
    locationLabel: "East Gate",
    images: [],
    contactType: "email",
    contactValue: "owner@campus.edu",
    status: "active",
    searchKeywords: ["campus", "bike"],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
}

describe("firestore.rules", () => {
  beforeAll(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: PROJECT_ID,
      firestore: {
        rules: readFileSync(resolve(process.cwd(), "firestore.rules"), "utf8"),
        host: "127.0.0.1",
        port: 8080,
      },
    });
  });

  afterAll(async () => {
    await testEnv.cleanup();
  });

  beforeEach(async () => {
    await testEnv.clearFirestore();
  });

  it("allows visitors to read active listings", async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await setDoc(doc(context.firestore(), "listings/listing-1"), listingPayload("owner-1"));
      await setDoc(doc(context.firestore(), "users/owner-1"), {
        uid: "owner-1",
        displayName: "Owner",
        email: "owner@campus.edu",
        institution: "Campus U",
        avatarUrl: null,
        preferredContactType: "email",
        preferredContactValue: "owner@campus.edu",
        accountStatus: "active",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    });

    const visitor = testEnv.unauthenticatedContext();
    await assertSucceeds(getDoc(doc(visitor.firestore(), "listings/listing-1")));
  });

  it("denies visitors from creating listings", async () => {
    const visitor = testEnv.unauthenticatedContext();
    await assertFails(
      setDoc(doc(visitor.firestore(), "listings/listing-2"), listingPayload("intruder")),
    );
  });

  it("allows owners to create their own listings when account is active", async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await setDoc(doc(context.firestore(), "users/owner-1"), {
        uid: "owner-1",
        displayName: "Owner",
        email: "owner@campus.edu",
        institution: "Campus U",
        avatarUrl: null,
        preferredContactType: "email",
        preferredContactValue: "owner@campus.edu",
        accountStatus: "active",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    });

    const owner = testEnv.authenticatedContext("owner-1");
    await assertSucceeds(
      setDoc(doc(owner.firestore(), "listings/listing-owned"), listingPayload("owner-1")),
    );
  });

  it("denies non-owners from updating another user's listing", async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await setDoc(doc(context.firestore(), "listings/listing-1"), listingPayload("owner-1"));
      await setDoc(doc(context.firestore(), "users/other-user"), {
        uid: "other-user",
        displayName: "Other",
        email: "other@campus.edu",
        institution: "Campus U",
        avatarUrl: null,
        preferredContactType: "email",
        preferredContactValue: "other@campus.edu",
        accountStatus: "active",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    });

    const other = testEnv.authenticatedContext("other-user");
    await assertFails(
      updateDoc(doc(other.firestore(), "listings/listing-1"), {
        title: "Hijacked title",
        updatedAt: serverTimestamp(),
      }),
    );
  });

  it("denies non-admins from reading reports", async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await setDoc(doc(context.firestore(), "reports/report-1"), {
        listingId: "listing-1",
        reporterUid: "reporter-1",
        reasonCode: "spam",
        details: "Looks suspicious",
        status: "open",
        createdAt: serverTimestamp(),
        reviewedAt: null,
        reviewedByUid: null,
        moderationAction: "none",
        moderationReason: null,
      });
    });

    const stranger = testEnv.authenticatedContext("stranger");
    await assertFails(getDoc(doc(stranger.firestore(), "reports/report-1")));
  });

  it("allows admins to read reports", async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await setDoc(doc(context.firestore(), "reports/report-1"), {
        listingId: "listing-1",
        reporterUid: "reporter-1",
        reasonCode: "spam",
        details: "Looks suspicious",
        status: "open",
        createdAt: serverTimestamp(),
        reviewedAt: null,
        reviewedByUid: null,
        moderationAction: "none",
        moderationReason: null,
      });
    });

    const admin = testEnv.authenticatedContext("admin-1", { admin: true });
    await assertSucceeds(getDoc(doc(admin.firestore(), "reports/report-1")));
  });

  it("prevents users from deleting arbitrary listings they do not own", async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await setDoc(doc(context.firestore(), "listings/listing-1"), listingPayload("owner-1"));
    });

    const other = testEnv.authenticatedContext("other-user");
    await assertFails(deleteDoc(doc(other.firestore(), "listings/listing-1")));
  });
});
