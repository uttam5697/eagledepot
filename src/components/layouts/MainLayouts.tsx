import { Outlet } from "react-router-dom";
import Footer from "../footer/Footer";
import Header from "../header/Header";
import ScrollToTop from "../scrolltotop/ScrollToTop";
import SeoMeta from "../seometa";
import PerformanceOptimizer from "../PerformanceOptimizer";

export default function MainLayouts() {
  return (
    <>
        <SeoMeta />
        <PerformanceOptimizer />
        <ScrollToTop />
        <Header />
        <Outlet />
        <Footer />
    </>
  )
}
