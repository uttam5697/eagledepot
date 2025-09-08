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
            <h1 className="font-extralight 2xl:text-4.5xl xl:text-4xl lg:text-3xl md:text-2xl text-base xl:leading-none leading-normal">
              {generaldata?.sps_flooring_title}
            </h1>
            <h1 className="text-primary 2xl:text-5xl xl:text-4.5xl lg:text-4xl md:text-3xl text-2xl xl:leading-none leading-normal font-playfairDisplay -mt-3">
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
          slidesPerView={1.5}
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
              slidesPerView: 1.5,
              spaceBetween: 10,
            },
            540: {
              slidesPerView: 2.5,
              spaceBetween: 10,
            },
            768: {
              slidesPerView: 2.5,
              spaceBetween: 15,
            },
            1024: {
              slidesPerView: 3.5,
              spaceBetween: 24,
            },
            1300: {
              slidesPerView: 4.2,
              spaceBetween: 24,
            },
          }}
        >
          {productCategory?.map((item: any, index: number) => (
            <>
              <SwiperSlide key={index} className="!h-auto">
                <div className="w-full xl:h-[420px] lg:h-[380] md:h-[340px] h-[300px] relative group overflow-hidden rounded-[30px]">
                  <div className="relative h-full before:rounded-[30px] before:bg-black-gradient before:absolute before:w-full before:h-full before:z-10">
                    <img
                      className="rounded-[30px] h-full object-cover object-center w-full transition-transform duration-500 group-hover:scale-110"
                      src={item.image}
                      alt="FlooringImg"
                    />
                    <div className="absolute z-20 bottom-0 w-full p-[10px]">
                      <div className=" backdrop-blur-[10px] rounded-2xl px-4 py-3">
                        <h2 className="font-playfairDisplay text-white xl:text-4xl lg:text-3xl md:text-2xl text-base leading-none group-hover:hidden">
                          {item.title}
                        </h2>
                        <div className="absolute transition-transform duration-500 translate-y-full group-hover:translate-y-0 group-hover:relative">
                          <h2 className="font-playfairDisplay text-white xl:text-4xl lg:text-3xl md:text-2xl text-base leading-none">
                            {item.title}
                          </h2>
                          <p
                            className="font-quicksand text-white xl:text-[20px] lg:text-[16px] md:text-[14px] text-[12px] leading-none custom-html"
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
                              className="group text-black xl:text-[18px] lg:text-[16px] md:text-sm text-xs font-quicksand font-bold md:px-4 px-3 lg:py-[18px] md:py-4 py-3 bg-white rounded-full flex justify-between items-center gap-4"
                            >
                              See Detail
                              <FiArrowUpRight className="lg:text-base md:text-2sm text-sm group-hover:rotate-45 duration-300 transition-all" />
                            </a>
                          </div>
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
