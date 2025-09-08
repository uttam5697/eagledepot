import { useEffect, useState } from "react";

export default function PaymentForm() {
  const [cardToken, setCardToken] = useState<string | null>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.appcenter.intuit.com/Content/IA/intuit.ipp.payments.sandbox-0.0.3.js";
    script.async = true;
    script.onload = () => console.log("Intuit Payments SDK loaded");
    script.onerror = () => console.error("SDK failed to load");
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleTokenize = () => {
    if (!(window as any).intuit?.ipp?.payments?.tokenize) {
      alert("Tokenize function not available");
      return;
    }

    (window as any).intuit.ipp.payments.tokenize(
      "eyJhbGciOiJkaXIiLCJlbmMiOiJBMTI4Q0JDLUhTMjU2IiwieC5vcmciOiJIMCJ9..dLsTm3g6b9N58_NEC9vgFg.YUHKqzYDCL1cNwgKJ3HSF-ae0YCFBMp5BFaDSNCzhmfzSUWip8lenc-TFtSehIC9U79oEgFzk8O9mMFLfVV_IiWaiknSGzjVAL85XJ-20DNtDXfIjEIICNd_B7_xpZuRu9yV45ntWFad2QJ7vMuJOTKRLtw6eNJw1949tybdoKLH6-ZosJV98F-cHjeylEHEMh4SyfR3FiY5m_uwNVNHQNcTNm40g-UqCaJEWWdtg5eoPTNrEa9Yevous2eN2wgexBQVTScZGLW4HS1DUo6bTjNuPPEntjErtgB6Sl2bR5OrM5CHM3s_hMYKDOstBiR34aQepso-okwSbfhqyMxjyz0sLYM0VvSghl9vxFG_uLmCcL9QCOu0F98LyuGl5oUBnkdEb4u_4i7Pw2jHKKZoo4LK5pZWT7VEZjyNBwA2D_JKZvT73-kreoQfk8G1klBmC_7S6xLq2PyrlavF_UoNm7a7by-6Q16QJ_1sSxzv7vxnIx-kSMsqfkdwDujqywiHNBaZBBNxUjwwxz-nXQXagZylWtsNjbN19cfT_KfMdkcnEf-r6VvllIWLsL1E9ZVR56gbIFBNB9VWCF9dae1Vpyi6-riwRf2Q8mwPMqSrunk.zCTSltTpHzzWFynMtPxIrQ",
      {
        card: {
          number: "4111111111111111",
          expMonth: "12",
          expYear: "2025",
          cvc: "123",
          name: "Test User",
          address: {
            streetAddress: "123 Main St",
            city: "City",
            region: "State",
            country: "US",
            postalCode: "12345"
          },
        },
      },
      (token: string, response: any) => {
        if (token) {
          console.log("Token:", token, "Response:", response);
          setCardToken(token);
        } else {
          console.error("Tokenization error:", response);
        }
      }
    );
  };

  return (
    <div className="mt-[100px]" style={{ padding: "20px" }}>
      <h2>QuickBooks Payment Tokenization</h2>
      <button onClick={handleTokenize}>
        {cardToken ? `Token: ${cardToken}` : "Generate Token"}
      </button>
    </div>
  );
}
