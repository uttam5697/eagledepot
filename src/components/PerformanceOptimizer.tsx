import { useEffect } from 'react';

const PerformanceOptimizer = () => {
  useEffect(() => {
    // Preload critical resources
    const preloadCriticalResources = () => {
      const criticalImages = [
        '/fav-icon/android-icon-192x192.png',
        '/assets/images/herobanner/herobanner-img.png'
      ];

      criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
      });
    };

    // Lazy load non-critical images
    const lazyLoadImages = () => {
      const images = document.querySelectorAll('img[data-src]');
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            img.src = img.dataset.src!;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        });
      });

      images.forEach(img => imageObserver.observe(img));
    };

    // Add structured data for website
    const addWebsiteStructuredData = () => {
      const existingScript = document.querySelector('script[type="application/ld+json"][data-website]');
      if (!existingScript) {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.setAttribute('data-website', 'true');
        script.textContent = JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Eagle Flooring Depot",
          "url": "https://eagleflooringdepot.com",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://eagleflooringdepot.com/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        });
        document.head.appendChild(script);
      }
    };

    // Optimize Core Web Vitals
    const optimizeCoreWebVitals = () => {
      // Preconnect to external domains
      const preconnectDomains = [
        'https://fonts.googleapis.com',
        'https://maps.googleapis.com',
        'https://js.stripe.com'
      ];

      preconnectDomains.forEach(domain => {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = domain;
        document.head.appendChild(link);
      });
    };

    preloadCriticalResources();
    lazyLoadImages();
    addWebsiteStructuredData();
    optimizeCoreWebVitals();

    // Cleanup function
    return () => {
      // Remove any observers or listeners if needed
    };
  }, []);

  return null; // This component doesn't render anything
};

export default PerformanceOptimizer;