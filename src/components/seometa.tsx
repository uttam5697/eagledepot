// components/SeoMeta.tsx
import { Helmet } from "react-helmet-async";
import { useFooter } from "../api/home";
import { useEffect } from "react";

const SeoMeta = () => {
  const { data: generaldata, isLoading, error } = useFooter(false);

  // Debug logging
  console.log("SeoMeta - generaldata:", generaldata);
  console.log("SeoMeta - isLoading:", isLoading);
  console.log("SeoMeta - error:", error);
  console.log("SeoMeta - meta_title:", generaldata?.meta_title);
  console.log("SeoMeta - meta_description:", generaldata?.meta_description);
  console.log("SeoMeta - meta_tag:", generaldata?.meta_tag);

  // Use API data with fallbacks
  const title = generaldata?.meta_title || "Eagle Flooring Depot – SPC and LVT flooring for less";
  const description = generaldata?.meta_description || "Upper Level Flooring offers top-quality SPC vinyl floor installation in South Florida. Durable, stylish, and affordable—request your free estimate today.";
  const keywords = generaldata?.meta_tag || "SPC vinyl flooring, vinyl floor installation, vinyl flooring South Florida, waterproof flooring, durable vinyl floors, free flooring estimate";

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

      console.log("Direct meta tags updated:");
      console.log("- Title:", document.title);
      console.log("- Description:", description);
      console.log("- Keywords:", keywords);
      
      // Verify meta tags were actually set
      const verifyDescription = document.querySelector('meta[name="description"]');
      const verifyKeywords = document.querySelector('meta[name="keywords"]');
      console.log("Verification:");
      console.log("- Meta description found:", verifyDescription?.getAttribute('content'));
      console.log("- Meta keywords found:", verifyKeywords?.getAttribute('content'));
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