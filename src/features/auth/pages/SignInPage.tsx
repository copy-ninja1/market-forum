import { SignInForm } from "@/features/auth/components/SignInForm";
import { DocumentHead, signInPageSeo, useSiteSeoConfig } from "@/seo";

export function SignInPage() {
  const { appName, siteUrl } = useSiteSeoConfig();
  return (
    <>
      <DocumentHead seo={signInPageSeo(siteUrl, appName)} />
      <SignInForm />
    </>
  );
}
