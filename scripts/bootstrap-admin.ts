/**
 * Grant Firebase Auth custom admin claim for a user.
 *
 * Usage:
 *   GOOGLE_APPLICATION_CREDENTIALS=/path/to/serviceAccount.json \
 *     pnpm bootstrap:admin -- email@campus.edu
 *
 *   GOOGLE_APPLICATION_CREDENTIALS=/path/to/serviceAccount.json \
 *     pnpm bootstrap:admin -- <firebase-auth-uid>
 *
 * Emulator:
 *   FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 \
 *   FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099 \
 *   GOOGLE_APPLICATION_CREDENTIALS=/path/to/serviceAccount.json \
 *     pnpm bootstrap:admin -- email@campus.edu
 *
 * Never commit service account JSON or paste credentials into the repo.
 */
import { initializeApp, cert, getApps, type ServiceAccount } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { readFileSync } from "node:fs";

function resolveCredential(): ServiceAccount {
  const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim();
  if (!credentialsPath) {
    throw new Error(
      "Set GOOGLE_APPLICATION_CREDENTIALS to a service account JSON file path.",
    );
  }

  const raw = readFileSync(credentialsPath, "utf8");
  return JSON.parse(raw) as ServiceAccount;
}

function getAdminAuth() {
  if (getApps().length === 0) {
    initializeApp({ credential: cert(resolveCredential()) });
  }
  return getAuth();
}

async function main() {
  const identifier = process.argv.slice(2).find((arg) => arg !== "--")?.trim();
  if (!identifier) {
    console.error("Provide a user email or UID: pnpm bootstrap:admin -- user@example.com");
    process.exitCode = 1;
    return;
  }

  const auth = getAdminAuth();
  const user = identifier.includes("@")
    ? await auth.getUserByEmail(identifier)
    : await auth.getUser(identifier);

  await auth.setCustomUserClaims(user.uid, { admin: true });
  console.log(`Admin claim set for ${user.email ?? user.uid} (${user.uid}).`);
  console.log("User must sign out and sign in again for claims to refresh in the client.");
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
