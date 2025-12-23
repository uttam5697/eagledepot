import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOData {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  type?: string;
}

export const useSEO = (seoData: SEOData) => {
  const location = useLocation();
  const baseUrl = 'https://eagleflooringdepot.com';

  useEffect(() => {
    // Update page title
    if (seoData.title) {
      document.title = seoData.title;
    }

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription && seoData.description) {
      metaDescription.setAttribute('content', seoData.description);
    }

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', `${baseUrl}${location.pathname}`);

    // Update Open Graph tags
    const updateOGTag = (property: string, content: string) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    if (seoData.title) updateOGTag('og:title', seoData.title);
    if (seoData.description) updateOGTag('og:description', seoData.description);
    if (seoData.image) updateOGTag('og:image', seoData.image);
    updateOGTag('og:url', `${baseUrl}${location.pathname}`);
    updateOGTag('og:type', seoData.type || 'website');

  }, [seoData, location.pathname]);
};

// SEO configurations for different pages
export const seoConfigs = {
  home: {
    title: 'Eagle Flooring Depot – Premium SPC & LVT Flooring Installation in South Florida',
    description: 'Eagle Flooring offers top-quality SPC vinyl floor installation in South Florida. Durable, stylish, and affordable—request your free estimate today.',
    keywords: 'SPC vinyl flooring, vinyl floor installation, vinyl flooring South Florida, waterproof flooring, durable vinyl floors, free flooring estimate',
    type: 'website'
  },
  products: {
    title: 'Premium Vinyl Flooring Products | SPC & LVT Flooring | Eagle Flooring Depot',
    description: 'Browse our extensive collection of premium SPC and LVT vinyl flooring. Waterproof, durable, and stylish options for every home and budget.',
    keywords: 'vinyl flooring products, SPC flooring, LVT flooring, waterproof flooring, luxury vinyl tiles',
    type: 'website'
  },
  installation: {
    title: 'Professional Vinyl Flooring Installation Services | South Florida | Eagle Flooring',
    description: 'Expert vinyl flooring installation services in South Florida. Professional, reliable, and affordable. Get your free estimate today.',
    keywords: 'vinyl flooring installation, professional flooring installation, South Florida flooring, flooring contractors',
    type: 'service'
  },
  aboutUs: {
    title: 'About Eagle Flooring Depot | Premium Flooring Solutions South Florida',
    description: 'Learn about Eagle Flooring Depot, South Florida\'s trusted vinyl flooring specialists. Quality products, expert installation, exceptional service.',
    keywords: 'about eagle flooring, flooring company South Florida, vinyl flooring specialists',
    type: 'website'
  },
  contactUs: {
    title: 'Contact Eagle Flooring Depot | Free Flooring Estimates | South Florida',
    description: 'Contact Eagle Flooring Depot for your free flooring estimate. Serving South Florida with premium vinyl flooring solutions.',
    keywords: 'contact flooring company, free flooring estimate, South Florida flooring contact',
    type: 'website'
  }
};