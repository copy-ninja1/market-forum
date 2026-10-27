/**
 * Storage security rule tests.
 *
 * Requires Storage emulator + JDK 21+:
 *   firebase emulators:exec --only storage "pnpm test:security"
 */
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { ref, uploadBytes, deleteObject } from "firebase/storage";
import { afterAll, beforeAll, beforeEach, describe, it } from "vitest";

const PROJECT_ID = "student-market-forum-storage-test";

let testEnv: RulesTestEnvironment;

describe("storage.rules", () => {
  beforeAll(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: PROJECT_ID,
      storage: {
        rules: readFileSync(resolve(process.cwd(), "storage.rules"), "utf8"),
        host: "127.0.0.1",
        port: 9199,
      },
    });
  });

  afterAll(async () => {
    await testEnv.cleanup();
  });

  beforeEach(async () => {
    await testEnv.clearStorage();
  });

  it("allows owners to upload valid listing images", async () => {
    const owner = testEnv.authenticatedContext("owner-1");
    const storageRef = ref(
      owner.storage(),
      "listings/owner-1/listing-1/photo.jpg",
    );
    const bytes = new Uint8Array([1, 2, 3, 4]);
    await assertSucceeds(
      uploadBytes(storageRef, bytes, { contentType: "image/jpeg" }),
    );
  });

  it("denies non-owners from uploading into another user's path", async () => {
    const other = testEnv.authenticatedContext("other-user");
    const storageRef = ref(
      other.storage(),
      "listings/owner-1/listing-1/photo.jpg",
    );
    const bytes = new Uint8Array([1, 2, 3, 4]);
    await assertFails(
      uploadBytes(storageRef, bytes, { contentType: "image/jpeg" }),
    );
  });

  it("denies unsupported content types", async () => {
    const owner = testEnv.authenticatedContext("owner-1");
    const storageRef = ref(
      owner.storage(),
      "listings/owner-1/listing-1/notes.pdf",
    );
    const bytes = new Uint8Array([1, 2, 3, 4]);
    await assertFails(
      uploadBytes(storageRef, bytes, { contentType: "application/pdf" }),
    );
  });

  it("allows admins to delete listing images", async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      const storageRef = ref(
        context.storage(),
        "listings/owner-1/listing-1/photo.jpg",
      );
      await uploadBytes(storageRef, new Uint8Array([1, 2, 3]), {
        contentType: "image/jpeg",
      });
    });

    const admin = testEnv.authenticatedContext("admin-1", { admin: true });
    await assertSucceeds(
      deleteObject(ref(admin.storage(), "listings/owner-1/listing-1/photo.jpg")),
    );
  });
});
