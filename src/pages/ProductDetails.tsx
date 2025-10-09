import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { TiSocialYoutube } from "react-icons/ti";
import Breadcrumbs from '../components/ui/Breadcrumbs';
import QuantityInputGroup from '../components/ui/QuantityInputGroup';
import { FiArrowUpRight, FiShoppingCart } from 'react-icons/fi';
import { MdVideocam } from "react-icons/md";
import { ProductSpecifications } from '../components';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, type QueryFunctionContext } from '@tanstack/react-query';
import api from '../lib/api';
import { showToast } from '../utils/toastUtils';
import { useUser } from '../components/context/UserContext';
import { paths } from '../config/path';
import { useCart } from '../api/cart';
import RelatedProduct from '../components/relatedProduct/RelatedProduct';

export default function ProductDetailPage() {
    const { slug } = useParams();
    const { data: productDataById, refetch } = useQuery({
        queryKey: ["product", slug],
        queryFn: () => fetchProductById(slug as string),
        enabled: false,
    });
    const { data: cartdata, refetch: refetchCart } = useCart(true);
    const sqftPerBox = productDataById?.sqft_in_box; // 1 box covers 13.47 sqft
    const [addWastage, setAddWastage] = useState(false);
    const [baseSqft, setBaseSqft] = useState(0); // always without wastage
    // const [boxes, setBoxes] = useState(1);
    const [isBuyNowClicked, setIsBuyNowClicked] = useState(false);
    const [productGallery, setProductGallery] = useState([]);
    // const [sqft, setSqft] = useState(0);
    const [cartLoading, setCartLoading] = useState(false); // Loader
    // const [isWastageChecked, setIsWastageChecked] = useState(false);
    // const [originalSqft, setOriginalSqft] = useState(0);

    const navigate = useNavigate();
    const authKey = useUser()?.authKey;

    useEffect(() => {
        if (productDataById?.sqft_in_box) {
            setBaseSqft(Number(productDataById.sqft_in_box || 0));
        }
    }, [productDataById]);

    // const getBoxesForSqft = (rawSqft: number, coverage: number) => {
    //     const effective = rawSqft;
    //     const boxesNeeded = Math.max(1, Math.ceil(effective / Number(coverage)));
    //     setBoxes(boxesNeeded);
    //     return boxesNeeded;
    // };

    function getYouTubeVideoID(url: any) {
        try {
            const parsedUrl = new URL(url);
            const hostname = parsedUrl.hostname;
            // Case: youtu.be/<id>
            if (hostname === 'youtu.be') {
                return parsedUrl.pathname.slice(1);
            }
            // Case: youtube.com/watch?v=<id>
            if (parsedUrl.pathname === '/watch') {
                return parsedUrl.searchParams.get('v');
            }
            // Case: youtube.com/shorts/<id>, /embed/<id>, /v/<id>
            const pathMatch = parsedUrl.pathname.match(/^\/(shorts|embed|v)\/([a-zA-Z0-9_-]{11})/);
            if (pathMatch) {
                return pathMatch[2];
            }
            return null; // Not a valid YouTube video URL
        } catch (e) {
            return null; // Invalid URL format
        }
    }
    function getYouTubeThumbnailURL(url: string, quality = "hqdefault") {
        const videoId = getYouTubeVideoID(url);
        if (!videoId) return null;
        return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
    }

    const [mainImage, setMainImage] = useState<any>();

    const handleGalleryImageClick = (media: any) => setMainImage(media);


    const fetchProductById = async (slug: string) => {
        const formData = new FormData();
        formData.append('slug', slug);
        const { data } = await api.post(`/beforeauth/getproductdetails`, formData);
        // setSqft(Number(data?.sqft_in_box))
        setProductGallery(data?.product_image);
        setMainImage(data?.product_image[0]);
        return data
    };
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
    const category = productCategoryData?.find((item: any) => item.product_category_id
        === productDataById?.product_category_id);

   

    const breadcrumbData = [
        { label: 'Home', href: '/' },
        { label: `${category?.title}`, href: `/products/category/${productDataById?.product_category_id}` },
        { label: `${productDataById?.title}` }
    ];

    useEffect(() => {
        refetch();
    }, [slug])

    const handleAddToCart = async () => {
        if (displaySqft <= 0) {
            showToast("Please enter sqft", "error");
            return
        }
        setCartLoading(true);
        //  if(cartdata?.find((item: any) => item.product_id === productDataById?.product_id)) {
        //       re  navigate("/my-cart");
        //     }
        if (cartdata?.some((item: any) => item.product_id === productDataById?.product_id)) {
            setCartLoading(false);
            setIsBuyNowClicked(false);
            navigate("/my-cart");
            return;
        }
        if (authKey) {
            const formData = new FormData();
            formData.append('Usercarts[product_id]', productDataById?.product_id);
            // formData.append('user_carts_id', productDataById?.id);
            formData.append('Usercarts[price]', productDataById?.price);
            formData.append('Usercarts[quantity]', boxes.toString());
            try {
                const response = await api.post("/userauth/addeditusercarts", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "auth_key": authKey
                    },
                });

                if (response.status === 1) {
                    refetchCart();
                    navigate(`${paths.mycart.path}`);
                    showToast("Product added to cart", "success");
                    // navigate(`${paths.home.path}`);
                } else {
                    showToast("Failed to add to cart", "error");
                }

            } catch (error: any) {
                console.error("Error adding to cart:", error);
                showToast(error?.response?.data?.message || "An error occurred", "error");
            }
        } else {
            navigate(`${paths.login.path}?redirect=${window.location.pathname + window.location.search}`);
            showToast("Please login first");
        }
        setCartLoading(false);
        setIsBuyNowClicked(false);
    };
    // 📌 Update from sqft (manual typing or buttons)
    const updateFromSqft = (newSqft: number) => {
        // remove wastage if applied
        let actualSqft = addWastage ? newSqft / 1.1 : newSqft;
        setBaseSqft(actualSqft);
    };

    // 📌 Update from boxes
    const updateFromBoxes = (newBoxes: number) => {
        // Always back-calc base sqft (without wastage)
        let newBaseSqft = newBoxes * sqftPerBox;
        setBaseSqft(newBaseSqft);
    };

    // 📌 Displayed sqft (depends on wastage)
    const displaySqft = addWastage
        ? parseFloat((baseSqft * 1.1)?.toFixed(2))
        : parseFloat(baseSqft?.toFixed(2));

    // 📌 Boxes (calculated dynamically from displaySqft)
    const boxes = Math.ceil(displaySqft / sqftPerBox);

    // 📌 Toggle wastage
    const handleWastageToggle = (checked: boolean) => {
        setAddWastage(checked);
    };


    // THIS GOES RIGHT BEFORE YOUR NORMAL RETURN
    if (!productDataById) {
        return <div>Loading...</div>;
    }
    return (
        <div className="container xl:my-[60px] lg:my-[50px] md:my-[40px] my-[30px]">
            <Breadcrumbs items={breadcrumbData} />
            <div className="grid grid-cols-1 xl:mt-[30px] lg:mt-6 md:mt-5 mt-4 md:grid-cols-2 gap-6 ">
                <div className="">
                    <div className="border w-full rounded-2xl bg-[#f6f6f6] overflow-hidden">
                        {mainImage?.type === 'Video' && mainImage?.video ? (
                            <video src={mainImage.video} controls className="w-full h-full max-h-[636px] object-cover" />
                        ) : mainImage?.type === 'Youtube' && mainImage?.video_url ? (
                            <iframe
                                className="w-full aspect-video w-full  max-h-[636px] h-full object-cover"
                                // src={mainImage.video_url}
                                src={`https://www.youtube.com/embed/${getYouTubeVideoID(mainImage.video_url)}`}
                                title="YouTube Video"
                                allowFullScreen
                            ></iframe>
                        ) : (
                            <img src={mainImage?.file} alt="Main" className="w-full  max-h-[636px] h-full object-cover" />
                        )}
                    </div>

                    {/* Thumbnails Swiper */}
                    <div className="relative">
                        <div className="">
                            <Swiper
                                // spaceBetween={20}
                                slidesPerView="auto"
                                loop={false}
                                modules={[Navigation]}
                                navigation={{
                                    nextEl: ".swiper-button-next-custom",
                                    prevEl: ".swiper-button-prev-custom",
                                }}
                                className="pb-8"
                                spaceBetween={12}
                            // breakpoints={{
                            //     540: {
                            //         slidesPerView: 4,
                            //         spaceBetween: 12,
                            //     },
                            //     768: {
                            //         slidesPerView: 3,
                            //         spaceBetween: 12,
                            //     },
                            //     1024: {
                            //         slidesPerView: 3,
                            //         spaceBetween: 16,
                            //     },
                            //     1300: {
                            //         slidesPerView: 4,
                            //         spaceBetween: 20,
                            //     },
                            // }}
                            >
                                {productGallery?.map((media: any, index: number) => {
                                    const isActive =
                                        mainImage?.type === media?.type &&
                                        (
                                            (media?.type === 'Image' && mainImage?.file === media?.file) ||
                                            (media?.type === 'Video' && mainImage?.video === media?.video) ||
                                            (media?.type === 'Youtube' && mainImage?.video_url === media?.video_url)
                                        );

                                    return (
                                        <SwiperSlide key={index} className='!w-auto'>
                                            <div
                                                onClick={() => handleGalleryImageClick(media)}
                                                className={`mt-5 overflow-hidden cursor-pointer rounded-[16px] transition-all duration-200 lg:!w-[144px] md:!w-[124px] md:!h-[124px] !h-[104px] !w-[104px] lg:!h-[144px] object-cover object-center ${isActive
                                                    ? "border-primary border-[3px] rounded-xl"
                                                    : "hover:border-primary border-transparent border-[3px] rounded-xl"
                                                    }`}
                                            >
                                                {media?.type === 'Video' && media?.video ? (
                                                    <div className='relative h-full'>
                                                        <video
                                                            src={media.video}
                                                            className="w-full h-full object-cover"
                                                            muted
                                                            onMouseOver={(e) => e.currentTarget.play()}
                                                            onMouseOut={(e) => e.currentTarget.pause()}
                                                        />
                                                        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                                                            <MdVideocam className='text-primary xl:text-[30px] lg:text-[24px] md:text-[20px] text-[16px] md:p-1 p-[2px] bg-white rounded-full' />
                                                        </div>
                                                    </div>
                                                ) : media?.type === 'Youtube' && media?.video_url ? (
                                                    <div className='relative'>
                                                        <img
                                                            className="lg:w-[144px] md:w-[124px] md:h-[124px] h-[104px] w-[104px] lg:h-[144px] object-cover object-center"
                                                            src={getYouTubeThumbnailURL(media.video_url) ?? undefined}
                                                            title={`YouTube video ${index}`}
                                                        />
                                                        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                                                            <TiSocialYoutube className='text-primary xl:text-[30px] lg:text-[24px] md:text-[20px] text-[16px] md:p-1 p-[2px] bg-white rounded-full' />
                                                        </div>
                                                    </div>

                                                ) : (
                                                    <img
                                                        src={media?.file}
                                                        alt={`thumb-${index}`}
                                                        className="lg:w-[144px] md:w-[124px] md:h-[124px] h-[104px] w-[104px] lg:h-[144px] object-cover object-center"
                                                    />
                                                )}
                                            </div>
                                        </SwiperSlide>
                                    );
                                })}
                            </Swiper>
                        </div>
                        {<div className="swiper-button-prev-custom absolute z-20 mt-[10px] top-1/2 left-0 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-yellow-50 cursor-pointer">
                            <svg
                                className="w-5 h-5 text-gray-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                        </div>}

                        <div className="swiper-button-next-custom absolute z-20 mt-[10px] top-1/2 right-0 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-yellow-50 cursor-pointer">
                            <svg
                                className="w-5 h-5 text-gray-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="  text-black">
                    {/* Title */}
                    <h1 className="2xl:text-[40px] xl:text-[30px] lg:text-[24px] md:text-[20px] text-[18px] leading-none font-playfairDisplay italic mb-2">
                        {productDataById?.title}
                    </h1>
                    <div className=' my-4'>
                        <h5 className='xl:text-3xl lg:text-2xl md:text-base text-2sm leading-none font-bold inline-block lg:mb-5 md:mb-4 mb-3'><span className="text-primary"> ${productDataById?.price}</span> / sqft <p className='xl:text-sm inline-block text-xm leading-none font-bold'>({productDataById?.sqft_in_box} sqft/Box)</p></h5>
                        <div className='flex items-center lg:gap-5 md:gap-4 gap-3 flex-wrap'>
                            {productDataById?.main_price && (
                                <p className="xl:text-lg lg:text-base md:text-sm text-xs leading-none font-medium text-gray-500 line-through">
                                    ${productDataById?.main_price} / sqft
                                </p>
                            )}
                            {productDataById?.save_button_price &&
                                <span className='bg-primary text-white font-semibold xl:text-[18px] lg:text-[16px] md:text-[14px] text-[12px] py-[5px] lg:px-[14px] md:px-[12px] px-[10px] rounded-[12px] leading-none'>{productDataById?.save_button_price}</span>
                            }
                        </div>
                        <p className='custom-html  md:text-[14px] text-[12px] leading-none mt-[15px]' dangerouslySetInnerHTML={{ __html: productDataById?.description }} />
                    </div>

                    {/* Shipping note */}




                    <div className="grid md:grid-cols-5 w-full items-center gap-4 bg-[#FAF8F6] p-4 rounded-md ">
                        {/* SQFT Input */}
                        <div className="col-span-2 ">
                            <QuantityInputGroup
                                label="Enter Coverage in SQFT:"
                                value={displaySqft}
                                onDecrease={() => updateFromSqft(Math.max(displaySqft - 1, 0))}
                                onIncrease={() => updateFromSqft(displaySqft + 1)}
                                onChange={(newVal) => updateFromSqft(Number(newVal))}
                                iconType="arrow"
                            // unit="sqft"
                            />
                        </div>

                        {/* Equals Sign */}
                        <div className="text-2xl font-bold text-center col-span-1 mt-5 md:block hidden">=</div>

                        {/* Boxes Input */}
                        <div className="col-span-2">
                            <QuantityInputGroup
                                label="# of Boxes"
                                value={boxes}
                                onDecrease={() => updateFromBoxes(Math.max(boxes - 1, 1))}
                                onIncrease={() => updateFromBoxes(boxes + 1)}
                                onChange={(newVal) => updateFromBoxes(Number(newVal))}
                                iconType="plusminus"
                            // unit="box"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 mt-4 items-start">
                        {/* <div className="mb-6">
                            

                            <div className=" p-3 bg-[#FAF8F6] rounded-md flex flex-col items-start">
                                <span className="text-xs uppercase text-gray-500 tracking-[0.05em] mb-1 font-semibold">Total price</span>
                                <span className="text-2xl font-extrabold text-black">
                                    {(sqft * productDataById?.price).toFixed(2)}
                                </span>
                                <span className="text-xs text-gray-400 font-normal">
                                    for <span className="font-medium">{sqft}</span> sqft
                                </span>
                            </div>
                        </div> */}
                        {
                            displaySqft > 0 &&
                            <div>
                                <label className="inline-flex items-start gap-2">
                                    <input
                                        type="checkbox"
                                        className="mt-[6px] accent-black border-gray-300 h-[16px] w-[16px]"
                                        checked={addWastage}
                                        onChange={(e) => handleWastageToggle(e.target.checked)}
                                    />
                                    <div>
                                        <p className="font-semibold lg:text-base md:text-2sm text-sm">Add wastage (10%)</p>
                                        <p className="lg:text-base md:text-2sm text-sm font-light">1 box - No wastage added. Ships in 1 pallet.</p>
                                    </div>
                                </label>
                            </div>
                        }
                    </div>
                    {/* <div className="grid grid-cols-2 gap-4 items-start mt-[84px]">
                        <button onClick={handleAddToCart} className="flex justify-between white-btn border border-black group before:!hidden after:!hidden hover:bg-black xl:px-6 px-4 xl:py-[18px] py-[14px]">
                            <span className='leading-none'> Add to Cart</span>
                            <FiShoppingCart className='text-2sm  duration-300 transition-all' />
                        </button>
                        <Link to="/my-cart" className="flex justify-between black-btn group before:!hidden after:!hidden xl:px-6 px-4 xl:py-[18px] py-[14px]">
                            <span className='leading-none'>Buy Now</span>
                            <FiArrowUpRight className='text-2sm group-hover:rotate-45 duration-300 transition-all' />
                        </Link>
                    </div> */}

                    <div className="grid grid-cols-2 gap-4 items-start mt-[84px]">
                        <button onClick={handleAddToCart} className="flex justify-between white-btn border border-black group before:!hidden after:!hidden hover:bg-black xl:px-6 px-4 xl:py-[18px] py-[14px]">
                            <span className="flex items-center leading-none">
                                {!isBuyNowClicked && cartLoading ? (
                                    <>
                                        <svg
                                            className="animate-spin h-5 w-5 mr-2 text-black group-hover:text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="4"
                                                d="M4 12a8 8 0 018-8"
                                            ></path>
                                        </svg>
                                        Going to Cart
                                    </>
                                ) : (
                                    "Add to Cart"
                                )}
                            </span>


                            <FiShoppingCart className='text-2sm  duration-300 transition-all' />
                        </button>
                        <button onClick={() => {
                            handleAddToCart();
                            setIsBuyNowClicked(true);
                        }} className="flex justify-between black-btn group before:!hidden after:!hidden xl:px-6 px-4 xl:py-[18px] py-[14px]">
                            <span className='leading-none'>
                                Buy Now
                            </span>
                            <FiArrowUpRight className='text-2sm group-hover:rotate-45 duration-300 transition-all' />
                        </button>
                    </div>
                </div>
            </div>
            {productDataById?.product_specifications.length > 0 &&
                <ProductSpecifications product_specifications={productDataById?.product_specifications} />}

            {
                <RelatedProduct
                    categoryId={productDataById?.product_category_id}
                    excludeProductId={productDataById?.product_id}
                />
            }
        </div>
    );
}
