import React, { useState } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import type { StripeCardElement } from "@stripe/stripe-js";
import api from "../lib/api";
import { ThankYouModal } from "./ThankYouModal";
import { useCart } from "../api/cart";
import { useFooter } from "../api/home";

interface PaymentIntentResponse {
  clientSecret?: string;
  orderId?: string;
}

interface CartItem {
  id?: string | number;
  name: string;
  quantity: number;
  price: number;
}

interface CheckoutFormProps {
  charge: number;
  message: string;
  itemTotal: number;
  tax: number;
  totalAmount: number;
  deliveryType: "Delivery" | "Pickup";
  cartItems: CartItem[];
  currentAddress: any;
  onSuccess: () => void;
  onClose: () => void;
  installationTotal: number;
}

interface CheckoutPayload {
  "Userorder[payment_type]": string;
  "Userorder[payment_status]": string;
  "Userorder[payment_id]": string;
  "Userorder[sub_total]": number;
  "Userorder[total]": number;
  "Userorder[tax]": number;
  "Userorder[shipping]": number;
  "Userorder[order_status]": string;
  "Userorder[installation_charge]": number;
  "Userorder[delivery_type]": "Delivery" | "Pickup";
  "Userorder[user_carts_id]": string;
  "Userorder[appuser_address_id]"?: string; // 👈 make optional
}

export default function CheckoutForm({
  itemTotal,
  charge,
  installationTotal,
  tax,
  totalAmount,
  cartItems,
  deliveryType,
  currentAddress,
  onSuccess,
}: CheckoutFormProps) {
  const { refetch } = useCart(true);
  const { data: generaldata } = useFooter(false);

  const [thankYouOpen, setThankYouOpen] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const authKey = localStorage.getItem("authKey");
  const [agreed, setAgreed] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // USD currency formatting
  const formattedAmount = Number(totalAmount).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

  async function checkoutOrder(payload: CheckoutPayload) {
    try {
      const formData = new FormData();
      for (const [key, value] of Object.entries(payload)) {
        formData.append(key, String(value));
      }

      const res = await api.post(`/userauth/checkout`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          auth_key: authKey,
        },
      });

      onSuccess();
      refetch();
      return res.data;
    } catch (error) {
      console.error("Checkout failed:", error);
      throw error;
    }
  }
  // const greenPackaging = 2;

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!stripe || !elements) return;

  // 🛑 Prevent double-clicks
  if (loading) return;

  setLoading(true);
  setMessage(null);
  setSuccess(false);

  try {
    // Step 1: Create Payment Intent
    const formData = new FormData();
    formData.append("amount", String(totalAmount));
    formData.append("currency", "usd");

    const res = await api.post<PaymentIntentResponse>(
      "/userauth/createpaymentintent",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          auth_key: authKey,
        },
      }
    );

    // ✅ Handle server error safely
    if (res.status >= 400) {
      throw new Error(`Server error (${res.status})`);
    }

    const { clientSecret } = res.data;
    if (!clientSecret) throw new Error("Failed to initialize payment");

    // Step 2: Confirm payment
    const card = elements.getElement(CardElement) as StripeCardElement | null;
    if (!card) throw new Error("Card element not found");

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      { payment_method: { card } }
    );

    if (error) {
      setMessage(error.message || "Payment failed");
      setSuccess(false);
      return;
    }

    // Step 3: Success
    if (paymentIntent?.status === "succeeded") {
      setSuccess(true);
      setMessage("✅ Payment succeeded! Processing order...");

      await checkoutOrder({
        "Userorder[appuser_address_id]":
          deliveryType === "Delivery" ? currentAddress : "",
        "Userorder[payment_type]": "Online",
        "Userorder[payment_status]": "succeeded",
        "Userorder[payment_id]": paymentIntent.id,
        "Userorder[tax]": tax,
        "Userorder[shipping]": 0,
        "Userorder[sub_total]": itemTotal,
        "Userorder[total]": totalAmount,
        "Userorder[order_status]": "Confirm",
        "Userorder[delivery_type]": deliveryType,
        "Userorder[installation_charge]": installationTotal,
        "Userorder[user_carts_id]": cartItems
          ?.map((item: any) => item.user_carts_id)
          .join(","),
      });
    } else {
      setMessage(`Payment status: ${paymentIntent?.status}`);
    }
  } catch (err: any) {
    // 🔴 Handle 500 or other errors
    const msg =
      err?.response?.status === 500
        ? "Server error (500): Please try again later."
        : err?.message || "Something went wrong.";

    setMessage(msg);
    setSuccess(false);
  } finally {
    // 🟡 Delay resetting loading to prevent immediate re-click
    setTimeout(() => setLoading(false), 1500);
  }
};

  return (
    <div style={{ margin: "0 auto", borderRadius: 14 }}>
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <span className="2xl:text-[40px] xl:text-[30px] lg:text-[24px] md:text-[20px] text-[18px] leading-none font-playfairDisplay italic mb-2">
          Checkout
        </span>
      </div>

      {/* Order Summary */}
      <div
        style={{
          background: "#f5f5f7",
          borderRadius: 8,
          padding: 16,
          marginBottom: 18,
        }}
      >
        <div className="mb-2 font-semibold lg:text-base md:text-2sm text-sm">
          Order Summary:
        </div>

        {cartItems?.map((item: any, i) => (
          <div
            className="flex text-black justify-between items-center md:text-[16px] text-[12px] mb-2"
            key={item.id || i}
          >
            <span>
              {item?.product.title} × {item.quantity}
            </span>

            <span>
              {Number((item.product.type === "Box" ? item.product.price_per_box : item.product.price) * item.quantity).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                style: "currency",
                currency: "USD",
              })}
            </span>


          </div>


        ))}

        {
          tax > 0 && tax !== null &&
          <div
            className="flex text-black justify-between items-center md:text-[16px] text-[12px] mb-2"
          >
            <span>
              Estimated taxes
            </span>

            <span>
              {tax?.toFixed(2)}
            </span>


          </div>}
        {
          charge > 0 && charge !== null &&
          <div
            className="flex text-black justify-between items-center md:text-[16px] text-[12px] mb-2"
          >
            {

              <span>
                Shipping
              </span>}

            <span>
              {charge?.toFixed(2)}
            </span>


          </div>
        }
          {
          installationTotal !== 0 && installationTotal !== null &&
          <div
            className="flex text-black justify-between items-center md:text-[16px] text-[12px] mb-2"
          >
            <span>
              Installation
            </span>
            <span>
              ${installationTotal?.toFixed(2)}
            </span>
          </div>
        }
        <div
          style={{
            borderTop: "1px dashed #dadbdd",
            paddingTop: 7,
            marginTop: 7,
            display: "flex",
            justifyContent: "space-between",
            fontWeight: 600,
            fontSize: 16,
          }}
        >
          <span>Total</span>
          <span style={{ color: "#000" }}>{formattedAmount}</span>
        </div>
      </div>

      {/* Payment Form */}
      <form onSubmit={handleSubmit}>
        <label
          htmlFor="card-element"
          style={{
            display: "block",
            fontWeight: 500,
            marginBottom: 5,
            color: "#000",
            fontSize: 15,
          }}
        >
          Enter card details
        </label>
        <div
          style={{
            border: "1px solid #e3e3ea",
            borderRadius: 6,
            padding: "12px 10px",
            background: "#fff",
            marginBottom: 14,
          }}
        >
          <CardElement
            id="card-element"
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#000",
                  "::placeholder": { color: "#000" },
                },
                invalid: { color: "#b12727" },
              },
            }}
          />
        </div>
        <p dangerouslySetInnerHTML={{ __html: generaldata?.pick_up_delivery }} />
        <p dangerouslySetInnerHTML={{ __html: generaldata?.agree_delivery }} />
        <label className="flex items-center text-sm accent-black my-4">
          <input
            type="checkbox"
            className="mr-2"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
          />
          I agree that the delivery charge is based on distance.
        </label>

        <button
          type="submit"
          disabled={!agreed || loading} // disable if not agreed or loading
          className={`gap-3 flex items-center justify-center w-full p-3 text-white lg:text-[18px] md:text-[16px] text-[14px] mb-2 mt-1 font-semibold hover:!bg-transparent hover:!text-primary !border-primary !border !duration-300 !transition-all !rounded-full ${!agreed || loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            }`}
          style={{
            background: "#C5A24C",
            boxShadow: "0 2px 8px rgba(110, 80, 255, 0.06)",
          }}
        >
          {loading ? (
            <span
              style={{
                display: "inline-block",
                width: 20,
                height: 20,
                border: "2.5px solid #fff8",
                borderTopColor: "#fff",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            />
          ) : (
            <>
              Pay <strong>{formattedAmount}</strong>
            </>
          )}
        </button>
      </form>

      <ThankYouModal
        open={thankYouOpen}
        amount={totalAmount}
        onClose={() => setThankYouOpen(false)}
      />

      {/* Feedback Message */}
      {message && (
        <div
          style={{
            marginTop: 14,
            color: success ? "#219b29" : "#e02d49",
            background: "#f9f9fd",
            fontWeight: 500,
            textAlign: "center",
            fontSize: 15,
            borderRadius: 4,
            padding: "7px 0",
          }}
        >
          {message}
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 500px) {
          div[style*="box-shadow"] {
            padding: 16px !important;
            width: 97vw !important;
          }
        }
      `}</style>
    </div>
  );
}
