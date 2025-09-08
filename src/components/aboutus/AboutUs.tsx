import { useAbout } from "../../api/home";
import AnimatedSection from "../ui/AnimatedSection";
import WhatOurClients from "../whatourclients/WhatOurClients";

export default function AboutUs() {
  const { data: aboutdata } = useAbout(false);
  return (
    <>
      <AnimatedSection direction="up" delay={0.2}>
        <div className="flex xl:mb-[100px] lg:mb-[80px] md:mb-[60px] mb-[40px]">
          <div className="bg-cover bg-center w-full h-full 2xl:min-h-[990px] xl:min-h-[890px] lg:min-h-[790px] md:min-h-[690px] sm:min-h-[590px] min-h-[490px] relative before:bg-black-light-gradient before:absolute before:w-full before:h-full before:z-1 after:bg-black-dark-light-gradient after:absolute after:w-full after:h-full after:top-0 after:z-1" style={{ backgroundImage: `url(${aboutdata?.image})` }}>
            <div className="container relative z-10">
              <div className="mt-[191px]">
                <div className="max-w-[950px]">
                  <h1
                    className="text-white -tracking-[0.48px] 2xl:text-5xl xl:text-4.5xl 2xl:leading-[90px] xl:leading-[60px] leading-none lg:text-4xl md:text-3xl text-2xl font-light"
                    data-swiper-parallax="-1000"
                  >
                    {aboutdata?.banner_title}
                  </h1>
                  <div
                    className="text-white italic -tracking-[0.48px] 2xl:text-5xl xl:text-4.5xl lg:text-4xl md:text-3xl text-2xl xl:leading-none leading-normal font-playfairDisplay"
                    data-swiper-parallax="-1000"
                  >
                    {aboutdata?.banner_sub_title}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>
     
     <AnimatedSection direction="up" delay={0.2}>
      <section className="xl:mb-[100px] lg:mb-[80px] md:mb-[60px] mb-[40px]">
        <div className="container">
            <div className="xl:mb-[50px] lg:mb-[40px] md:mb-[30px] mb-[20px]">
                <h1 className="font-extralight 2xl:text-4.5xl xl:text-4xl lg:text-3xl md:text-2xl text-base xl:leading-none leading-normal">{aboutdata?.title}</h1>
                <h1 className="text-primary 2xl:text-5xl xl:text-4.5xl lg:text-4xl md:text-3xl text-2xl xl:leading-none leading-normal font-playfairDisplay -mt-3">{aboutdata?.sub_title}</h1>
            </div>
            <div className="flex flex-col gap-4">
                <div dangerouslySetInnerHTML={{ __html: aboutdata?.description }} />
            </div>
        </div>
    </section>
    </AnimatedSection>
      <AnimatedSection direction="up" delay={0.2}>
        <WhatOurClients />
      </AnimatedSection>
      
    </>
  )
}
