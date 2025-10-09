
import { useRef } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { BrandImg, BrandImg2, BrandImg3, BrandImg4, BrandLogo, BrandLogo2, BrandLogo3, BrandLogo4 } from "../../assets/Index";

export default function ShoppingBrand() {
    const prevRef = useRef<HTMLButtonElement>(null);
    const nextRef = useRef<HTMLButtonElement>(null);
  return (
    <section className="xl:mb-[140px] lg:mb-[120px] md:mb-[100px] mb-[80px]">
      <div className="container">
        <div className="2xl:mb-10 xl:mb-8 lg:mb-6 md:mb-4 mb-2 flex justify-between items-center">
          <div>
            <h1 className="text-black font-extralight 2xl:text-[40px] xl:text-[30px] lg:text-[24px] md:text-[20px] text-[18px] xl:leading-none leading-normal">
              Shopping by
            </h1>
            <h1 className="text-primary 2xl:text-[48px] xl:text-[38px] lg:text-[28px] md:text-[24px] text-[20px] leading-normal font-playfairDisplay -mt-3">
              Brands
            </h1>
          </div>
          <div className="flex lg:gap-5 md:gap-3 gap-2 items-center">
            <button
              ref={prevRef}
              className="hover:bg-black border-black group transition-all duration-300 ease-in-out border-[1px] lg:h-[54px] md:h-[44px] h-[34px] w-[34px] lg:w-[54px] md:w-[44px] rounded-full text-white flex items-center justify-center"
            >
              <BsArrowLeft className="text-black group-hover:text-white lg:text-[20px] text-[16px]" />
            </button>
            <button
              ref={nextRef}
              className="hover:bg-black border-black group transition-all duration-300 ease-in-out border-[1px] lg:h-[54px] md:h-[44px] h-[34px] w-[34px] lg:w-[54px] md:w-[44px] rounded-full text-white flex items-center justify-center"
            >
              <BsArrowRight className="text-black group-hover:text-white lg:text-[20px] text-[16px]" />
            </button>
          </div>
        </div>

        <Swiper
          spaceBetween={12}
          slidesPerView={1}
          navigation={{
            prevEl: prevRef.current!,
            nextEl: nextRef.current!,
          }}
          modules={[Navigation]}
          onBeforeInit={(swiper) => {
            // Bind navigation buttons manually here
            if (
              swiper.params.navigation &&
              typeof swiper.params.navigation !== "boolean"
            ) {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
            }

          }}
          breakpoints={{
            120: {
              slidesPerView: 1,
              spaceBetween: 10,
            },
            540: {
              slidesPerView: 2,
              spaceBetween: 10,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 15,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 24,
            },
            1300: {
              slidesPerView: 4,
              spaceBetween: 24,
            },
          }}
        >
          <SwiperSlide>
            <div className="w-full relative group overflow-hidden rounded-[30px] swiper-card">
              <div className="relative before:rounded-[30px] before:bg-black-gradient before:absolute before:w-full before:h-full before:z-10">
                <img
                  className="rounded-[30px] w-full transition-transform duration-500 group-hover:scale-110"
                  src={BrandImg}
                  alt="FlooringImg"
                />
                <div className="bg-white w-[134px] h-[70px] rounded-[18px] flex items-center justify-center absolute z-20 bottom-[10px] lg:left-6 md:left-5 left-4 transition-all duration-300 group-hover:translate-y-[-5px]">
                  <img src={BrandLogo} alt="BrandLogo"/>
                </div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="w-full relative group overflow-hidden rounded-[30px] swiper-card">
              <div className="relative before:rounded-[30px] before:bg-black-gradient before:absolute before:w-full before:h-full before:z-10">
                <img
                  className="rounded-[30px] w-full transition-transform duration-500 group-hover:scale-110"
                  src={BrandImg2}
                  alt="FlooringImg"
                />
                <div className="bg-white w-[134px] h-[70px] rounded-[18px] flex items-center justify-center absolute z-20 bottom-[10px] lg:left-6 md:left-5 left-4 transition-all duration-300 group-hover:translate-y-[-5px]">
                  <img src={BrandLogo2} alt="BrandLogo2"/>
                </div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="w-full relative group overflow-hidden rounded-[30px] swiper-card">
              <div className="relative before:rounded-[30px] before:bg-black-gradient before:absolute before:w-full before:h-full before:z-10">
                <img
                  className="rounded-[30px] w-full transition-transform duration-500 group-hover:scale-110"
                  src={BrandImg3}
                  alt="FlooringImg"
                />
                <div className="bg-white w-[134px] h-[70px] rounded-[18px] flex items-center justify-center absolute z-20 bottom-[10px] lg:left-6 md:left-5 left-4 transition-all duration-300 group-hover:translate-y-[-5px]">
                  <img src={BrandLogo3} alt="BrandLogo3"/>
                </div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="w-full relative group overflow-hidden rounded-[30px] swiper-card">
              <div className="relative before:rounded-[30px] before:bg-black-gradient before:absolute before:w-full before:h-full before:z-10">
                <img
                  className="rounded-[30px] w-full transition-transform duration-500 group-hover:scale-110"
                  src={BrandImg4}
                  alt="FlooringImg"
                />
                <div className="bg-white w-[134px] h-[70px] rounded-[18px] flex items-center justify-center absolute z-20 bottom-[10px] lg:left-6 md:left-5 left-4 transition-all duration-300 group-hover:translate-y-[-5px]">
                  <img src={BrandLogo4} alt="BrandLogo4"/>
                </div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="w-full relative group overflow-hidden rounded-[30px] swiper-card">
              <div className="relative before:rounded-[30px] before:bg-black-gradient before:absolute before:w-full before:h-full before:z-10">
                <img
                  className="rounded-[30px] w-full transition-transform duration-500 group-hover:scale-110"
                  src={BrandImg}
                  alt="FlooringImg"
                />
                <div className="bg-white w-[134px] h-[70px] rounded-[18px] flex items-center justify-center absolute z-20 bottom-[10px] lg:left-6 md:left-5 left-4 transition-all duration-300 group-hover:translate-y-[-5px]">
                  <img src={BrandLogo} alt="BrandLogo"/>
                </div>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </section>
  );
}
