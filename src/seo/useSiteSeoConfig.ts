import { APP_NAME } from "@/constants/app.constants";
import { getPublicSiteUrl } from "@/seo/siteUrl";

export function useSiteSeoConfig() {
  return {
    appName: APP_NAME,
    siteUrl: getPublicSiteUrl(),
  };
}
