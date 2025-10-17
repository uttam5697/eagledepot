import { useEffect, useState } from "react";
import { FiArrowUpRight } from "react-icons/fi";
import AnimatedSection from "../ui/AnimatedSection";
import { Link } from "react-router-dom";
import { env } from "../../config/env";

export default function Installation() {
  const [installations, setInstallations] = useState([]);
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
      <section className="xl:mb-[140px] lg:mb-[120px] md:mb-[100px] mb-[80px] xl:mt-[120px] lg:mt-[90px] md:mt-[60px] mt-[30px]">
        <div className="container">
          {/* Section Title */}
          {/* <div className="2xl:mb-[60px] xl:mb-[50px] lg:mb-[40px] md:mb-[30px] mb-[20px]">
            <h1 className="text-primary italic 2xl:text-5xl xl:text-4.5xl lg:text-4xl md:text-3xl text-2xl font-playfairDisplay">
              Installation
            </h1>
          </div> */}

          {/* Cards Grid */}
          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 xl:gap-6 lg:gap-5 gap-4 transition-opacity duration-300 ease-in-out">
            {installations.map((item: any) => (
              <div
                key={item.installation_id}
                className="group rounded-lg flex flex-col h-full bg-white md:p-2 p-1 shadow-sm transition-transform duration-300 hover:shadow-md"
              >
                {/* Image */}
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="transform transition-transform duration-300 group-hover:scale-105 w-full h-[240px] object-cover rounded-t-lg"
                  />
                </div>

                {/* Content */}
                <div className="mt-4 px-[10px] pb-[10px]">
                  <h4 className="text-three-line-truncate md:text-lg text-sm font-bold tracking-[0.01em] md:!leading-[22px] !leading-[14px] md:mb-[30px] mb-5 text-center">
                    {item.title}
                  </h4>
                  <Link
                    to={`/installation/${item.slug}`}
                    className="lg:text-[18px] md:text-[16px] text-[14px] flex justify-between w-fit black-btn mx-auto border-black group before:!hidden after:!hidden xl:px-6 px-4 xl:py-[18px] py-[14px] gap-4"
                    data-discover="true"
                  >
                    <span className="leading-none">Learn More</span>
                    <FiArrowUpRight className="text-2sm group-hover:rotate-45 duration-300 transition-all" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </AnimatedSection>
  );
}
