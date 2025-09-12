import { useEffect, useRef, useState } from "react";

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
  initialData,
}) => {
  const emptyForm: Address = {
    id: Date.now(),
    name: "",
    line1: "",
    line2: "",
    postalCode: "",
    phone: "",
  };

  const [form, setForm] = useState<Address>(emptyForm);

  // Ref for Google Autocomplete
  const line1Ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setForm(initialData ?? { ...emptyForm, id: Date.now() });
    }
  }, [initialData, isOpen]);

  // ✅ Google Autocomplete
  useEffect(() => {
    if (!line1Ref.current || !(window as any).google) return;

    const autocomplete = new (window as any).google.maps.places.Autocomplete(
      line1Ref.current,
      {
        fields: ["geometry", "formatted_address", "address_components"],
        componentRestrictions: { country: "us" }, // restrict to US if needed
      }
    );

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.address_components) return;

      let postalCode = "";
      let city = "";
      let state = "";
      let country = "";

      place.address_components.forEach((comp: any) => {
        if (comp.types.includes("postal_code")) postalCode = comp.long_name;
        if (comp.types.includes("locality")) city = comp.long_name;
        if (comp.types.includes("administrative_area_level_1"))
          state = comp.long_name;
        if (comp.types.includes("country")) country = comp.long_name;
      });

      setForm((prev) => ({
        ...prev,
        line1: place.formatted_address || prev.line1,
        postalCode,
        line2: `${city}, ${state}, ${country}`,
      }));
    });
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (form.name.trim() && form.line1.trim()) {
      onSubmit(form);
      onClose(); // close after save
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {initialData ? "Edit" : "Add"} Address
        </h2>

        {/* Name */}
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="name"
          className="w-full mb-2 p-2 border rounded text-sm"
        />

        {/* Line1 with Google Autocomplete */}
        <input
          ref={line1Ref}
          name="line1"
          value={form.line1}
          onChange={handleChange}
          placeholder="line1 (search address)"
          className="w-full mb-2 p-2 border rounded text-sm"
        />

        {/* Line2 */}
        <input
          name="line2"
          value={form.line2}
          onChange={handleChange}
          placeholder="line2"
          className="w-full mb-2 p-2 border rounded text-sm"
        />

        {/* Postal Code */}
        <input
          name="postalCode"
          value={form.postalCode}
          onChange={handleChange}
          placeholder="postalCode"
          className="w-full mb-2 p-2 border rounded text-sm"
        />

        {/* Phone */}
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="phone"
          className="w-full mb-2 p-2 border rounded text-sm"
        />

        <div className="flex justify-end mt-4 gap-2">
          <button
            onClick={onClose}
            className="text-gray-600 text-sm hover:underline"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="text-primary text-sm font-semibold hover:underline"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressModal;
