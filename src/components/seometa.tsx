// components/SeoMeta.tsx
import { Helmet } from "react-helmet-async";
import { useFooter } from "../api/home";
import { useEffect } from "react";

const SeoMeta = () => {
  const { data: generaldata } = useFooter(false);



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