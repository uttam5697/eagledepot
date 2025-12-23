import React, { useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import SpsFlooring from "./spsflooring/SpsFlooring";
import WeeklyBestsellers from "./weeklybestsellers/WeeklyBestsellers";
import HeroSlider from "./heroslider/HeroSlider";
import WhatOurClients from "./whatourclients/WhatOurClients";
import { useHome } from "../api/home";
import AnimatedSection from "./ui/AnimatedSection";
import { useLocation } from "react-router-dom";
import { seoConfigs } from "../hook/useSEO";
// import HearthWidget from "./HearthWidget";
import HearthBanner from "./HearthWidget";

const Home: React.FC = () => {
  const { data: homescreenData } = useHome(false);
  const location = useLocation();
  const thirdSectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (location.search === "?product" && thirdSectionRef.current) {
      thirdSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);

  const homeStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Eagle Flooring Depot",
    "url": "https://eagleflooringdepot.com",
    "logo": "https://eagleflooringdepot.com/fav-icon/android-icon-192x192.png",
    "description": seoConfigs.home.description,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "South Florida",
      "addressRegion": "FL",
      "addressCountry": "US"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-XXX-XXX-XXXX",
      "contactType": "customer service"
    }
  };

  return (
    <>
      <Helmet>
        <title>{seoConfigs.home.title}</title>
        <meta name="description" content={seoConfigs.home.description} />
        <meta name="keywords" content={seoConfigs.home.keywords} />
        <script type="application/ld+json">
          {JSON.stringify(homeStructuredData)}
        </script>
      </Helmet>
      
      <AnimatedSection direction="up" delay={0.2}>
        <HeroSlider homedatabanner={homescreenData?.banner} />
      </AnimatedSection>

      <AnimatedSection direction="up" delay={0.3}>
        <WeeklyBestsellers />
      </AnimatedSection>
      
      <HearthBanner size="wide" />
      
      <div ref={thirdSectionRef}>
        <AnimatedSection direction="up" delay={0.3}>
          <SpsFlooring productCategory={homescreenData?.product_category} />
        </AnimatedSection>
      </div>
     
      <AnimatedSection direction="up" delay={0.3}>
        <WhatOurClients />
      </AnimatedSection>
    </>
  );
};

export default Home;
