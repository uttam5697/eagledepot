import { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface SEOData {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  type?: string;
}

export const useSEO = (seoData: SEOData) => {
  const location = useLocation();
  const baseUrl = "https://eagleflooringdepot.com";

  useEffect(() => {
    // Update page title
    if (seoData.title) {
      document.title = seoData.title;
    }

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription && seoData.description) {
      metaDescription.setAttribute("content", seoData.description);
    }

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", `${baseUrl}${location.pathname}`);

    // Update Open Graph tags
    const updateOGTag = (property: string, content: string) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("property", property);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    if (seoData.title) updateOGTag("og:title", seoData.title);
    if (seoData.description) updateOGTag("og:description", seoData.description);
    if (seoData.image) updateOGTag("og:image", seoData.image);
    updateOGTag("og:url", `${baseUrl}${location.pathname}`);
    updateOGTag("og:type", seoData.type || "website");
  }, [seoData, location.pathname]);
};

// SEO configurations for different pages
export const seoConfigs = {
  home: {
    title: "Eagle Flooring Depot | SPC & LVT Flooring in South Florida",
    description:
      "SPC and LVT flooring in South Florida. Durable, stylish vinyl options with expert installation. Get a free estimate.",
    keywords:
      "SPC vinyl flooring, LVT flooring, vinyl floor installation, South Florida flooring, waterproof flooring, free estimate",
    type: "website"
  },
  products: {
    title: "SPC & LVT Vinyl Flooring Products | Eagle Flooring Depot",
    description:
      "Shop SPC and LVT vinyl flooring. Waterproof, durable, and stylish options for every home and budget.",
    keywords:
      "vinyl flooring products, SPC flooring, LVT flooring, waterproof flooring, luxury vinyl tiles",
    type: "website"
  },
  installation: {
    title: "South Florida Vinyl Installation | Eagle Flooring Depot",
    description:
      "Professional vinyl flooring installation in South Florida. Reliable, affordable service. Get a free estimate.",
    keywords:
      "vinyl flooring installation, South Florida flooring, flooring contractors, professional installers",
    type: "service"
  },
  aboutUs: {
    title: "About Eagle Flooring Depot | South Florida Vinyl Flooring",
    description:
      "Learn about Eagle Flooring Depot, South Florida's vinyl flooring specialists. Quality products, expert installation, exceptional service.",
    keywords:
      "about eagle flooring depot, flooring company South Florida, vinyl flooring specialists",
    type: "website"
  },
  contactUs: {
    title: "Contact Eagle Flooring Depot | Free Flooring Estimates",
    description:
      "Contact Eagle Flooring Depot for a free flooring estimate in South Florida.",
    keywords:
      "contact flooring company, free flooring estimate, South Florida flooring contact",
    type: "website"
  }
};
