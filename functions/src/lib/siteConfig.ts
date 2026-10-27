export function getSiteUrl(requestOrigin?: string | null): string {
  const explicit =
    process.env.PUBLIC_SITE_URL?.trim() || process.env.VITE_PUBLIC_SITE_URL?.trim();
  if (explicit) {
    return explicit.replace(/\/$/, "");
  }

  const projectId = process.env.GCLOUD_PROJECT?.trim() || process.env.GCP_PROJECT?.trim();
  if (projectId) {
    return `https://${projectId}.web.app`;
  }

  if (requestOrigin) {
    return requestOrigin.replace(/\/$/, "");
  }

  return "http://localhost:5000";
}

export function getAppName(): string {
  return process.env.VITE_APP_NAME?.trim() || process.env.APP_NAME?.trim() || "Student Market Forum";
}
