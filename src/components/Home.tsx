import React, { useEffect, useRef } from "react";
import SpsFlooring from "./spsflooring/SpsFlooring";
import WeeklyBestsellers from "./weeklybestsellers/WeeklyBestsellers";
import HeroSlider from "./heroslider/HeroSlider";
import WhatOurClients from "./whatourclients/WhatOurClients";
import { useHome } from "../api/home";
import AnimatedSection from "./ui/AnimatedSection";
import { useLocation } from "react-router-dom";
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

  return (
    <>
      <AnimatedSection direction="up" delay={0.2}>
        <HeroSlider homedatabanner={homescreenData?.banner} />
      </AnimatedSection>

      <AnimatedSection direction="up" delay={0.3}>
        {/* <AnimatedSection direction="up" delay={0.2}> */}
        {/* </AnimatedSection> */}

        {/* Wrap the third section in a ref */}
        <WeeklyBestsellers />
      </AnimatedSection>
          <HearthBanner size="wide" />
          {/* <HearthWidget /> */}
      <div ref={thirdSectionRef}>
        <AnimatedSection direction="up" delay={0.3}>
          <SpsFlooring productCategory={homescreenData?.product_category} />
        </AnimatedSection>
      </div >
     
      {/* <HearthBanner size="tall" /> */}
      <AnimatedSection direction="up" delay={0.3}>
        <WhatOurClients />
      </AnimatedSection>
    </>
  );
};

export default Home;
