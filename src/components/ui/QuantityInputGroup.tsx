import React from "react";
import type { ChangeEvent } from "react";
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

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    console.log("🚀 ~ handleInputChange ~ newValue:", newValue)
    if (!isNaN(newValue)) {
      onChange(Number(newValue));
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
            step="0.01"
            value={value}
            onChange={handleInputChange}
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
