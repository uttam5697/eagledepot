import { createBrowserRouter } from "react-router-dom";
import { paths } from "./config/path";
import NotFound from "./components/Notfound";
import MainLayouts from "./components/layouts/MainLayouts";
import ProductListing from "./pages/ProductListing";
import Home from "./components/Home";
import ProductDetails from "./pages/ProductDetails";
import Login from "./components/login/Login";
import ForgotPassword from "./components/forgotpassword/ForgotPassword";
import SignUp from "./components/signup/SignUp";
import ContactUs from "./components/contactus/ContactUs";
import AboutUs from "./components/aboutus/AboutUs";
import PrivacyPolicy from "./components/PrivacyPolicy";
import Termsandconditions from "./components/Terms&Conditions";
import { MyCart } from "./components";
import Callback from "./components/Callback";
import PaymentForm from "./components/testpayment";
import RedirectIfLoggedIn from "./components/RedirectIfLoggedIn";
import DeliveryCalculator from "./components/delcalcu/Calculate";

// Define the routes separately
const routes = [
  {
    path: paths.login.path,
    element: (
      <RedirectIfLoggedIn>
        <Login />
      </RedirectIfLoggedIn>
    ),
  },
  {
    path: paths.forgotpassword.path,
    element: (
      <RedirectIfLoggedIn>
        <ForgotPassword />
      </RedirectIfLoggedIn>
    ),
  },
  {
    path: paths.signup.path,
    element: (
      <RedirectIfLoggedIn>
        <SignUp />
      </RedirectIfLoggedIn>
    ),
  },
  {
    element: (
      <>
        <MainLayouts />
      </>
    ),
    children: [
      {
        path: paths.home.path,
        element: <Home />,
      },
      {
        path: paths.aboutus.path,
        element: <AboutUs />,
      },
      {
        path: paths.contactus.path,
        element: <ContactUs />,
      },
      {
        path: paths.product.category.path,
        element: <ProductListing />,
      },
      {
        path: paths.product.details.path,
        element: <ProductDetails />,
      },
      {
        path: paths.privacyPolicy.path,
        element: <PrivacyPolicy />,
      },
      {
        path: paths.termsandconditions.path,
        element: <Termsandconditions />,
      },
      {
        path: paths.mycart.path,
        element: <MyCart />,
      },
      {
        path: paths.calculate.path,
        element: <DeliveryCalculator />,
      },
      {
        path: "/callback",
        element: <Callback />,
      },
      {
        path: "/callbacktest",
        element: <PaymentForm />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
];

// Pass basename option
export const createAppRouter = createBrowserRouter(routes, {
  basename: "/",
});

