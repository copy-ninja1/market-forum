import { PasswordResetForm } from "@/features/auth/components/PasswordResetForm";
import { DocumentHead, passwordResetPageSeo, useSiteSeoConfig } from "@/seo";

export function PasswordResetPage() {
  const { appName, siteUrl } = useSiteSeoConfig();
  return (
    <>
      <DocumentHead seo={passwordResetPageSeo(siteUrl, appName)} />
      <PasswordResetForm />
    </>
  );
}
