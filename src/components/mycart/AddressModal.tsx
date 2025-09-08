import React, { useState } from "react";
import { CgClose } from "react-icons/cg";
import { FiArrowUpRight, FiMapPin, FiPhoneCall } from "react-icons/fi";
import { PiUserLight } from "react-icons/pi";
import { showToast } from "../../utils/toastUtils";
import api from "../../lib/api";
import { useAddress } from "../../api/cart";

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddressModal: React.FC<AddressModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  const [isSubmitting, setIsSubmitting] = useState(false); // 🔹 for API status
  const [formData, setFormData] = useState({
    recipient: "",
    address1: "",
    address2: "",
    postal: "",
    mobile: "",
    isDefault: false,
    city: "",
    state: "",
  });
  const { refetch } = useAddress();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddNewAddress = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const { recipient, address1, postal, mobile, isDefault, address2, city, state } = formData;

    // 🔽 Inline Validations
    if (!recipient.trim()) {
      showToast("Please enter recipient name", "error");
      setIsSubmitting(false);
      return;
    }


    if (!address1.trim()) {
      showToast("Please enter address line 1", "error");
      setIsSubmitting(false);

      return;
    }
    if (!address2.trim()) {
      showToast("Please enter address line 2", "error");
      setIsSubmitting(false);

      return;
    }

    if (!city.trim()) {
      showToast("Please enter city", "error");
      setIsSubmitting(false);
      return;
    }
    if (!state.trim()) {
      showToast("Please enter state", "error");
      setIsSubmitting(false);
      return;
    }

    if (!postal.trim() || !/^\d{6}$/.test(postal)) {
      showToast("Please enter a valid 6-digit postal code", "error");
      setIsSubmitting(false);

      return;
    }

    if (!mobile.trim() || !/^\d{10}$/.test(mobile)) {
      showToast("Please enter a valid 10-digit mobile number", "error");
      setIsSubmitting(false);

      return;
    }

    if (!isDefault) {
      showToast("Please agree to the Terms & Conditions", "error");
      setIsSubmitting(false);

      return;
    }

    const authKey = localStorage.getItem("authKey");
    if (!authKey) {
      showToast("Auth key missing", "error");
      setIsSubmitting(false);

      return;
    }

    const payload = new FormData();
    payload.append("Appuseraddress[name]", recipient);
    payload.append("Appuseraddress[address_line_1]", address1);
    payload.append("Appuseraddress[address_line_2]", formData.address2);
    payload.append("Appuseraddress[postal_code]", postal);
    payload.append("Appuseraddress[mobile_number]", mobile);
    payload.append("Appuseraddress[is_default]", isDefault ? "1" : "0");
    payload.append("Appuseraddress[city]", formData.city);
    payload.append("Appuseraddress[state]", formData.state);

    try {
      const response = await api.post("/userauth/addeditappuseraddress", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
          auth_key: authKey,
        },
      });

      if (response?.status === 1) {
        showToast("Thank you for providing your address. We are currently generating a freight quote for your order. We will reach out to you with the final total, including shipping, for your review. Your credit card will not be charged until you approve the updated quote.", "success");
        refetch()
        onClose();
        setIsSubmitting(false);
      } else {
        showToast("Failed to add address", "error");
        setIsSubmitting(false);
      }
    } catch (error: any) {
      console.error("API error:", error);
      setIsSubmitting(false);
      showToast(error?.response?.data?.message || "Something went wrong", "error");
    }
  };


  return (
    <div className="fixed inset-0 z-50 bg-black/50 overflow-auto p-4">
      <div className="flex h-full items-center">
        <div className="relative mx-auto w-[90%] max-w-[730px] bg-white rounded-[16px] md:rounded-[20px] lg:rounded-[24px] xl:rounded-[34px] p-4 md:p-[42px] lg:p-[52px] xl:p-[62px] transform transition-all duration-300 scale-100 opacity-100">
          <button onClick={onClose} className="absolute top-5 right-5">
            <CgClose className="text-[20px] md:text-[24px] xl:text-[34px]" />
          </button>
          <h2 className="font-playfairDisplay italic text-[24px] md:text-[44px] lg:text-[54px] xl:text-[64px] leading-normal xl:leading-none mb-4 md:mb-[26px] lg:mb-[36px] xl:mb-[46px]">
            Add Address
          </h2>

          <form>
            {[
              {
                icon: <PiUserLight />,
                placeholder: "Recipient's name",
                name: "recipient",
              },
              {
                icon: <FiMapPin />,
                placeholder: "Address Line 1",
                name: "address1",
              },
              {
                icon: <FiMapPin />,
                placeholder: "Address Line 2",
                name: "address2",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center bg-white border border-black/30 rounded-full p-2 w-full mb-3 md:mb-4 lg:mb-5 xl:mb-6"
              >
                <div className="flex items-center justify-center flex-none bg-black text-white rounded-full w-[24px] h-[24px] md:w-[32px] md:h-[32px] lg:w-[42px] lg:h-[42px]">
                  {React.cloneElement(item.icon, {
                    className: "text-[14px] md:text-[16px] lg:text-[18px]",
                  })}
                </div>
                <input
                  type="text"
                  name={item.name}
                  placeholder={item.placeholder}
                  value={(formData as any)[item.name]}
                  onChange={handleChange}
                  className="w-full bg-transparent ps-3 font-light text-black placeholder:text-black border-none outline-none"
                />
              </div>
            ))}

            {/* City & State */}
            <div className="flex flex-col lg:flex-row gap-3 md:gap-4 lg:gap-5 xl:gap-6 mt-4">
              {[
                {
                  icon: <FiMapPin />,
                  placeholder: "City",
                  name: "city",
                },
                {
                  icon: <FiMapPin />,
                  placeholder: "State",
                  name: "state",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center bg-white border border-black/30 rounded-full p-2 w-full"
                >
                  <div className="flex items-center justify-center flex-none bg-black text-white rounded-full w-[24px] h-[24px] md:w-[32px] md:h-[32px] lg:w-[42px] lg:h-[42px]">
                    {React.cloneElement(item.icon, {
                      className: "text-[14px] md:text-[16px] lg:text-[18px]",
                    })}
                  </div>
                  <input
                    type="text"
                    name={item.name}
                    placeholder={item.placeholder}
                    value={(formData as any)[item.name]}
                    onChange={handleChange}
                    className="w-full bg-transparent ps-3 font-light text-black placeholder:text-black border-none outline-none"
                  />
                </div>
              ))}
            </div>

            {/* Postal Code & Mobile */}
            <div className="flex flex-col lg:flex-row gap-3 md:gap-4 lg:gap-5 xl:gap-6 mt-4">
              {[
                {
                  icon: <FiMapPin />,
                  placeholder: "Postal Codes",
                  name: "postal",
                },
                {
                  icon: <FiPhoneCall />,
                  placeholder: "Mobile Number",
                  name: "mobile",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center bg-white border border-black/30 rounded-full p-2 w-full"
                >
                  <div className="flex items-center justify-center flex-none bg-black text-white rounded-full w-[24px] h-[24px] md:w-[32px] md:h-[32px] lg:w-[42px] lg:h-[42px]">
                    {React.cloneElement(item.icon, {
                      className: "text-[14px] md:text-[16px] lg:text-[18px]",
                    })}
                  </div>
                  <input
                    type="text"
                    name={item.name}
                    placeholder={item.placeholder}
                    value={(formData as any)[item.name]}
                    onChange={handleChange}
                    className="w-full bg-transparent ps-3 font-light text-black placeholder:text-black border-none outline-none"
                  />
                </div>
              ))}
            </div>

            {/* Terms + Submit */}
            <div className="mt-4 md:mt-6 lg:mt-8 xl:mt-10 flex flex-wrap justify-between items-center gap-4">
              <label className="flex items-center text-[12px] md:text-xs accent-black">
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={handleChange}
                  className="mr-2"
                />
                I have read and agree to the Terms & Conditions & Privacy Policy
              </label>
              <button
                disabled={isSubmitting}
                onClick={handleAddNewAddress}
                className="black-btn group flex justify-between before:!hidden after:!hidden"
              >
                <span className="leading-none">
                  Submit
                </span>
                <FiArrowUpRight className="text-2sm group-hover:rotate-45 transition-all duration-300" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddressModal;
