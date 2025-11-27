// components/SeoMeta.tsx
import { Helmet } from "react-helmet-async";
import { useFooter, useProductCategories } from "../api/home";
import { useEffect } from "react";
import { useMatch } from "react-router-dom";
import { paths } from "../config/path";

const SeoMeta = () => {
  const { data: generaldata } = useFooter(false);
  const categoryMatch = useMatch(paths.product.category.path);
  const categoryId = categoryMatch?.params?.id;
  const shouldLoadCategoryMeta = Boolean(categoryId);
  const { data: productCategories } = useProductCategories(!shouldLoadCategoryMeta);
  const activeCategoryMeta = shouldLoadCategoryMeta
    ? productCategories?.find(
        (category: any) =>
          String(category?.product_category_id) === String(categoryId)
      )
    : undefined;

  const metaSource = activeCategoryMeta ?? generaldata;

  // Use API data with fallbacks
  const title =
    metaSource?.meta_title ||
    "Eagle Flooring Depot – SPC and LVT flooring for less";
  const description =
    metaSource?.meta_description ||
    "Upper Level Flooring offers top-quality SPC vinyl floor installation in South Florida. Durable, stylish, and affordable—request your free estimate today.";
  const keywords =
    metaSource?.meta_tag ||
    "SPC vinyl flooring, vinyl floor installation, vinyl flooring South Florida, waterproof flooring, durable vinyl floors, free flooring estimate";

  // Force update meta tags directly
  useEffect(() => {
    if (typeof document !== 'undefined') {
      // Update title
      document.title = title;
      
      // Update or create meta description
      let metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', description);
      } else {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        metaDescription.setAttribute('content', description);
        document.head.appendChild(metaDescription);
      }

      // Update or create meta keywords
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) {
        metaKeywords.setAttribute('content', keywords);
      } else {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        metaKeywords.setAttribute('content', keywords);
        document.head.appendChild(metaKeywords);
      }

      
      
      
      
    }
  }, [title, description, keywords]);

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta
          name="description"
          content={description}
        />
        <meta
          name="keywords"
          content={keywords}
        />
        {/* Open Graph (for social media) */}
        <meta property="og:title" content={title} />
        <meta
          property="og:description"
          content={description}
        />
        <meta property="og:type" content="website" />
      </Helmet>
    </>
  );
};

export default SeoMeta;