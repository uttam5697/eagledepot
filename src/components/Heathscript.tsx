import React, { useEffect } from "react";

const HearthBanner: React.FC = () => {
  useEffect(() => {
    // Remove old script if already added
    const oldScript = document.getElementById("hearth-script");
    if (oldScript) oldScript.remove();

    // Create the script dynamically
    const script = document.createElement("script");
    script.src = "https://widget.gethearth.com/script.js";
    script.id = "hearth-script";
    script.dataset.orgid = "47032";
    script.dataset.partner = "eagle-group-flooring";

    // Add script to the document body
    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return (
    <div className="flex justify-center my-10">
      <iframe
        id="hearth-widget_calculator_v1"
        title="Hearth Financing Widget"
        style={{
          width: "100%",
          maxWidth: "700px",
          height: "400px",
          border: "none",
          background: "transparent",
        }}
      ></iframe>
    </div>
  );
};

export default HearthBanner;
