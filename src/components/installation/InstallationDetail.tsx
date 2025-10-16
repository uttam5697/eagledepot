import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Parallax, Pagination } from "swiper/modules";
import { useParams } from "react-router-dom";
import { env } from "../../config/env";

function InstallationDetail() {
  const [installation, setInstallation] = useState(null) as any;
  console.log("🚀 ~ InstallationDetail ~ installation:", installation)
  const [loading, setLoading] = useState(true);
  const params = useParams() as any;

  useEffect(() => {
    const fetchInstallation = async () => {
      try {
        const formData = new FormData();
        formData.append("slug", params.slug)
        const response = await fetch(
          `${env.API_URL}beforeauth/getinstallationdetails`,
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await response.json();
        console.log("🚀 ~ fetchInstallation ~ data:", data);

        if (data.status === 1) {
          setInstallation(data.data);
        }
      } catch (err) {
        console.error("Error fetching installation:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInstallation();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh] text-white">
        Loading installation details...
      </div>
    );
  }

  if (!installation) {
    return (
      <div className="flex items-center justify-center h-[80vh] text-white">
        No installation data found.
      </div>
    );
  }

  return (
    <>
      {/* ✅ Hero Section */}
      <section className="relative">
        <Swiper
          speed={600}
          parallax={true}          
          pagination={{
            el: ".custom-pagination",
            clickable: true,
          }}
          modules={[Parallax, Pagination]}
          className="hero-banner"
        >
          {/* ✅ Loop over product_image */}
          {installation.product_image?.map((media: any, index: number) => (
            <SwiperSlide key={index} className="bg-cover bg-center relative">
              {media.type === "Image" ? (
                <img
                  className="w-full h-[100vh] object-cover object-center"
                  src={media.file}
                  alt={installation.title}
                />
              ) : media.type === "Youtube" ? (
                <iframe
                  width="100%"
                  height="100%"
                  className="h-[100vh]"
                  src={`https://www.youtube.com/embed/${media.video_url}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                >
                </iframe>
              ) : (
                <video
                  className="w-full h-[100vh] object-cover object-center"
                  src={media.video}
                  autoPlay
                  loop
                  muted
                  controls={false}
                />
              )}
              <div className="container absolute left-0 right-0 top-0 z-10">
                {/* <div className="absolute bottom-20 md:bottom-32 lg:bottom-40 xl:bottom-48 2xl:bottom-56">
                  <h1
                    className="text-primary 2xl:text-5xl xl:text-4xl lg:text-3xl md:text-2xl text-xl font-light"
                    data-swiper-parallax="-1000"
                  >
                    {installation.title}
                  </h1>
                  <div
                    className="text-white italic font-playfairDisplay 2xl:text-5xl xl:text-4xl lg:text-3xl md:text-2xl text-xl"
                    data-swiper-parallax="-1000"
                  >
                    Floors built to last
                  </div>
                </div> */}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Pagination and Scroll Down */}
        <div className="custom-pagination container absolute left-0 right-10 xl:!bottom-[60px] lg:!bottom-[50px] md:!bottom-[40px] sm:!bottom-[30px] !bottom-[20px] z-10 text-right" />
        <div className="container">
          {/* <div className="absolute right-[20px] md:bottom-20 bottom-12 z-10 flex flex-col items-center">
            <span className="text-white font-quicksand leading-none lg:text-2sm md:text-sm text-xs -rotate-90 absolute bottom-[74px] h-full flex items-center w-[96px]">
              Scroll down
            </span>
            <div className="w-[23px] h-[36px] border-[1.5px] border-white rounded-full flex items-center justify-center">
              <img src={ScrollDown} alt="Scroll Down Icon" />
            </div>
          </div> */}
        </div>
      </section>
      <section className="xl:mb-[140px] lg:mb-[120px] md:mb-[100px] mb-[80px] xl:mt-[120px] lg:mt-[90px] md:mt-[60px] mt-[30px]">
        <div className="container">
          <div dangerouslySetInnerHTML={{ __html: installation.description }} />
        </div>
      </section>
    </>
  );
}

export default InstallationDetail;
