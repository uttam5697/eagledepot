import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import ProductCard from "../ProductCard";
import SortDropdown from "../ui/SortDropdown";
import api from "../../lib/api";
import { useQuery, type QueryFunctionContext } from "@tanstack/react-query";
import ProductSkeleton from "../ui/ProductSkeleton";
import { useFooter } from "../../api/home";



export default function WeeklyBestsellers() {
    const prevRef = useRef<HTMLButtonElement>(null);
    const nextRef = useRef<HTMLButtonElement>(null);
    const [category, setCategory] = useState('');

    const fetchProductById = async (category: string) => {
        const formData = new FormData();
        formData.append('product_category_id', category);
        const { data } = await api.post(`/beforeauth/getproduct`, category === 'ALL' ? {} : formData);
        return data
    };

    const { data: productDataById, isLoading, refetch } = useQuery({
        queryKey: ["product", category],
        queryFn: () => fetchProductById(category as string),
        enabled: !!category,
    });

    // 3. Fetch product categories
    const getProductCategory = async (
        _ctx: QueryFunctionContext<[string]>
    ) => {
        const { data } = await api.post('/beforeauth/getproductcategory');
        return data;
    };

    const { data: productCategoryData } = useQuery({
        queryKey: ['productCategory'],
        queryFn: getProductCategory,
        refetchOnWindowFocus: false,
    });

    // 4. Sorting handler
    const handleSortChange = (value: string) => {
        console.log('Sorting by:', value);
        setCategory(value);
    };

    useEffect(() => {
        refetch()
    }, [category]);
    const { data: generaldata } = useFooter(false);
    return (
        <section
            className={` ${
                productDataById?.length && productDataById.length > 0
                ? 'overflow-hidden'
                : 'overflow-visible'
            } bg-primary-gradient xl:pt-[60px] lg:pt-[50px] md:pt-[40px] pt-[30px] xl:pb-[75px] lg:pb-[65px] md:pb-[55px] pb-[45px]`}
            >
            <div className="container">
                <div className="2xl:mb-10 xl:mb-8 lg:mb-6 mb-4 flex justify-between items-center flex-wrap">
                    <div>
                        <h1 className="text-black font-extralight 2xl:text-[40px] xl:text-[30px] lg:text-[24px] md:text-[20px] text-[18px] xl:leading-none leading-normal">
                            {generaldata?.weekly_bestsellers_title}
                        </h1>
                        <h1 className="text-black 2xl:text-[48px] xl:text-[38px] lg:text-[28px] md:text-[24px] text-[20px] leading-normal font-playfairDisplay -mt-3">
                            {generaldata?.weekly_bestsellers_sub_title}
                        </h1>
                    </div>
                    <div className="flex items-end md:gap-4 gap-2 flex-col">
                        <SortDropdown text="Sort by" sortbytext={false} width={"xl:w-[200px] lg:w-[180px] md:w-[160px] w-[140px]"} options={productCategoryData} onChange={handleSortChange} />
                        <div className="flex lg:gap-5 md:gap-3 gap-2 items-center">
                            <button
                                ref={prevRef}
                                className="hover:bg-black border-black group transition-all duration-300 ease-in-out border-[1px] lg:h-[54px] md:h-[44px] h-[34px] w-[34px] lg:w-[54px] md:w-[44px] rounded-full text-black flex items-center justify-center"
                            >
                                <BsArrowLeft className="text-black group-hover:text-white lg:text-[20px] text-[16px]" />
                            </button>
                            <button
                                ref={nextRef}
                                className="hover:bg-black border-black group transition-all duration-300 ease-in-out border-[1px] lg:h-[54px] md:h-[44px] h-[34px] w-[34px] lg:w-[54px] md:w-[44px] rounded-full text-black flex items-center justify-center"
                            >
                                <BsArrowRight className="text-black group-hover:text-white lg:text-[20px] text-[16px]" />
                            </button>
                        </div>
                    </div>

                </div>

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
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6 lg:gap-5 md:gap-4 gap-3">
                        {
                            isLoading
                                ? Array.from({ length:2  }).map((_, index) => (
                                    <ProductSkeleton key={index} />
                                ))
                                :
                                productDataById?.map((product: any) => (
                                    <SwiperSlide key={product.id} className="!h-auto">
                                        <ProductCard
                                            id={product.product_id}
                                            title={product.title}
                                            imageUrl={product.image}
                                            slug={product.slug}
                                            price_per_box={product.price_per_box}
                                            price={product.price}
                                        />
                                    </SwiperSlide>
                                ))
                        }
                    </div>
                </Swiper>
            </div>
        </section>
    )
}
