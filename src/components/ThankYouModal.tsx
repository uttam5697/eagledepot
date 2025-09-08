import React from "react";

interface ThankYouModalProps {
  open: boolean;
  orderId?: string;
  amount: number;
  currencySymbol?: string;
  onClose: () => void;
}

export const ThankYouModal: React.FC<ThankYouModalProps> = ({
  open,
  orderId,
  amount,
  currencySymbol = "$",
  onClose,
}) => {
  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        zIndex: 9999,
        inset: 0,
        background: "rgba(45,38,80,0.25)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      aria-modal="true"
      tabIndex={-1}
    >
      <div
        style={{
          minWidth: 340,
          maxWidth: "90vw",
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 6px 44px rgba(38,24,200,0.15)",
          padding: "34px 26px 28px 26px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: "absolute",
            top: 14,
            right: 16,
            border: "none",
            background: "transparent",
            fontSize: 24,
            color: "#9696aa",
            cursor: "pointer",
          }}
        >
          &times;
        </button>
        {/* Success Icon */}
        <div
          style={{
            background: "#e3ffee",
            borderRadius: "50%",
            width: 60,
            height: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 18,
            marginTop: 6,
          }}
        >
          <svg width="34" height="34" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="12" fill="#27d987" />
            <path d="M7 12.5l3 3 5-6" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div
          style={{ fontSize: 22, fontWeight: 700, color: "#1e1c3c", marginBottom: 6, textAlign: "center" }}
        >
          Thank You!
        </div>
        <div
          style={{
            fontSize: 16,
            color: "#000",
            marginBottom: 12,
            textAlign: "center",
            lineHeight: "1.45",
          }}
        >
          Your payment of&nbsp;
          <span style={{ color: "#D4AF37", fontWeight: 600 }}>{currencySymbol}{amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
          &nbsp;was successful.
          <br />
          {orderId && (
            <>
              <span style={{ color: "#888", fontSize: 14 }}>
                Order ID: <span style={{ fontWeight: 600 }}>{orderId}</span>
              </span>
              <br />
            </>
          )}
        </div>
        <button
          onClick={onClose}
          style={{
            background: "#D4AF37",
            color: "#fff",
            fontWeight: 600,
            fontSize: 16,
            border: "none",
            borderRadius: 6,
            padding: "11px 34px",
            marginTop: 6,
            cursor: "pointer",
            letterSpacing: 0.1,
            boxShadow: "0 1px 9px rgba(39,217,135,0.10)",
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
};
