import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';



type SortDropdownProps = {
  options: any;
  onChange: (value: string) => void;
  defaultValue?: string;
  width?: string;
  sortbytext?: boolean;
  text: string;
};

const SortDropdown: React.FC<SortDropdownProps> = ({
  options,
  width,
  sortbytext,
  onChange,
  defaultValue = "ALL", // default to ALL
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string>(defaultValue);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (value: string) => {
    setSelected(value);
    onChange(value);
    setIsOpen(false);
  };

  const selectedLabel =
    selected === 'ALL'
      ? 'All'
      : options.find((opt: any) => opt.product_category_id === selected)?.title || '';

  return (
    <div
      ref={dropdownRef}
      className={`w-full relative lg:text-sm md:text-[14px] text-[12px] ${width}`}
    >
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center justify-between w-full rounded-full border-[1px] border-black lg:px-5 md:px-4 px-3 lg:py-[18px] md:py-4 py-3 bg-white text-black"
      >
        <span className="font-light leading-none">
          {sortbytext ? 'Sort by: ' : ''}
          <span className="font-semibold">{selectedLabel}</span>
        </span>
        <ChevronDown size={16} className="ml-2" />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-full rounded-md border border-gray-200 bg-white shadow-md max-h-60 overflow-y-auto">
          <div
            onClick={() => handleSelect('ALL')}
            className={`cursor-pointer px-4 py-2 hover:bg-gray-100 ${
              selected === 'ALL' ? 'font-semibold text-black' : 'text-gray-700'
            }`}
          >
            All
          </div>
          {options.map((option: any) => (
            <div
              key={option.product_category_id}
              onClick={() => handleSelect(option.product_category_id)}
              className={`cursor-pointer px-4 py-2 hover:bg-gray-100 ${
                option.product_category_id === selected
                  ? 'font-semibold text-black'
                  : 'text-gray-700'
              }`}
            >
              {option.title}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SortDropdown;
