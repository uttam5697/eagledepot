import React, { useEffect, useRef, useState } from "react";

// Store location (New Jersey example, update as needed)
const STORE_LOCATION = { lat: 40.3031, lng: -73.9920 };

interface LatLng {
  lat: number;
  lng: number;
}

const DeliveryCalculator: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState<string>("");
  const [boxes, setBoxes] = useState<string>("");
  const [miles, setMiles] = useState<string | null>(null);
  const [charge, setCharge] = useState<number | null>(null);
  const [message, setMessage] = useState<string>("");

  const [customerLocation, setCustomerLocation] = useState<LatLng | null>(null);

  // extra address fields
  const [zipcode, setZipcode] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [country, setCountry] = useState<string>("");

  // ✅ Init Google Autocomplete
  useEffect(() => {
    if (!inputRef.current || !(window as any).google) return;

    const autocomplete = new (window as any).google.maps.places.Autocomplete(
      inputRef.current,
      {
        fields: ["geometry", "formatted_address", "address_components"],
        // componentRestrictions: { country: "us" }, // restrict to US
      }
    );

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.geometry) return;

      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      setCustomerLocation({ lat, lng });
      setQuery(place.formatted_address || "");

      // extract fields
      let zip = "";
      let cty = "";
      let st = "";
      let cn = "";

      place.address_components?.forEach((comp: any) => {
        if (comp.types.includes("postal_code")) zip = comp.long_name;
        if (comp.types.includes("locality")) cty = comp.long_name;
        if (comp.types.includes("administrative_area_level_1"))
          st = comp.long_name;
        if (comp.types.includes("country")) cn = comp.long_name;
      });

      setZipcode(zip);
      setCity(cty);
      setState(st);
      setCountry(cn);
    });
  }, []);

  

  const fetchRoadDistance = async (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): Promise<number | null> => {
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${lon1},${lat1};${lon2},${lat2}?overview=false`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.routes && data.routes.length > 0) {
        const distanceMeters = data.routes[0].distance;
        const distanceMiles = distanceMeters / 1609.34; // meters → miles
        return distanceMiles;
      }
      return null;
    } catch (error) {
      console.error("Error fetching road distance", error);
      return null;
    }
  };

  // Calculate charge
  const calculateCharge = async () => {
    if (!customerLocation) {
      setMessage("❌ Please select a valid address.");
      return;
    }

    // ✅ Use store → customer
    const distance = await fetchRoadDistance(
      STORE_LOCATION.lat,
      STORE_LOCATION.lng,
      customerLocation.lat,
      customerLocation.lng
    );

    if (!distance) {
      setMessage("⚠️ Could not calculate road distance.");
      return;
    }

    setMiles(distance.toFixed(2));

    const boxesNum = Number(boxes);
    let totalCharge = 0;

    if (distance < 100) {
      const pallets = Math.ceil(boxesNum / 55);
      totalCharge = pallets * 150;
      setMessage(
        `🚚 Express Delivery (${pallets} pallet${pallets > 1 ? "s" : ""})`
      );
    } else if (distance >= 100 && distance <= 200) {
      const pallets = Math.ceil(boxesNum / 55);
      totalCharge = pallets * 200;
      setMessage(
        `🚚 Standard Delivery (${pallets} pallet${pallets > 1 ? "s" : ""})`
      );
    } else {
      setMessage("📞 We will call you to set up delivery.");
      totalCharge = 0;
    }

    setCharge(totalCharge);
  };

  return (
    <div className="p-6 max-w-xl mx-auto border rounded-lg shadow-md bg-white">
      <h2 className="text-xl font-semibold mb-4">Delivery Charge Calculator</h2>

      {/* Address input with Google Autocomplete */}
      <div className="relative mb-3">
        <input
          type="text"
          placeholder="Enter delivery address"
          value={query}
          ref={inputRef}
          onChange={(e) => setQuery(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        />
      </div>

      {/* Auto-completed fields */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <input
          type="text"
          placeholder="Zipcode"
          value={zipcode}
          className="border px-3 py-2 rounded w-full"
          readOnly
        />
        <input
          type="text"
          placeholder="City"
          value={city}
          className="border px-3 py-2 rounded w-full"
          readOnly
        />
        <input
          type="text"
          placeholder="State"
          value={state}
          className="border px-3 py-2 rounded w-full"
          readOnly
        />
        <input
          type="text"
          placeholder="Country"
          value={country}
          className="border px-3 py-2 rounded w-full"
          readOnly
        />
      </div>

      {/* Boxes input */}
      <input
        type="number"
        placeholder="Enter number of boxes"
        value={boxes}
        onChange={(e) => setBoxes(e.target.value)}
        className="border px-3 py-2 rounded w-full mb-3"
      />

      <button
        onClick={calculateCharge}
        className="bg-green-600 text-white px-4 py-2 rounded w-full hover:bg-green-700 transition"
      >
        Calculate Delivery
      </button>

      {/* Results card */}
      {message && (
        <div className="mt-4 p-4 border rounded-lg bg-gray-50 shadow-sm">
          {miles && (
            <p className="mb-1">
              📍 <span className="font-medium">Distance:</span> {miles} miles
            </p>
          )}
          <p className="mb-1">{message}</p>
          {charge !== null && (
            <p className="font-bold text-lg text-green-700">
              💰 Total Charge: ${charge}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default DeliveryCalculator;
