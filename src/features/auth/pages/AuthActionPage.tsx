import { AuthActionPanel } from "@/features/auth/components/AuthActionPanel";
import { DocumentHead, authActionPageSeo, useSiteSeoConfig } from "@/seo";

export function AuthActionPage() {
  const { appName, siteUrl } = useSiteSeoConfig();
  return (
    <>
      <DocumentHead seo={authActionPageSeo(siteUrl, appName)} />
      <AuthActionPanel />
    </>
  );
}
