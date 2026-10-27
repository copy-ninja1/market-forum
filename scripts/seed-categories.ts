/**
 * Seed default campus marketplace categories (admin SDK).
 *
 * Usage (production / staging):
 *   GOOGLE_APPLICATION_CREDENTIALS=/path/to/serviceAccount.json pnpm seed:categories
 *
 * Emulator (with Firestore emulator running):
 *   FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 \
 *   GOOGLE_APPLICATION_CREDENTIALS=/path/to/serviceAccount.json \
 *     pnpm seed:categories
 */
import { initializeApp, cert, getApps, type ServiceAccount } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { readFileSync } from "node:fs";

const DEFAULT_CATEGORIES = [
  { name: "Textbooks", slug: "textbooks", description: "Course books and study materials", sortOrder: 10 },
  { name: "Electronics", slug: "electronics", description: "Laptops, phones, and accessories", sortOrder: 20 },
  { name: "Furniture", slug: "furniture", description: "Dorm and apartment essentials", sortOrder: 30 },
  { name: "Clothing", slug: "clothing", description: "Apparel, shoes, and gear", sortOrder: 40 },
  { name: "Services", slug: "services", description: "Tutoring, moving help, and gigs", sortOrder: 50 },
  { name: "Other", slug: "other", description: "Everything else", sortOrder: 99 },
] as const;

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

function getAdminFirestore() {
  if (getApps().length === 0) {
    initializeApp({ credential: cert(resolveCredential()) });
  }
  return getFirestore();
}

async function main(): Promise<void> {
  const db = getAdminFirestore();
  const categories = db.collection("categories");

  for (const category of DEFAULT_CATEGORIES) {
    const existing = await categories.where("slug", "==", category.slug).limit(1).get();
    if (!existing.empty) {
      console.log(`Skip (exists): ${category.slug}`);
      continue;
    }

    await categories.add({
      name: category.name,
      slug: category.slug,
      description: category.description,
      sortOrder: category.sortOrder,
      isActive: true,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    console.log(`Created: ${category.slug}`);
  }

  console.log("Category seed complete.");
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
