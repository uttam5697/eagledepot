import React, { useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Logo } from "../assets/Index";

interface FormData {
  name: string;
  email: string;
  message: string;
}

const ChatPopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: ""
  });
  const popupRef = useRef<HTMLDivElement>(null);

  const togglePopup = () => setIsOpen((open) => !open);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openWhatsApp = (e: FormEvent) => {
    e.preventDefault();

    // Simple validation
    if (!formData.name || !formData.email || !formData.message) {
      alert("Please fill all fields before sending.");
      return;
    }

    const phoneNumber = "15513646497"; // Your WhatsApp number
    const text = `Hello, I want to enquire about your products.
      Name: ${formData.name}
      Email: ${formData.email}
      Message: ${formData.message}`;

    window.open(
      `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`,
      "_blank"
    );

    // Reset form and close popup
    setFormData({ name: "", email: "", message: "" });
    setIsOpen(false);
  };

  return (
    <>
      {/* FAB Button */}
      <button
        onClick={togglePopup}
        aria-label={isOpen ? "Close chat popup" : "Open chat popup"}
        className="fixed bottom-5 right-5 bg-gradient-to-r from-primary to-primary text-white text-[32px] w-[60px] h-[60px] rounded-full shadow-2xl hover:scale-105 focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all z-40"
      >
        {isOpen ? "✖" : "💬"}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Popup Panel */}
      <div
        ref={popupRef}
        className={`fixed bottom-24 right-5 w-full max-w-[350px] bg-white rounded-2xl shadow-2xl transform transition-all duration-300 z-50
          ${isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"}
        `}
        style={{ willChange: "transform, opacity" }}
        role="dialog"
        aria-modal="true"
      >
        {isOpen && (
          <div className="p-6">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 flex items-center justify-center mr-3">
                <img src={Logo} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Enquiry Form</h3>
            </div>

            <form className="space-y-4" onSubmit={openWhatsApp} autoComplete="off">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="font-light placeholder:text-black text-black w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary transition"
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="font-light placeholder:text-black text-black w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary transition"
              />
              <textarea
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
                required
                className="font-light placeholder:text-black text-black w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary transition min-h-[80px] resize-none"
              />
              <button
                type="submit"
                className="w-full flex items-center justify-center bg-primary text-white py-2 rounded-lg font-medium border border-primary hover:bg-transparent hover:text-black transition"
              >
                <span className="text-xl mr-2">📱</span>
                Chat on WhatsApp
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default ChatPopup;
