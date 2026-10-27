import { readFileSync } from "node:fs";
import { join } from "node:path";
import { onRequest } from "firebase-functions/v2/https";
import { injectSeoIntoHtml } from "@/seo/injectSeoIntoHtml";
import { absoluteUrl } from "@/seo/absoluteUrl";
import { listActiveListingSitemapEntries } from "./lib/fetchPublicListing";
import { getAppName, getSiteUrl } from "./lib/siteConfig";
import { resolveSeoForPath } from "./resolveSeoForPath";

function loadSpaShell(): string {
  const candidates = [
    join(__dirname, "hosting", "index.html"),
    join(__dirname, "..", "hosting", "index.html"),
    join(process.cwd(), "lib", "hosting", "index.html"),
    join(process.cwd(), "hosting", "index.html"),
  ];

  for (const candidate of candidates) {
    try {
      return readFileSync(candidate, "utf8");
    } catch {
      // try next
    }
  }

  throw new Error(
    "SSR shell missing. Run the web build so dist/index.html is copied to functions/hosting/index.html.",
  );
}

function requestOrigin(req: { headers: Record<string, unknown>; protocol?: string }): string | null {
  const forwardedProto = req.headers["x-forwarded-proto"];
  const proto =
    typeof forwardedProto === "string"
      ? forwardedProto.split(",")[0]?.trim()
      : req.protocol || "https";
  const hostHeader = req.headers["x-forwarded-host"] ?? req.headers.host;
  const host = Array.isArray(hostHeader) ? hostHeader[0] : hostHeader;
  if (typeof host !== "string" || !host) {
    return null;
  }
  return `${proto}://${host}`;
}

export const ssrPublic = onRequest(
  {
    region: "us-central1",
    memory: "512MiB",
    timeoutSeconds: 30,
    cors: false,
  },
  async (req, res) => {
    if (req.method !== "GET" && req.method !== "HEAD") {
      res.set("Allow", "GET, HEAD");
      res.status(405).send("Method Not Allowed");
      return;
    }

    try {
      const origin = requestOrigin(req);
      const siteUrl = getSiteUrl(origin);
      const appName = getAppName();
      const pathname = req.path || "/";
      const search = typeof req.url === "string" && req.url.includes("?")
        ? req.url.slice(req.url.indexOf("?"))
        : "";

      const { seo, status } = await resolveSeoForPath(pathname, search, siteUrl, appName);
      const html = injectSeoIntoHtml(loadSpaShell(), seo);

      res.set("Cache-Control", "public, max-age=60, s-maxage=300, stale-while-revalidate=86400");
      res.set("Content-Type", "text/html; charset=utf-8");
      res.status(status);

      if (req.method === "HEAD") {
        res.end();
        return;
      }

      res.send(html);
    } catch (error) {
      console.error("ssrPublic failed", error);
      res.status(500).send("Internal Server Error");
    }
  },
);

export const sitemap = onRequest(
  {
    region: "us-central1",
    memory: "256MiB",
    timeoutSeconds: 60,
    cors: false,
  },
  async (req, res) => {
    if (req.method !== "GET" && req.method !== "HEAD") {
      res.set("Allow", "GET, HEAD");
      res.status(405).send("Method Not Allowed");
      return;
    }

    try {
      const origin = requestOrigin(req);
      const siteUrl = getSiteUrl(origin);
      const listings = await listActiveListingSitemapEntries();
      const staticPaths = ["/", "/browse"] as const;
      const lastmod = new Date().toISOString();

      const urls = [
        ...staticPaths.map(
          (path) => `  <url>
    <loc>${absoluteUrl(path, siteUrl)}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`,
        ),
        ...listings.map(
          (listing) => `  <url>
    <loc>${absoluteUrl(`/listings/${listing.id}`, siteUrl)}</loc>
    <lastmod>${listing.updatedAtIso}</lastmod>
  </url>`,
        ),
      ];

      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>
`;

      res.set("Cache-Control", "public, max-age=300, s-maxage=3600");
      res.set("Content-Type", "application/xml; charset=utf-8");
      res.status(200);

      if (req.method === "HEAD") {
        res.end();
        return;
      }

      res.send(xml);
    } catch (error) {
      console.error("sitemap failed", error);
      res.status(500).send("Internal Server Error");
    }
  },
);
