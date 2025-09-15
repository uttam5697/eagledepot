import React, { useState, useEffect } from "react";

type SortTabsProps = {
  text:string;
  width?: string;
  options?: any[]; // ✅ make it optional to avoid runtime error
  onChange: (value: string) => void;
  defaultValue?: string;
  sortbytext?: boolean;
};

const SortDropdown: React.FC<SortTabsProps> = ({
  options = [], // ✅ fallback to empty array if undefined
  onChange,
  sortbytext,
  defaultValue = "ALL",
}) => {
  const [selected, setSelected] = useState<string>(defaultValue);

  useEffect(() => {
    onChange(selected); // call parent filter function when selected changes
  }, [selected, onChange]);

  const handleSelect = (value: string) => {
    setSelected(value);
  };

  return (
    <div className="w-full">
      {sortbytext && (
        <span className="block mb-2 font-light lg:text-sm">Sort by:</span>
      )}

      {/* Tabs */}
      <div className="flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth">
        <button
          onClick={() => handleSelect("ALL")}
          className={`transition-all font-playfairDisplay font-bold flex-none duration-300 ease-in-out after:transition-all after:duration-300 after:ease-in-out relative hover:text-black after:absolute after:bottom-0 after:left-0 after:h-[2px] hover:after:w-full after:bg-black
            ${selected === "ALL" ? " text-black after:w-full" : " text-black/70 after:w-0"}`}
        >
          All
        </button>

        {options.length > 0 &&
          options.map((option) => (
            <button
              key={option.product_category_id}
              onClick={() => handleSelect(option.product_category_id)}
              className={`transition-all font-playfairDisplay font-bold flex-none duration-300 ease-in-out after:transition-all after:duration-300 after:ease-in-out relative hover:text-black after:absolute after:bottom-0 after:left-0 after:h-[2px] hover:after:w-full after:bg-black
                ${
                  selected === option.product_category_id
                    ? "text-black after:w-full"
                    : "text-black/70 after:w-0"
                }`}
            >
              {option.title}
            </button>
          ))}
      </div>

    </div>
  );
};

export default SortDropdown;
