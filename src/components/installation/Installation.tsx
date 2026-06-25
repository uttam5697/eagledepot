import { useEffect, useState } from "react";
import AnimatedSection from "../ui/AnimatedSection";
import { env } from "../../config/env";
import { CalendarCheck, Ruler, Layers, Hammer } from 'lucide-react'
import { AiOutlineSafety } from "react-icons/ai";
import { LiaAwardSolid } from "react-icons/lia";
import { MdOutlineAccessTime } from "react-icons/md";

const steps = [
  {
    id: 1,
    title: 'Schedule',
    description: 'Book your installation online or speak with our team.',
    icon: CalendarCheck,
  },
  {
    id: 2,
    title: 'Assess',
    description:
      'We evaluate your space and recommend the best installation approach.',
    icon: Ruler,
  },
  {
    id: 3,
    title: 'Prepare',
    description: 'Our team prepares your subfloor for a flawless finish.',
    icon: Layers,
  },
  {
    id: 4,
    title: 'Install',
    description:
      'Expert installers handle every detail with precision and care.',
    icon: Hammer,
  },
  {
    id: 5,
    title: 'Inspect & Enjoy',
    description: 'We ensure perfection so you can enjoy your new floors.',
    icon: LiaAwardSolid,
  },
]

const badges = [
  {
    title: 'Certified Installers',
    subtitle: 'Skilled. Trained. Trusted.',
    icon: AiOutlineSafety,
  },
  {
    title: 'Attention to Detail',
    subtitle: 'Precision in every plank.',
    icon: LiaAwardSolid,
  },
  {
    title: 'On-Time & Reliable',
    subtitle: 'We respect your time.',
    icon: MdOutlineAccessTime,
  },
  {
    title: 'Satisfaction Guaranteed',
    subtitle: 'Quality you can count on.',
    icon: AiOutlineSafety,
  },
]

export default function Installation() {
  const [installations, setInstallations] = useState([]);
  console.log("🚀 ~ Installation ~ installations:", installations)
  const [loading, setLoading] = useState(true); // ✅ default to true while fetching

  useEffect(() => {
    const fetchInstallations = async () => {
      try {
        const res = await fetch(
          `${env.API_URL}beforeauth/getinstallation`
        );
        const data = await res.json();

        if (data?.status === 1) {
          setInstallations(data.data);
        }
      } catch (err) {
        console.error("Error fetching installations:", err);
      } finally {
        setLoading(false); // ✅ stop loading no matter what
      }
    };

    fetchInstallations();
  }, []);

  // ✅ Modern Loading UI
  if (loading) {
    return (
      // <div className="flex flex-col items-center justify-center h-[60vh] text-gray-600">
      //   <div className="w-12 h-12 border-4 border-gray-300 border-t-primary rounded-full animate-spin mb-4"></div>
      //   <p className="text-lg font-medium tracking-wide">Loading Installation Details...</p>
      // </div>

      <div className="flex justify-center items-center min-h-screen">
        <div className="relative w-12 h-12">
          <div className="absolute top-0 left-0 w-full h-full rounded-full border-t-2 border-b-2 border-[#C5A24C] animate-spin"></div>
        </div>
        <p className="ml-4">Loading Installation Details...</p>
      </div>
    );
  }

  return (
    <AnimatedSection direction="up" delay={0.2}>
      <section className="relative h-[300px] md:h-[350px] lg:h-[400px] overflow-hidden">
      {/* Background Image */}
        <img
          src="https://images.unsplash.com/photo-1622372738946-62e02505feb3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80"
          alt="Installation Banner"
          className="absolute inset-0 w-full h-full object-cover object-[70%_center]"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black from-[40%] to-transparent to-[65%]" />

        {/* Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-5 lg:px-8">
            <div className="max-w-xl">
              <p className="text-primary uppercase tracking-wide text-sm md:text-base lg:mb-4 md:mb-3 mb-2">
                Professional Installation
              </p>

              <h1 className="font-serif text-white uppercase leading-none lg:mb-6 md:mb-5 mb-4">
                <span className="block text-[24px] md:text-[34px] lg:text-[44px]">
                  Installed To
                </span>
                <span className="block text-primary text-[24px] md:text-[34px] lg:text-[44px]">
                  Perfection.
                </span>
              </h1>

              <p className="text-white/90 text-[14px] md:text-[16px] leading-relaxed max-w-xl lg:mb-8 md:mb-6 mb-4">
                Expert installation makes all the difference. Our professional
                installers ensure your floors look stunning and perform
                beautifully for years to come.
              </p>

              <button className="inline-flex items-center gap-4 bg-primary hover:bg-[#b88d35] transition-colors text-black font-medium lg:px-6 md:px-5 px-4 lg:py-4 md:py-3 py-2.5 rounded lg:text-[20px] md:text-[18px] text-[16px]">
                Schedule Installation

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 12h14m-6-6 6 6-6 6"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full py-8 bg-[#0e0f11] relative overflow-hidden">
        <div className="container relative z-10">
          <div className="text-center mb-20">
            <span className="tracking-[0.2em] font-semibold lg:mb-4 md:mb-3 mb-2 md:text-[16px] text-[14px] block uppercase text-primary">
              Our Professional Installation Process
            </span>
            <h2 className="font-serif md:text-[34px] text-[24px] lg:text-[44px] text-white">
              Seamless. Reliable. Professional.
            </h2>
            <div className="w-16 h-0.5 bg-primary mx-auto"></div>
          </div>

          <div
            className="relative">
            {/* Desktop Connector Line */}
            <div className="hidden lg:block absolute top-[111px] left-[10%] right-[10%] h-[1px] bg-primary/30 z-0"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 lg:gap-6 md:gap-4 gap-6 relative z-10">
              {steps.map((step) => {
                const Icon = step.icon
                return (
                  <div
                    key={step.id}
                    className="flex flex-col items-center text-center group relative"
                  >
                    <div className="lg:mb-6 md:mb-4 mb-0 flex flex-col justify-center items-center">
                      <div className="lg:w-20 md:w-16 w-10 lg:h-20 md:h-16 h-10 flex items-center justify-center mb-3">
                        <Icon className="lg:w-[50px] md:w-[40px] w-[30px] lg:h-[50px] md:h-[40px] h-[30px] text-primary" strokeWidth={1.5} />
                      </div>
                      <div className="lg:w-[38px] md:w-[30px] w-[22px] lg:h-[38px] md:h-[30px] h-[22px] rounded-full bg-primary text-dark-900 font-bold flex items-center justify-center text-sm">
                        {step.id}
                      </div>
                    </div>

                    <h3 className="font-display text-xl uppercase tracking-wider text-white mt-4 mb-3">
                      {step.title}
                    </h3>

                    <p className="text-white text-sm leading-relaxed max-w-[200px]">
                      {step.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>
      <section className="w-full py-8 bg-[#0e0f11]">
        <div className="container">
          <div className="border border-primary/20 rounded-2xl p-8 lg:px-6 backdrop-blur-sm bg-[#101211]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x lg:divide-primary/20">
              {badges.map((badge, index) => {
                const Icon = badge.icon
                return (
                  <div
                    key={index}
                    className="flex items-center gap-5 lg:px-8 first:lg:pl-0 last:lg:pr-0"
                  >
                    <div className="flex-shrink-0">
                      <Icon className="text-[#d4af37] lg:text-[40px] md:text-[30px] text-[24px]" />
                    </div>
                    <div>
                      <h4 className="font-display text-white uppercase tracking-wider lg:text-[18px] md:text-[16px] text-[14px] mb-1">
                        {badge.title}
                      </h4>
                      <p className="text-white lg:text-[16px] md:text-[14px] text-[12px]">{badge.subtitle}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>
    </AnimatedSection>
  );
}
