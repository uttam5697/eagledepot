import { useState } from "react";
import { ContactUsImg } from "../../assets/Index";
import { PiChatDots, PiEnvelopeSimple, PiUserLight } from "react-icons/pi";
import { FiArrowUpRight } from "react-icons/fi";
import api from "../../lib/api";
import { showToast } from "../../utils/toastUtils";
import AnimatedSection from "../ui/AnimatedSection";
import { useNavigate } from "react-router-dom";

export default function ContactUs() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
    subscribe: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      // Safe cast to HTMLInputElement for checkbox
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prevData) => ({
        ...prevData,
        [name]: checked,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {

      const contactus = new FormData();
      contactus.append("Contactus[first_name]", formData.firstName);
      contactus.append("Contactus[last_name]", formData.lastName);
      contactus.append("Contactus[email]", formData.email);
      contactus.append("Contactus[message]", formData.message);

      const res = await api.post('/beforeauth/contactus', contactus);

      if (res.status === 1) {
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          message: "",
          subscribe: false
        })
        showToast("Thanks for the message, one of our team will be in touch shortly", "success");
        navigate("/")
      }


    } catch (error: any) {
      console.error("Contact us error", error);
      alert("Something went wrong. Please try again.");
    }
  };
  return (
    <AnimatedSection direction="up" delay={0.2}>
      <section className="w-full lg:min-h-screen">
        <div className="flex w-full overflow-hidden lg:flex lg:flex-wrap justify-between aligns-center lg:min-h-screen py-6 md:py-0">
          {/* Right: Image */}
          <div className="hidden md:block w-full md:w-1/2">
            <div
              className="flex h-full w-full justify-center items-center overflow-hidden px-2 py-5 bg-center bg-cover no-repeat"
              style={{ backgroundImage: `url(${ContactUsImg})` }}
            ></div>
          </div>
          {/* Left: Contact Form */}
          <div className="w-full md:w-1/2  px-3 flex flex-col justify-center xl:py-[100px] lg:py-[80px] md:py-[40px]">
            <form
              onSubmit={handleSubmit}
              className="max-w-[600px] w-full mx-auto bg-[#fdfcfb] rounded-md xl:space-y-6 lg:space-y-5 md:space-y-4 space-y-3"
            >
              <h2 className="italic text-primary 2xl:text-5xl xl:text-4.5xl lg:text-4xl md:text-3xl text-2xl xl:leading-none leading-normal font-playfairDisplay xl:mb-10 lg:mb-8 md:mb-6 mb-4">
                Contact Us
              </h2>
              <div className="flex lg:flex-row flex-col xl:gap-6 lg:gap-5 md:gap-4 gap-3">
                <div className="flex items-center bg-white border border-black/30 rounded-full p-2 w-full">
                  <div className="lg:w-[42px] md:w-[32px] w-[24px] lg:h-[42px] md:h-[32px] h-[24px] bg-primary rounded-full flex items-center justify-center flex-none">
                    <PiUserLight className="text-white lg:text-[18px] md:text-[16px] text-[14px]" />
                  </div>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    className="w-full border-none outline-none font-light placeholder:text-black ps-3 text-black bg-transparent"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="flex items-center bg-white border border-black/30 rounded-full p-2 w-full">
                  <div className="lg:w-[42px] md:w-[32px] w-[24px] lg:h-[42px] md:h-[32px] h-[24px] bg-primary rounded-full flex items-center justify-center flex-none">
                    <PiUserLight className="text-white lg:text-[18px] md:text-[16px] text-[14px]" />
                  </div>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    className="w-full border-none outline-none font-light placeholder:text-black ps-3 text-black bg-transparent"
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="flex items-center bg-white border border-black/30 rounded-full p-2">
                <div className="lg:w-[42px] md:w-[32px] w-[24px] lg:h-[42px] md:h-[32px] h-[24px] bg-primary rounded-full flex items-center justify-center flex-none">
                  <PiEnvelopeSimple className="text-white lg:text-[18px] md:text-[16px] text-[14px]" />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  className="w-full border-none outline-none font-light placeholder:text-black ps-3 text-black bg-transparent"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex bg-white border border-black/30 rounded-[24px] p-2">
                <div className="lg:w-[42px] md:w-[32px] w-[24px] lg:h-[42px] md:h-[32px] h-[24px] bg-primary rounded-full flex items-center justify-center flex-none">
                  <PiChatDots className="text-white lg:text-[18px] md:text-[16px] text-[14px]" />
                </div>
                <textarea
                  name="message"
                  placeholder="Message"
                  className="w-full border-none outline-none font-light placeholder:text-black ps-3 text-black bg-transparent resize-none"
                  rows={4}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="flex justify-end">
                <button className="flex justify-between red-btn group before:!hidden after:!hidden">
                  <span className='leading-none'>Submit</span>
                  <FiArrowUpRight className='text-2sm group-hover:rotate-45 duration-300 transition-all' />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </AnimatedSection>
  );
}
