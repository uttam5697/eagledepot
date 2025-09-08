import { useEffect, useState } from "react";

export default function Callback() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (!code) {
      setMessage("❌ Authorization code not found in URL");
      return;
    }

    // Call your backend to exchange token
    const exchangeToken = async () => {
      try {
        const res = await fetch("http://localhost:5000/exchange-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code }),
        });

        const data = await res.json();
        if (data.access_token) {
          localStorage.setItem("quickbooks_token", data.access_token);
          setMessage("✅ Access token saved!");
        } else {
          setMessage("❌ Failed to get access token");
        }
      } catch (err) {
        setMessage("❌ Token exchange failed");
      }
    };

    exchangeToken();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Callback Response</h2>
      <p>{message}</p>
    </div>
  );
}
