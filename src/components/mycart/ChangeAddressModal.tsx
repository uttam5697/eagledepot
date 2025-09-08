import React from "react";
import { CgClose } from "react-icons/cg";
import { PiTrash } from "react-icons/pi";
import { FiArrowUpRight, FiPlus } from "react-icons/fi";
import { useAddress } from "../../api/cart";
import api from "../../lib/api";
import { useUser } from "../context/UserContext";
import { showToast } from "../../utils/toastUtils";



interface ChangeAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  // addresses: any;
  selectedId: number;
  setSelectedId: (id: number) => void;
  // handleDelete: (id: number) => void;
  handleSubmit: () => void;
  handleAddNew: () => void;
  isAddressModalOpen: boolean;
}


const ChangeAddressModal: React.FC<ChangeAddressModalProps> = ({
  isOpen,
  onClose,
  selectedId,
  setSelectedId,
  handleSubmit,
  handleAddNew,
  isAddressModalOpen
}) => {
  const { data: addressAll, refetch } = useAddress();
  const authkey = useUser().authKey;

  const handleDelete = async (id: number) => {
    try {
      const formdata = new FormData();
      formdata.append("appuser_address_id", id.toString());

      const res = await api.post(
        `/userauth/deleteappuseraddress`, // ✅ match Postman
        formdata,
        { headers: { "auth_key": authkey } }
      );


      if (res?.status === 1) { // ✅ check API's response format
        showToast("Address deleted successfully" , "success");
        setSelectedId(0);
        refetch();
      } else {
        showToast("Failed to delete address", "error");
      }
    } catch (error) {
      console.error("Delete address error:", error);
      alert("Something went wrong while deleting address");
    }
  };

  if (!isOpen) return null;

  return (
    <div className={` fixed inset-0 ${isAddressModalOpen ? "z-40 " : "z-50 visible:opacity-0"} bg-black/50 overflow-auto p-4`}>
      <div className="h-full flex items-center">
        <div className="mx-auto relative w-[90%] max-w-[730px] bg-white rounded-[16px] md:rounded-[20px] lg:rounded-[24px] xl:rounded-[34px] p-4 md:p-[42px] lg:p-[52px] xl:p-[62px] transform transition-all duration-300 scale-100 opacity-100">
          <button onClick={onClose} className="absolute top-5 right-5">
            <CgClose className="text-[20px] md:text-[24px] xl:text-[34px]" />
          </button>
          <h2 className="font-playfairDisplay italic text-[24px] md:text-[44px] lg:text-[54px] xl:text-[64px] leading-normal xl:leading-none mb-4 md:mb-[26px] lg:mb-[36px] xl:mb-[46px]">
            Change Address
          </h2>

          <div className="space-y-3 md:space-y-4 lg:space-y-5 xl:space-y-6">
            {addressAll?.map((address: any) => (
              <label
                key={address.appuser_address_id
                }
                className={`flex items-center justify-between border rounded-xl p-2 md:p-3 lg:p-4 transition-all cursor-pointer ${selectedId === address.appuser_address_id

                  ? "border-black"
                  : "border-black/30"
                  }`}
              >
                <div className="flex items-center space-x-4">
                  <input
                    type="radio"
                    name="address"
                    value={address.id}
                    checked={selectedId === address.appuser_address_id
                    }
                    onChange={() => setSelectedId(address.appuser_address_id
                    )}
                    className="w-5 h-5 accent-black"
                  />
                  <span className="text-xs md:text-sm font-medium leading-none">
                    {address?.address_line_1 + " " + address?.address_line_2}
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(address.appuser_address_id
                  )}
                  className="w-[30px] h-[30px] rounded-full flex items-center justify-center border border-primary bg-primary text-white hover:bg-transparent hover:text-primary transition-all duration-300"
                >
                  <PiTrash className="text-lg" />
                </button>
              </label>
            ))}
          </div>

          <div className="flex items-center justify-between mt-8">
            <button
              onClick={handleAddNew}
              className="black-btn flex justify-between bg-transparent text-black hover:text-white hover:bg-black group before:!hidden after:!hidden"
            >
              <span className="leading-none">Add New</span>
              <FiPlus className="text-2sm transition-all duration-300" />
            </button>
            {
              addressAll?.length > 0 &&
              <button
              onClick={handleSubmit}
              className="black-btn flex justify-between group before:!hidden after:!hidden"
            >
              <span className="leading-none">Submit</span>
              <FiArrowUpRight className="text-2sm group-hover:rotate-45 transition-all duration-300" />
            </button>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeAddressModal;
