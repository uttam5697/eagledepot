import { Outlet } from "react-router-dom";
import Footer from "../footer/Footer";
import Header from "../header/Header";
import ScrollToTop from "../scrolltotop/ScrollToTop";
import SeoMeta from "../seometa";

export default function MainLayouts() {
  return (
    <>
        <SeoMeta />
        <ScrollToTop />
        <Header />
        <Outlet />
        <Footer />
    </>
  )
}
