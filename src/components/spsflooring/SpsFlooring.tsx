import { useRef } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useFooter } from "../../api/home";
import { FiArrowUpRight } from "react-icons/fi";

export default function SpsFlooring({ productCategory }: any) {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();
  const { data: generaldata } = useFooter(false);
  return (
    <section className="xl:mb-[100px] overflow-hidden lg:mb-[80px] md:mb-[60px] mb-[40px] xl:mt-[100px] lg:mt-[80px] md:mt-[60px] mt-[40px]">
      <div className="container">
        {/* Header */}
        <div className="2xl:mb-10 xl:mb-8 lg:mb-6 md:mb-4 mb-2 flex justify-between items-center">
          <div>
            <h1 className="font-extralight 2xl:text-[40px] xl:text-[30px] lg:text-[24px] md:text-[20px] text-[18px] xl:leading-none leading-normal">
              {generaldata?.sps_flooring_title}
            </h1>
            <h1 className="text-primary 2xl:text-[48px] xl:text-[38px] lg:text-[28px] md:text-[24px] text-[20px] leading-normal font-playfairDisplay -mt-3">
              {generaldata?.sps_flooring_sub_title}
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

        {/* Swiper Slider */}
        <Swiper
          className="!overflow-visible"
          spaceBetween={12}
          slidesPerView="auto"
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
        >
          {productCategory?.map((item: any, index: number) => (
            <>
              <SwiperSlide key={index} className="!h-auto !w-auto">
                <div className="xl:h-[300px] xl:w-[300px] md:h-[250px] md:w-[250px] h-[220px] w-[220px] relative group overflow-hidden rounded-full">
                  <div className="relative h-full before:rounded-full rounded-full before:bg-black-gradient before:absolute before:w-full before:h-full before:z-10">
                    <img
                      className="rounded-full h-full object-cover object-center w-full transition-transform duration-500 group-hover:scale-110"
                      src={item.image}
                      alt="FlooringImg"
                    />
                    <div className="absolute backdrop-blur-[10px] rounded-2xl px-8 py-3 z-20 bottom-0 w-full p-[10px] -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 h-fit">
                        <h2 className="font-playfairDisplay text-white xl:text-[24px] lg:text-[20px] md:text-[18px] text-[16px] leading-none group-hover:hidden">
                          {item.title}
                        </h2>
                        <div className="absolute transition-transform duration-500 translate-y-[200%] group-hover:translate-y-0 group-hover:relative">
                          <h2 className="font-playfairDisplay mb-4 text-white xl:text-[24px] lg:text-[20px] md:text-[18px] text-[16px] leading-none">
                            {item.title}
                          </h2>
                          <p
                            className="font-quicksand text-white xl:text-[16px] lg:text-[14px] md:text-[12px] text-[12px] leading-none custom-html"
                            dangerouslySetInnerHTML={{
                              __html: item.description,
                            }}
                          />
                          <div
                            onClick={() =>
                              navigate(
                                `/products/category/${item.product_category_id}`
                              )
                            }
                            className="max-w-[188px]"
                          >
                            <a
                              href="#"
                              className="group text-black xl:text-[16px] lg:text-[14px] md:text-sm text-xs font-quicksand font-bold md:p-3 p-2 bg-white rounded-full flex justify-between items-center gap-4"
                            >
                              See Detail
                              <FiArrowUpRight className="lg:text-base md:text-2sm text-sm group-hover:rotate-45 duration-300 transition-all" />
                            </a>
                          </div>
                        </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            </>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
