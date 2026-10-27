import { Button } from "@heroui/react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/route.constants";
import { DocumentHead, forbiddenPageSeo, useSiteSeoConfig } from "@/seo";

export function ForbiddenPage() {
  const { appName, siteUrl } = useSiteSeoConfig();
  return (
    <section className="panel mx-auto max-w-2xl px-6 py-14 text-center md:px-12">
      <DocumentHead seo={forbiddenPageSeo(siteUrl, appName)} />
      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-campus-leaf">
        Restricted
      </p>
      <h1 className="font-display mt-3 text-5xl tracking-tight text-campus-ink">Access denied</h1>
      <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-campus-ink/70">
        Admin tools are limited to moderator accounts. A profile edit cannot grant that access.
      </p>
      <div className="mt-8 flex justify-center">
        <Link to={ROUTES.home}>
          <Button variant="primary">Back to home</Button>
        </Link>
      </div>
    </section>
  );
}
