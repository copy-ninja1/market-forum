import { Button } from "@heroui/react";
import { Link } from "react-router-dom";
import { MARKET_IMAGES } from "@/constants/marketing.constants";
import { ROUTES } from "@/constants/route.constants";
import { DocumentHead, notFoundPageSeo, useSiteSeoConfig } from "@/seo";

export function NotFoundPage() {
  const { appName, siteUrl } = useSiteSeoConfig();
  return (
    <section className="grid items-center gap-8 overflow-hidden rounded-[2rem] bg-campus-ink text-campus-paper lg:grid-cols-2">
      <DocumentHead seo={notFoundPageSeo(siteUrl, appName)} />
      <div className="px-6 py-12 md:px-10">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-white/60">404</p>
        <h1 className="font-display mt-3 text-5xl tracking-tight">Page not found</h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-white/75">
          The page you requested does not exist or may have moved. The marketplace board is still
          open.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to={ROUTES.home}>
            <Button className="bg-white text-campus-ink" variant="secondary">
              Back to home
            </Button>
          </Link>
          <Link to={ROUTES.browse}>
            <Button className="bg-white/10 text-white" variant="tertiary">
              Browse listings
            </Button>
          </Link>
        </div>
      </div>
      <img
        alt=""
        className="h-64 w-full object-cover lg:h-full"
        height={720}
        src={MARKET_IMAGES.quad}
        width={900}
      />
    </section>
  );
}
