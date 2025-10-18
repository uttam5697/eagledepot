// components/HearthBanner.tsx
import React from "react";

interface HearthBannerProps {
  size?: "wide" | "tall" | "square";
}

const HearthBanner: React.FC<HearthBannerProps> = ({ size = "wide" }) => {
  const bannerData = {
    wide: {
      link: "https://app.gethearth.com/partners/eagle-group-flooring?utm_campaign=47032&utm_content=zero_percent&utm_medium=contractor-website&utm_source=contractor&utm_term=700x110",
      img: "https://app.gethearth.com/contractor_images/eagle-group-flooring/banner.jpg?size_id=700x110&color=zero_percent",
    },
    tall: {
      link: "https://app.gethearth.com/partners/eagle-group-flooring?utm_campaign=47032&utm_content=zero_percent&utm_medium=contractor-website&utm_source=contractor&utm_term=310x610",
      img: "https://app.gethearth.com/contractor_images/eagle-group-flooring/banner.jpg?size_id=310x610&color=zero_percent",
    },
    square: {
      link: "https://app.gethearth.com/partners/eagle-group-flooring?utm_campaign=47032&utm_content=darkblue&utm_medium=contractor-website&utm_source=contractor&utm_term=310x310",
      img: "https://app.gethearth.com/contractor_images/eagle-group-flooring/banner.jpg?size_id=310x310&color=darkblue",
    },
  };

  const { link, img } = bannerData[size];

  return (
    <div className="flex justify-center items-center w-full h-auto p-4">
      
        <a href={link} target="_blank" rel="noopener noreferrer">
          <img
            src={img}
            alt={`Hearth financing ${size} banner`}
            className="rounded-xl shadow-lg transition-transform "
          />
        </a>
      
    </div>
  );
};

export default HearthBanner;
