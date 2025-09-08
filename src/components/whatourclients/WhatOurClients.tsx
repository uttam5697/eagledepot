import { useRef } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { useFooter, useHome } from "../../api/home";

export default function WhatOurClients() {
  const { data: homedata } = useHome(false);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const { data: generaldata } = useFooter(false);
  
  return (
    <section className="xl:mb-[100px] overflow-hidden lg:mb-[80px] md:mb-[60px] mb-[40px]">
      <div className="container">
        <div className="2xl:mb-[60px] xl:mb-[50px] lg:mb-[40px] md:mb-[30px] mb-[20px] flex justify-between items-center">
          <div>
            <h1 className="text-black font-extralight 2xl:text-4.5xl xl:text-4xl lg:text-3xl md:text-2xl text-base xl:leading-none leading-normal">
              {generaldata?.clients_say_title}
            </h1>
            <h1 className="text-primary 2xl:text-5xl xl:text-4.5xl lg:text-4xl md:text-3xl text-2xl xl:leading-none leading-normal font-playfairDisplay -mt-3">
              {generaldata?.clients_say_sub_title}
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
          className="!overflow-visible"
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
              slidesPerView: 1.2,
              spaceBetween: 10,
            },
            768: {
              slidesPerView: 1.3,
              spaceBetween: 15,
            },
            1024: {
              slidesPerView: 2.2,
              spaceBetween: 24,
            },
            1300: {
              slidesPerView: 2.2,
              spaceBetween: 24,
            },
          }}
        >
          {/* <SwiperSlide className="pb-4">
            <div className="bg-white xl:p-10 lg:p-8 md:p-6 p-4 rounded-[34px] group hover:shadow-md transition-all duration-300 ease-in-out">
              <h4 className="text-black mb-[14px] font-playfairDisplay 2xl:text-[32px] xl:text-2xl lg:text-xl md:text-base text-2sm leading-none">
                Mark Cope
              </h4>
              <p className="text-primary font-light xl:mb-[36px] lg:mb-[26px] md:mb-5 mb-4 leading-none lg:text-[16px] md:text-[14px] text-[12px]">CEO of Hillstone</p>
              <p className="font-extralight xl:mb-[36px] lg:mb-[26px] md:mb-5 mb-4">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book. Lorem
                Ipsum is simply dummy text of the printing and typesetting
                industry.
              </p>
              <div className="w-[90px] h-[90px] rounded-[24px] overflow-hidden">
                <img src={ClientImg} alt="ClientImg" className="w-[90px] h-[90px] rounded-[24px] transition-all duration-300 ease-in-out group-hover:scale-105 object-cover" />
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide className="pb-4">
            <div className="bg-white xl:p-10 lg:p-8 md:p-6 p-4 rounded-[34px] group hover:shadow-md transition-all duration-300 ease-in-out">
              <h4 className="text-black mb-[14px] font-playfairDisplay 2xl:text-[32px] xl:text-2xl lg:text-xl md:text-base text-2sm leading-none">
                Jenny Tom
              </h4>
              <p className="text-primary font-light xl:mb-[36px] lg:mb-[26px] md:mb-5 mb-4 leading-none lg:text-[16px] md:text-[14px] text-[12px]">CEO of Cartel Studio</p>
              <p className="font-extralight xl:mb-[36px] lg:mb-[26px] md:mb-5 mb-4">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. Lorem Ipsum is simply dummy text of the printing and typesetting industry.
              </p>
              <div className="w-[90px] h-[90px] rounded-[24px] overflow-hidden">
                <img src={ClientImg2} alt="ClientImg" className="w-[90px] h-[90px] rounded-[24px] transition-all duration-300 ease-in-out group-hover:scale-105 object-cover" />
              </div>
            </div>
          </SwiperSlide> */}
          {
            homedata?.client_say
              ?.map((client: any) => (
                <SwiperSlide className="pb-4 !h-auto">
                  <div className="bg-white h-full flex flex-col xl:p-10 lg:p-8 md:p-6 p-4 rounded-[34px] group hover:shadow-md transition-all duration-300 ease-in-out">
                    <h4 className="text-black mb-[14px] font-playfairDisplay 2xl:text-[32px] xl:text-2xl lg:text-xl md:text-base text-2sm leading-none">
                      {client.name}
                    </h4>
                    <p className="text-primary font-light xl:mb-[36px] lg:mb-[26px] md:mb-5 mb-4 leading-none lg:text-[16px] md:text-[14px] text-[12px]">{client.designation}</p>
                    <p className="font-extralight xl:mb-[36px] lg:mb-[26px] md:mb-5 mb-4">
                      {client.description}
                    </p>
                    <div className="w-[90px] h-[90px] mt-auto rounded-[24px] overflow-hidden">
                      <img src={client.image} alt="ClientImg" className="w-[90px] h-[90px] rounded-[24px] transition-all duration-300 ease-in-out group-hover:scale-105 object-cover" />
                    </div>
                  </div>
                </SwiperSlide>
              ))
          }
        </Swiper>
      </div>
    </section>
  );
}
