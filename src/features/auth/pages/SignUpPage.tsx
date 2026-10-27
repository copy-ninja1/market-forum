import { SignUpForm } from "@/features/auth/components/SignUpForm";
import { DocumentHead, signUpPageSeo, useSiteSeoConfig } from "@/seo";

export function SignUpPage() {
  const { appName, siteUrl } = useSiteSeoConfig();
  return (
    <>
      <DocumentHead seo={signUpPageSeo(siteUrl, appName)} />
      <SignUpForm />
    </>
  );
}
