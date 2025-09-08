import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("cRxIGGa34sznfg0k0R800JTmI7zkL");

export default function StripeProviderWrapper({ children }: { children: React.ReactNode }) {
  return <Elements stripe={stripePromise}>{children}</Elements>;
}
