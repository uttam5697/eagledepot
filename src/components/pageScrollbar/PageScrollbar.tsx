import React, { useEffect, useRef } from "react";
import Scrollbar from "smooth-scrollbar";

interface SmoothScrollbarProps {
  children: React.ReactNode;
}

const SmoothScrollbar: React.FC<SmoothScrollbarProps> = ({ children }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      const scrollbar = Scrollbar.init(scrollRef.current, {
        damping: 0.1,          // Controls smoothness
        alwaysShowTracks: false,
      });

      return () => {
        scrollbar.destroy();
      };
    }
  }, []);

  return (
    <div
      ref={scrollRef}
      style={{ height: "100vh", overflow: "hidden" }} // important for smooth-scrollbar container
    >
      {children}
    </div>
  );
};

export default SmoothScrollbar;
