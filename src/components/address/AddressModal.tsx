import { useEffect, useState } from "react";
// Address type
interface Address {
  id: number;
  name: string;
  line1: string;
  line2: string;
  postalCode: string;
  phone: string;
}

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (address: Address) => void;
  initialData?: Address | null;
}

const AddressModal: React.FC<AddressModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData
}) => {
  const [form, setForm] = useState<Address>({
    id: Date.now(),
    name: "",
    line1: "",
    line2: "",
    postalCode: "",
    phone: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      setForm({
        id: Date.now(),
        name: "",
        line1: "",
        line2: "",
        postalCode: "",
        phone: "",
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (form.name && form.line1) {
      onSubmit(form);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {initialData ? "Edit" : "Add"} Address
        </h2>
        {["name", "line1", "line2", "postalCode", "phone"].map((field) => (
          <input
            key={field}
            name={field}
            value={(form as any)[field]}
            onChange={handleChange}
            placeholder={field}
            className="w-full mb-2 p-2 border rounded text-sm"
          />
        ))}
        <div className="flex justify-end mt-4 gap-2">
          <button onClick={onClose} className="text-gray-600 text-sm">Cancel</button>
          <button onClick={handleSubmit} className="text-primary text-sm font-semibold">Save</button>
        </div>
      </div>
    </div>
  );
};

export default AddressModal;