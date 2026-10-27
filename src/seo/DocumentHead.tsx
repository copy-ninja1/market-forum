import { Helmet } from "react-helmet-async";
import type { ResolvedPageSeo } from "@/seo/seo.types";

type DocumentHeadProps = {
  readonly seo: ResolvedPageSeo;
};

export function DocumentHead({ seo }: DocumentHeadProps) {
  return (
    <Helmet prioritizeSeoTags>
      <html lang="en" />
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta name="robots" content={seo.robots} />
      <link rel="canonical" href={seo.canonicalUrl} />
      <meta property="og:type" content={seo.type} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:url" content={seo.canonicalUrl} />
      <meta property="og:image" content={seo.imageUrl} />
      <meta property="og:image:alt" content={seo.imageAlt} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={seo.imageUrl} />
      {seo.jsonLd.map((node, index) => (
        <script
          // Stable per-page schemas; index is safe because the array is page-owned and ordered.
          key={`jsonld-${index}`}
          type="application/ld+json"
        >
          {JSON.stringify(node)}
        </script>
      ))}
    </Helmet>
  );
}
