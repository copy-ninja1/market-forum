import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as esbuild from "esbuild";

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(rootDir, "..");
const watch = process.argv.includes("--watch");

function copySsrShell() {
  const source = path.join(projectRoot, "dist", "index.html");
  if (!existsSync(source)) {
    console.warn(
      "Warning: dist/index.html missing. Run the web build before deploying SSR functions.",
    );
    return;
  }

  for (const target of [
    path.join(rootDir, "lib", "hosting", "index.html"),
    path.join(rootDir, "hosting", "index.html"),
  ]) {
    mkdirSync(path.dirname(target), { recursive: true });
    copyFileSync(source, target);
    console.log(`Copied SSR shell to ${target}`);
  }
}

/** @type {import('esbuild').BuildOptions} */
const options = {
  entryPoints: [path.join(rootDir, "src/index.ts")],
  outfile: path.join(rootDir, "lib/index.js"),
  bundle: true,
  platform: "node",
  target: "node22",
  format: "cjs",
  sourcemap: true,
  external: ["firebase-admin", "firebase-functions"],
  alias: {
    "@": path.join(projectRoot, "src"),
  },
  logLevel: "info",
};

if (watch) {
  const context = await esbuild.context(options);
  await context.watch();
} else {
  await esbuild.build(options);
  copySsrShell();
}
