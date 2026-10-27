import { useEffect } from "react";

/**
 * Removes the server-injected `#seo-ssr` crawler fallback once the SPA has hydrated.
 */
export function SeoSsrCleanup() {
  useEffect(() => {
    document.getElementById("seo-ssr")?.remove();
  }, []);

  return null;
}
