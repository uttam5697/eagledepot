import React from "react";
import { FiChevronLeft, FiChevronRight, FiMinus, FiPlus } from "react-icons/fi";

type Props = {
  label: string;
  value: number | undefined;
  onDecrease: () => void;
  onIncrease: () => void;
  onChange: (newValue: number) => void;
  iconType?: "arrow" | "plusminus";
  unit?: string;
};

const QuantityInputGroup: React.FC<Props> = ({
  label,
  value,
  onDecrease,
  onIncrease,
  onChange,
  iconType = "arrow",
  unit,
}) => {
  const LeftIcon = iconType === "arrow" ? FiChevronLeft : FiMinus;
  const RightIcon = iconType === "arrow" ? FiChevronRight : FiPlus;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    if (value === "") {
      onChange(0);
      return;
    }

    // ✅ Remove leading zeros (but keep one before decimal)
    value = value.replace(/^0+(?=\d)/, "");

    const newValue = Number(value);

    if (!isNaN(newValue)) {
      onChange(newValue); // update parent state
    } else {
      onChange(0);
    }
  };


  return (
    <div className="flex flex-col items-start gap-1 w-full">
      <label className=" sm:text-base text-sm font-light text-black">{label}</label>

      <div className="grid grid-cols-5 items-center rounded-full border bg-white w-full">
        {/* Decrease Button */}
        <div className="flex items-center col-span-1 justify-start p-2">
          <button
            type="button"
            onClick={onDecrease}
            className="bg-primary text-white p-1 lg:p-2  rounded-full"
          >
            <LeftIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Input */}
        <div className="col-span-3 flex justify-center items-center ">
          <input
            type="number"
            step="any"
            value={value === 0 ? "" : value}   // show blank if empty, otherwise number
            onChange={handleInputChange}
            onBlur={() => {
              if (value === 0 || isNaN(value as number)) {
                onChange(0); // fallback when leaving field
              }
            }}
            className="w-full text-center font-semibold text-black text-[12px] lg:text-sm sm:text-base outline-none bg-transparent px-2"
          />
          {unit && <span className="text-xs font-light ms-1">({unit})</span>}
        </div>

        {/* Increase Button */}
        <div className="flex items-center col-span-1 justify-end p-2">
          <button
            type="button"
            onClick={onIncrease}
            className="bg-primary text-white p-1 lg:p-2 rounded-full"
          >
            <RightIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuantityInputGroup;
