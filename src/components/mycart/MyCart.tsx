import { useEffect, useState } from "react";
import { House, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { PiTrash } from "react-icons/pi";
import { FiArrowUpRight, FiMinus, FiPlus } from "react-icons/fi";
import AddressModal from "./AddressModal";
import ChangeAddressModal from "./ChangeAddressModal";
import { useAddress, useCart } from "../../api/cart";
import api from "../../lib/api";
import { useUser } from "../context/UserContext";
import { showToast } from "../../utils/toastUtils";
import CheckoutModal from "./CheckoutModal";
import { useFooter, useShiping } from "../../api/home";

export default function MyCart() {
  const [deliveryType, setDeliveryType] = useState<"Delivery" | "Pickup">("Pickup");
  const [loadingCharge, setLoadingCharge] = useState(false);
  const STORE_LOCATION = { lat: 40.3031, lng: -73.9920 };
  const { data: fetchedCartItems = [], refetch, isLoading } = useCart(true);

  const boxesNum = fetchedCartItems.reduce((acc: number, item: any) => acc + item.quantity, 0);
  const [singleSelectedAddress, setSingleSelectedAddress] = useState<any>();
  const { data: generaldata } = useFooter(false);
  console.log("🚀 ~ MyCart ~ generaldata:", generaldata)
  const { data: useShiping1 } = useShiping(false);
  const [loadingIds, setLoadingIds] = useState<Record<number, boolean>>({});
  console.log("🚀 ~ MyCart ~ loadingIds:", loadingIds)
  const { data: addressAll } = useAddress();
  const authkey = useUser()?.authKey;

  const [miles, setMiles] = useState<string | null>(null);
  console.log("🚀 ~ MyCart ~ miles:", miles)
  const [charge, setCharge] = useState<number | null>(null);
  const [message, setMessage] = useState<string>("");


  // Local quantity state per cart item
  const [quantities, setQuantities] = useState<Record<number, number>>(
    () =>
      fetchedCartItems.reduce((acc: Record<number, number>, item: any) => {
        acc[item.user_carts_id] = item.quantity;
        return acc;
      }, {})
  );

  const [isAddressModalOpen, setAddressModalOpen] = useState(false);
  const [isChangeModalOpen, setChangeModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number>(0);

  const updateQuantity = async (
    id: number,
    productId: number,
    price: number,
    quantity: number,
    action: "increase" | "decrease"
  ) => {
    const currentQty = quantity || 1;

    // If decreasing last quantity → delete instead
    if (action === "decrease" && currentQty <= 1) {
      await handleDelete(id);
      return;
    }

    const newQuantity = action === "increase" ? currentQty + 1 : currentQty - 1;

    setQuantities((prev) => ({ ...prev, [id]: newQuantity }));
    setLoadingIds((prev) => ({ ...prev, [id]: true }));

    const formData = new FormData();
    formData.append("user_carts_id", String(id));
    formData.append("Usercarts[product_id]", String(productId));
    formData.append("Usercarts[price]", String(price));
    formData.append("Usercarts[quantity]", String(newQuantity));

    try {
      const response = await api.post("/userauth/addeditusercarts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          auth_key: authkey,
        },
      });

      if (response.status === 1) {
        refetch();
        showToast("Cart updated successfully", "success");
      } else {
        showToast("Failed to update cart", "error");
      }
    } catch (error: any) {
      console.error("Error updating cart:", error);
      showToast(error?.response?.data?.message || "An error occurred", "error");
    } finally {
      setLoadingIds((prev) => ({ ...prev, [id]: false }));
    }
  };



  // const handleQuantityChange = (id: number, value: string) => {
  //   const num = Math.max(1, parseInt(value) || 1);
  //   setQuantities((prev) => ({ ...prev, [id]: num }));
  // };

  const itemTotal = fetchedCartItems.reduce((sum: number, item: any) => {
    const price = parseFloat(item.product.price_per_box);
    const qty = quantities[item.user_carts_id] ?? item.quantity;
    return sum + price * qty;
  }, 0);

  // const greenPackaging = 0;
  const taxRate = 10 / 100; // 2%
  const tax = itemTotal * taxRate;
  const shippingCost = deliveryType === "Delivery" ? charge : 0;
  const totalAmount = itemTotal + shippingCost + tax;



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

  const handleCheckout = async () => {
    if (deliveryType === "Delivery" && selectedId === 0) {
      showToast("Please select an address", "error");
      return;
    }
    setIsCheckoutModalOpen(true);
  }




  // inside MyCart component

  const selectedAddress = addressAll?.find(
    (address: any) => address.appuser_address_id === selectedId
  );

  const fetchRoadDistance = async (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): Promise<number | null> => {
    try {
      // prevent invalid coords (like 0,0 or NaN)
      if (
        !lat1 || !lon1 || !lat2 || !lon2 ||
        isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)
      ) {
        console.warn("⚠️ Invalid coordinates:", { lat1, lon1, lat2, lon2 });
        return null;
      }

      const url = `https://router.project-osrm.org/route/v1/driving/${lon1},${lat1};${lon2},${lat2}?overview=false`;

      const res = await fetch(url);
      if (!res.ok) {
        console.error("OSRM request failed:", res.status, res.statusText);
        return null;
      }

      const data = await res.json();
      if (data.routes && data.routes.length > 0) {
        const distanceMeters = data.routes[0].distance;
        return distanceMeters / 1609.34; // meters → miles
      }

      return null;
    } catch (error) {
      console.error("Error fetching road distance:", error);
      return null;
    }
  };


  const calculateCharge = async () => {
    if (!selectedAddress) {
      setMessage("❌ Please select a valid address.");
      return;
    }

    setLoadingCharge(true); // start loader

    try {
      const distance = await fetchRoadDistance(
        STORE_LOCATION.lat,
        STORE_LOCATION.lng,
        Number(selectedAddress.latitude),
        Number(selectedAddress.longitude)
      );

      if (!distance) {
        setMessage("We will call you to set up delivery.");
        setCharge(null);
        return;
      }

      setMiles(distance.toFixed(2));

      const totalBoxes = fetchedCartItems.reduce(
        (acc: number, item: any) => acc + item.quantity,
        0
      );

      const pallets = Math.ceil(totalBoxes / 55);

      // ✅ Shipping charges config (could also come from API)
      // const shippingCharges = [
      //   { shipping_charge_id: 3, min_mile: 200, max_mile: 1000, price: "0.00" },
      //   { shipping_charge_id: 2, min_mile: 100, max_mile: 200, price: "200.00" },
      //   { shipping_charge_id: 1, min_mile: 0, max_mile: 100, price: "150.00" },
      // ];

      // ✅ Find matching rule
      const matchedCharge = useShiping1.find(
        (rule: any) => distance >= rule.min_mile && distance <= rule.max_mile
      );

      let totalCharge = 0;

      if (matchedCharge) {
        const pricePerPallet = Number(matchedCharge.price);

        if (pricePerPallet > 0) {
          totalCharge = pallets * pricePerPallet;
          setMessage(
            `${pricePerPallet === 150 ? "Express" : "Standard"} Delivery (${pallets} pallet${pallets > 1 ? "s" : ""})`
          );
        } else {
          setMessage("We will call you to set up delivery.");
        }
      } else {
        // distance outside all defined ranges
        setMessage("We will call you to set up delivery.");
      }

      setCharge(totalCharge);
    } catch (err) {
      console.error("Charge calc error:", err);
      setMessage("⚠️ Something went wrong.");
    } finally {
      setLoadingCharge(false);
    }
  };

  const handleAddressSubmit = () => {
    calculateCharge();
    setSingleSelectedAddress(
      addressAll?.length > 0 &&
      addressAll.find(
        (address: any) => address.appuser_address_id === selectedId
      )?.address_line_1
    );
    setChangeModalOpen(false);

  };

  useEffect(() => {
    calculateCharge();
  }, [boxesNum])


  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="relative w-12 h-12">
          <div className="absolute top-0 left-0 w-full h-full rounded-full border-t-2 border-b-2 border-[#C5A24C] animate-spin"></div>
        </div>
        <p className="ml-4">Loading your cart...</p>
      </div>
    );
  }
  return (
    <>

      {fetchedCartItems.length > 0 ? <div className="min-h-screen bg-light-white">
        {/* Main Content */}
        <div className="container py-8">
          <div className="flex items-center justify-between xl:mb-14 lg:mb-10 md:mb-8 mb-3">
            <h1 className="italic 2xl:text-5xl xl:text-4.5xl lg:text-4xl md:text-3xl text-2xl xl:leading-none leading-normal font-playfairDisplay">
              My Cart
            </h1>
            {/* Continue Shopping Link */}
            <div className="text-right">
              <Link
                to="/"
                className="text-black !ml-auto lg:text-2sm md:text-sm text-xs underline"
              >
                Continue shopping
              </Link>
            </div>
          </div>
          <div className="lg:grid lg:grid-cols-3 gap-8">
            {/* Cart Items Section */}
            <div className="lg:col-span-2 lg:mb-0 mb-10">
              {/* Cart Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-">
                  <thead className="border-b border-peru/20">
                    <tr>
                      <th className="text-left md:py-4 py-2 font-normal lg:text-2sm md:text-sm text-sm  text-black md:min-w-[358px] min-w-[250px]">
                        Product
                      </th>
                      <th className="text-left md:py-4 py-2 font-normal lg:text-2sm md:text-sm text-sm  text-black md:min-w-[207px] min-w-[150px] ps-4">
                        Quantity
                      </th>
                      <th className="text-right md:py-4 py-2 font-normal lg:text-2sm md:text-sm text-sm  text-black md:min-w-[125px] min-w-[50px] ps-4">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {fetchedCartItems.map((item: any) => {
                      const total = parseFloat(item.product.price_per_box) * (quantities[item.user_carts_id] ?? item.quantity);
                      return (
                        <tr key={item.user_carts_id}>
                          <td className="flex items-center space-x-4 py-4">
                            <img
                              src={item.product.image}
                              alt={item.product.title}
                              className="xl:w-[140px] xl:h-[140px] lg:w-[100px] lg:h-[100px] md:w-[80px] md:h-[80px] w-[50px] h-[50px] object-center object-cover rounded-[16px]"
                            />
                            <div>
                              <h3 className="text-black mb-1 lg:text-2sm md:text-sm text-xs">{item.product.title}</h3>
                              <p className="font-bold xl:text-xl lg:text-base md:text-sm text-xs">${item.product.price_per_box
                              } /sqft/Box</p>
                            </div>
                          </td>
                          <td className="py-4 ps-4">
                            <div className="flex items-center rounded-full border bg-white w-fit">
                              <div className="flex items-center col-span-1 justify-start p-2">
                                <button
                                  onClick={() =>
                                    updateQuantity(item.user_carts_id, item.product.product_id, item.product.price_per_box, quantities[item.user_carts_id] ?? item.quantity, "decrease")
                                  }
                                  className="bg-primary text-white p-1 lg:p-2 rounded-full"
                                >
                                  <FiMinus className="w-4 h-4" />
                                </button>
                              </div>
                              <input
                                type="number"
                                readOnly
                                value={quantities[item.user_carts_id] ?? item.quantity}
                                // onChange={(e) => handleQuantityChange(item.user_carts_id, e.target.value)}
                                className="w-[50px] px-0 text-center font-semibold text-black text-[12px] lg:text-sm sm:text-base outline-none bg-transparent"
                              />
                              <div className="flex items-center col-span-1 justify-start p-2">
                                <button
                                  onClick={() =>
                                    updateQuantity(item.user_carts_id, item.product.product_id, item.product.price_per_box, quantities[item.user_carts_id] ?? item.quantity, "increase")
                                  }
                                  className="bg-primary text-white p-1 lg:p-2 rounded-full"
                                >
                                  <FiPlus className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                            {item.product.sqft_in_box && (
                              <p className="md:text-[12px] text-[10px] text-black mt-1">
                                {item.product.sqft_in_box} sq ft/box
                              </p>
                            )}
                          </td>
                          <td className="py-4 text-right ps-4">
                            <div className="flex items-center justify-end space-x-3">
                              <span className="xl:text-xl lg:text-base md:text-sm text-xs font-bold text-black">${total.toFixed(2)}</span>
                              <button className="bg-primary text-white flex-none hover:bg-transparent hover:text-primary border-primary border duration-300 transition-all w-[30px] h-[30px] rounded-full flex items-center justify-center">
                                <PiTrash onClick={() => handleDelete(item.user_carts_id)} className="text-lg" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bill Summary Section */}
            <div className="lg:col-span-1">
              <div className="bg-black/5 rounded-[24px] p-6 sticky top-8">
                <h2 className="text-xl font-bold text-black mb-6">
                  Bill summary
                </h2>

                {/* Cost Breakdown */}
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-black font-light md:text-sm text-xs">
                      Item total (MRP)
                    </span>
                    <span className="font-semibold">
                      ${itemTotal.toFixed(2)}
                    </span>
                  </div>
                  {
                    generaldata?.tax !== null &&
                    <div className="flex justify-between">
                      <span className="text-black font-light md:text-sm text-xs">
                        Estimated taxes
                      </span>
                      <span className="font-semibold">
                        ${tax?.toFixed(2)}
                      </span>
                    </div>}
                  {
                    charge !== null && deliveryType === "Delivery" &&
                    <div className="flex justify-between">
                      <span className="text-black font-light md:text-sm text-xs">
                        Shipping
                      </span>
                      <span className="font-semibold">
                        {loadingCharge ? (
                          <div className="relative w-6 h-6">
                            <div className="absolute top-0 left-0 w-full h-full rounded-full border-t-2 border-b-2 border-[#C5A24C] animate-spin"></div>
                          </div>
                        ) : (
                          <>${charge?.toFixed(2)}</>
                        )}
                      </span>
                    </div>}
                  {
                     deliveryType === "Delivery" &&
                    <div className="flex justify-between">
                      <span className="text-black font-light md:text-sm text-xs">
                        {message}
                      </span>
                      <span className="font-semibold">
                      </span>
                    </div>}
                </div>

                {/* Total */}
                <div className="border-t border-black/20 pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-black lg:text-base md:text-2sm text-sm">
                      To be paid
                    </span>
                    <span className="text-lg font-semibold text-black lg:text-base md:text-2sm text-sm">
                      ${totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Delivery Info */}
                {/* <div className="bg-white rounded-lg p-4 mb-6">
                  <div className="flex space-x-3 items-center">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <House />
                      </div>
                      <div>
                        <p className="text-black md:text-sm text-xs font-semibold">
                          Delivery to
                        </p>
                        <p className="md:text-xs text-[12px] font-light">
                          {addressAll?.length > 0 &&
                            addressAll.find((address: any) => address.appuser_address_id === selectedId)?.
                              address_line_1
                          }
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setChangeModalOpen(true)}
                      className="text-black !ml-auto md:text-sm text-xs underline font-semibold"
                    >
                      Add Address
                    </button>
                  </div>
                </div> */}

                {/* Delivery / Pickup Info */}
                <div className="bg-white rounded-lg p-4 mb-6">
                  <div className="flex flex-col space-y-4">
                    {/* Option select */}
                    <div className="flex space-x-4">
                      <button
                        onClick={() => {setDeliveryType("Pickup")}}
                        className={`px-4 py-2 rounded-lg border text-sm font-semibold transition 
          ${deliveryType === "Pickup" ? "bg-black text-white" : "bg-gray-100 text-black"}`}
                      >
                        Pickup
                      </button>
                      <button
                        onClick={() => setDeliveryType("Delivery")}
                        className={`px-4 py-2 rounded-lg border text-sm font-semibold transition 
          ${deliveryType === "Delivery" ? "bg-black text-white" : "bg-gray-100 text-black"}`}
                      >
                        Delivery
                      </button>

                    </div>

                    {/* Show info depending on selection */}
                    {deliveryType === "Delivery" ? (
                      <div className="flex space-x-3 items-center">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2">
                            <House />
                          </div>
                          <div>
                            <p className="text-black md:text-sm text-xs font-semibold">
                              Delivery to
                            </p>
                            <p className="md:text-xs text-[12px] font-light">
                              {singleSelectedAddress}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setChangeModalOpen(true)}
                          className="text-black !ml-auto md:text-sm text-xs underline font-semibold"
                        >
                          Add Address
                        </button>
                      </div>
                    ) : (
                      <>
                      <div className="flex items-center space-x-2">
                        <p className="text-black md:text-sm text-xs font-semibold">
                          Pickup selected
                        </p>
                        <p className="md:text-xs text-[12px] font-light">
                          You can collect your order directly from our store.
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <p className="text-black md:text-sm text-xs font-semibold">
                          Store Address
                        </p>
                        <p className="md:text-xs text-[12px] font-light">
                          {generaldata?.warehouse_address}
                        </p>
                      </div>
                      </>
                      
                    )}
                  </div>
                </div>

                {/* Process Button */}
                <button
                  onClick={() => handleCheckout()}
                  className="flex justify-between black-btn max-w-[286px] mx-auto group before:!hidden after:!hidden xl:px-5 px-4 xl:py-[18px] py-[14px]"
                >
                  <span className="leading-none">Process to Continue</span>
                  <FiArrowUpRight className="text-2sm group-hover:rotate-45 duration-300 transition-all" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div> :
        <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
            {/* Icon */}
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-full bg-gray-100">
              <ShoppingCart className="text-gray-500 text-3xl" />
            </div>

            {/* Title */}
            <h1 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2">
              Your cart is empty
            </h1>

            {/* Subtitle */}
            <p className="text-gray-500 mb-6">
              Looks like you haven’t added anything yet. Start exploring our products!
            </p>

            {/* Action */}
            <Link
              to="/"
              className="inline-block bg-primary hover:bg-primary-dark text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Shop Now
            </Link>
          </div>
        </div>
      }
      <AddressModal isOpen={isAddressModalOpen} onClose={() => {
        setAddressModalOpen(false)
        setChangeModalOpen(true)
      }} />
      <ChangeAddressModal
        isOpen={isChangeModalOpen}
        onClose={() => setChangeModalOpen(false)}
        // addresses={addresses}

        selectedId={selectedId}
        setSelectedId={setSelectedId}
        // handleDelete={(id) => setAddresses(addresses.filter((a) => a.id !== id))}
        // handleSubmit={() => setChangeModalOpen(false)}
        handleSubmit={handleAddressSubmit}
        handleAddNew={() => {
          setAddressModalOpen(true);
          setChangeModalOpen(false);
        }}
        isAddressModalOpen={isAddressModalOpen}
      />
      <CheckoutModal message={message} charge={charge} tax={tax} itemTotal={itemTotal} deliveryType={deliveryType} isOpen={isCheckoutModalOpen} onClose={() => setIsCheckoutModalOpen(false)} cartItems={fetchedCartItems} totalAmount={totalAmount} currentAddress={selectedId} />
    </>
  );
}
