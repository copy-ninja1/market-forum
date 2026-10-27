import { copyFileSync, mkdirSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(rootDir, "..");
const source = path.join(projectRoot, "dist", "index.html");

/** Copied beside the functions bundle so Firebase deploy always includes it. */
const targets = [
  path.join(projectRoot, "functions", "lib", "hosting", "index.html"),
  path.join(projectRoot, "functions", "hosting", "index.html"),
];

if (!existsSync(source)) {
  console.error(`Missing ${source}. Run vite build before copy-ssr-shell.`);
  process.exit(1);
}

for (const target of targets) {
  mkdirSync(path.dirname(target), { recursive: true });
  copyFileSync(source, target);
  console.log(`Copied SSR shell to ${target}`);
}
