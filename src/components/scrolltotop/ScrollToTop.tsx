// ScrollToTop.tsx or ScrollToTop.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" }); // or just: window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
