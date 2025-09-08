import React, { useEffect } from 'react';
import { CgClose } from 'react-icons/cg';
import { useCart } from '../../api/cart';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCartIcon } from 'lucide-react';
import { useUser } from '../context/UserContext';
import api from '../../lib/api';
import { showToast } from '../../utils/toastUtils';

interface ShoppingCartProps {
  isOpen: boolean;
  onClose: () => void;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ isOpen, onClose }) => {
  const { data: cartItems, refetch } = useCart(true);
  const authkey = useUser()?.authKey;
  const navigate = useNavigate();


  // Calculate subtotal
  const subtotal = cartItems?.reduce((total: number, item: any) => {
    return total + parseFloat(item.product.price_per_box
    ) * item.quantity;
  }, 0);

  const handleDelete = async (id: number) => {
    try {
      const formdata = new FormData();
      formdata.append("user_carts_id", id.toString());

      const res = await api.post(
        `/userauth/deleteusercarts`, // ✅ match Postman
        formdata,
        { headers: { "auth_key": authkey } }
      );
      if (res?.status === 1) { // ✅ check API's response format
        showToast("Item deleted successfully", "success");
        refetch();
      } else {
        showToast("Failed to delete item", "error");
      }
    } catch (error) {
      console.error("Delete address error:", error);
      alert("Something went wrong while deleting address");
    }
  };

  useEffect(() => {
    refetch();
  }, []);

  return (
    <div
      className={`fixed inset-0 mr-0 ml-auto z-50 bg-white flex flex-col transition-all duration-300 max-w-[340px] w-full mx-4 ${isOpen
        ? "opacity-100 visible"
        : "opacity-0 invisible pointer-events-none translate-x-full"
        }`}
    >
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <h2 className="xl:text-2xl lg:text-xl md:text-base text-2sm font-bold text-black leading-none">Shopping cart</h2>
        <button
          onClick={onClose}
          className="flex items-center text-black hover:text-primary md:text-sm text-xs"
        >
          <CgClose className="lg:text-base md:text-2sm text-sm mr-2" />
          <span>Close</span>
        </button>
      </div>

      <div className="overflow-y-auto">
        {
          cartItems?.length === 0 && (
            <div className="flex flex-col justify-center items-center p-6 text-center">
              {/* Icon */}
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-3">
                <ShoppingCartIcon className="text-gray-500 text-lg" />
              </div>

              {/* Message */}
              <p className="text-gray-800 font-medium text-sm md:text-base">
                Your cart is empty
              </p>

              {/* Call to Action */}
              <Link
                to="/"
                className="mt-3 text-primary text-xs md:text-sm hover:underline transition-colors"
              >
                Shop Now
              </Link>
            </div>
          )
        }


        {cartItems?.map((item: any) => (
          <div key={item.user_carts_id} className="p-4 border-b border-[#0000001b] last:border-none hover:bg-[#f7f7f7]">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <img
                  src={item.product?.image || "/fallback.png"}
                  alt={item.product?.title}
                  className="w-16 h-12 object-cover rounded"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-black leading-none font-medium uppercase lg:text-sm md:text-[14px] text-[12px]">
                  {item.product?.title}
                </h3>
                <div className="flex items-center justify-between mt-2">
                  <div className="text-black lg:text-sm md:text-[14px] text-[12px]">
                    <span>{item.quantity} × </span>
                    <span className="text-primary font-semibold">${parseFloat(item?.product?.price_per_box
                    ).toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => { handleDelete(item.user_carts_id) }} className="text-black hover:text-primary">
                <CgClose className="lg:text-base md:text-2sm text-sm" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {
        cartItems?.length > 0 &&
        <div className="px-6 py-4 border-t border-gray-200 mt-auto">
          <div className="flex justify-between items-center">
            <span className="font-bold text-black">Subtotal:</span>
            <span className="text-primary font-semibold text-lg">${subtotal?.toFixed(2)}</span>
          </div>
        </div>}

      {
        cartItems?.length > 0 &&
        <div className="px-6 space-y-3 md:pb-4 pb-2">
          {/* <button onClick={() => { navigate("/my-cart") }}  className="w-full bg-gray-200 text-black py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors">
            View cart
          </button> */}
          <button onClick={() => { navigate("/my-cart"); onClose() }} className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center">
            <span>Checkout</span>
          </button>
        </div>}
    </div>
  );
};

export default ShoppingCart;
