import  { useState } from "react";

const FlooringCalculator = () => {
  const sqftPerBox = 13.47; // 1 box covers 13.47 sqft
  const [baseSqft, setBaseSqft] = useState(13.47); // always without wastage
  const [addWastage, setAddWastage] = useState(false);

  // 📌 Displayed sqft (depends on wastage)
  const displaySqft = addWastage
    ? parseFloat((baseSqft * 1.1).toFixed(2))
    : parseFloat(baseSqft.toFixed(2));

  // 📌 Boxes (calculated dynamically from displaySqft)
  const boxes = Math.ceil(displaySqft / sqftPerBox);

  // 📌 Update from boxes
  const updateFromBoxes = (newBoxes: number) => {
    // Always back-calc base sqft (without wastage)
    let newBaseSqft = newBoxes * sqftPerBox;
    setBaseSqft(newBaseSqft);
  };

  // 📌 Update from sqft (manual typing or buttons)
  const updateFromSqft = (newSqft: number) => {
    // remove wastage if applied
    let actualSqft = addWastage ? newSqft / 1.1 : newSqft;
    setBaseSqft(actualSqft);
  };

  // 📌 Toggle wastage
  const handleWastageToggle = (checked: boolean) => {
    setAddWastage(checked);
  };

  return (
    <div style={{ fontFamily: "sans-serif", textAlign: "center" }}>
      <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
        {/* SQFT Input */}
        <div>
          <button onClick={() => updateFromSqft(Math.max(displaySqft - 1, 0))}>
            -
          </button>
          <input
            type="number"
            value={displaySqft}
            onChange={(e) => updateFromSqft(Number(e.target.value))}
            style={{ width: "80px", textAlign: "center" }}
          />
          <button onClick={() => updateFromSqft(displaySqft + 1)}>+</button>
          <p>Enter Coverage in SQFT</p>
        </div>

        <h2>=</h2>

        {/* Boxes Input */}
        <div>
          <button onClick={() => updateFromBoxes(Math.max(boxes - 1, 1))}>
            -
          </button>
          <input
            type="number"
            value={boxes}
            onChange={(e) => updateFromBoxes(Number(e.target.value))}
            style={{ width: "60px", textAlign: "center" }}
          />
          <button onClick={() => updateFromBoxes(boxes + 1)}>+</button>
          <p># of Boxes</p>
        </div>
      </div>

      {/* Checkbox */}
      <div style={{ marginTop: "20px" }}>
        <input
          type="checkbox"
          checked={addWastage}
          onChange={(e) => handleWastageToggle(e.target.checked)}
        />
        <label style={{ marginLeft: "8px" }}>Add wastage (10%)</label>
      </div>

      <p>
        {boxes} box{boxes > 1 ? "es" : ""} -{" "}
        {addWastage ? "Wastage added" : "No wastage added"}.
      </p>
    </div>
  );
};

export default FlooringCalculator;
