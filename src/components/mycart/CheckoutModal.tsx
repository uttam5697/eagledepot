import { CgClose } from "react-icons/cg";
import CheckoutForm from "../CheckoutForm";
import { ThankYouModal } from "../ThankYouModal";
import { useState } from "react";
import { showToast } from "../../utils/toastUtils";
import { useNavigate } from "react-router-dom";

export default function CheckoutModal({installationTotal,message,charge, tax,itemTotal, deliveryType, isOpen, onClose, cartItems, totalAmount, currentAddress }: any) {
  const [thankYouOpen, setThankYouOpen] = useState(false);
  const navigate = useNavigate();

  if (!isOpen) return null;
  return (
    <div className=" fixed inset-0 z-50 visible:opacity-0 bg-black/50 overflow-auto p-4">
      <div className="h-auto flex items-center">
        <div className="relative transform bg-white transition-all duration-300 scale-100 rounded-[16px] mx-auto w-[90%] max-w-[730px] md:rounded-[20px] lg:rounded-[24px] xl:rounded-[34px] p-4 md:p-[42px] lg:p-[52px] xl:p-[62px] opacity-100 checkout-modal flex">
          <div className=" ">
            <button className="absolute top-3 right-3" onClick={onClose}><CgClose className="text-[20px] md:text-[24px] xl:text-[34px]" /></button>
            <CheckoutForm
              tax={tax}
              itemTotal={itemTotal}
              installationTotal={installationTotal}
              charge={charge}
              message={message}
              totalAmount={totalAmount}
              deliveryType={deliveryType}
              cartItems={cartItems}
              currentAddress={currentAddress}
              onClose={onClose}
              onSuccess={() => {
                showToast("🎉 Order placed successfully!", "success");
                // setThankYouOpen(true)
                navigate("/");
                onClose();
              }}
            />
          </div>
        </div>
      </div>
      <ThankYouModal
        open={thankYouOpen}
        // orderId={lastOrderId}
        amount={totalAmount}
        onClose={() => {
          setThankYouOpen(false);
          // Optionally, route however you like!
        }}
      />
    </div>
  );
}