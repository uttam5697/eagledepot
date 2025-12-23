// components/SeoMeta.tsx
import { Helmet } from "react-helmet-async";
import { useFooter, useProductCategories } from "../api/home";
import { useMatch, useLocation } from "react-router-dom";
import { paths } from "../config/path";

const SeoMeta = () => {
  const { data: generaldata } = useFooter(false);
  const location = useLocation();

  // Detect category SEO
  const categoryMatch = useMatch(paths.product.category.path);
  const categoryId = categoryMatch?.params?.id;

  const { data: productCategories } = useProductCategories();

  const activeCategoryMeta =
    categoryId &&
    productCategories?.find(
      (category: any) =>
        String(category?.product_category_id) === String(categoryId)
    );

  const metaSource = activeCategoryMeta ?? generaldata;

  const title =
    metaSource?.meta_title ||
    "Eagle Flooring Depot – SPC and LVT flooring for less";

  const description =
    metaSource?.meta_description ||
    "Eagle Flooring offers top-quality SPC vinyl floor installation in South Florida. Durable, stylish, and affordable—request your free estimate today.";

  const keywords =
    metaSource?.meta_tag ||
    "SPC vinyl flooring, vinyl floor installation, vinyl flooring South Florida, waterproof flooring, durable vinyl floors, free flooring estimate";

  const baseUrl = "https://eagleflooringdepot.com";
  const currentUrl = `${baseUrl}${location.pathname}`;

  // Structured Data for Local Business
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Eagle Flooring Depot",
    "description": description,
    "url": baseUrl,
    "telephone": "+17326938078",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "93 Joline Ave",
      "addressLocality": "Long Branch",
      "addressRegion": "NJ",
      "postalCode": "07740",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "40.3136148",
      "longitude": "-73.9813753"
    },
    "openingHours": [
      "Mo-Fr 08:00-18:00",
      "Sa 09:00-17:00"
    ],
    "serviceArea": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": "40.3136148",
        "longitude": "-73.9813753"
      },
      "geoRadius": "50000"
    },
    "priceRange": "$$",
    "image": `${baseUrl}/fav-icon/android-icon-192x192.png`,
    "sameAs": [
      "https://www.facebook.com/eagleflooringdepot",
      "https://www.instagram.com/eagleflooringdepot"
    ]
  };

  return (
    <Helmet>
      {/* Basic SEO */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content="index, follow" />

      {/* Canonical Tag */}
      <link rel="canonical" href={currentUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={`${baseUrl}/fav-icon/android-icon-192x192.png`} />
      <meta property="og:site_name" content="Eagle Flooring Depot" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${baseUrl}/fav-icon/android-icon-192x192.png`} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export default SeoMeta;
