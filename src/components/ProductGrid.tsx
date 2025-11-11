import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import AnimatedSection from "./ui/AnimatedSection";
import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";
import ProductSkeleton from "./ui/ProductSkeleton";

type CategoryListProps = {
    categoryId?: string;
    excludeProductId?: string; // 👈 pass current productId from details page
};

const PRODUCTS_PER_PAGE = 8;

const ProductList: React.FC<CategoryListProps> = ({ categoryId, excludeProductId }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [allProducts, setAllProducts] = useState<any[]>([]);
    const [isNextPage, setIsNextPage] = useState(true);

    // Fetch just the current page of products; never update outside state in queryFn!
    const fetchProductPage = async (page: number) => {
        const formData = new FormData();
        formData.append("product_category_id", categoryId || "");
        formData.append("page", String(page));
        formData.append("pagesize", String(PRODUCTS_PER_PAGE));
        const res = await api.post(`/beforeauth/getproduct`, formData);
        // All pagination meta inside res.data.* fields
        return res;
    };

    // Query for current page
    const { data, isLoading, isFetching } = useQuery({
        queryKey: ["product", categoryId, currentPage],
        queryFn: () => fetchProductPage(currentPage),
        enabled: !!categoryId,
        refetchOnWindowFocus: false,
        // keepPreviousData: true,
    }) as any;

    // Reset on categoryId change
    useEffect(() => {
        setAllProducts([]);
        setCurrentPage(1);
    }, [categoryId]);

    // Merge new page into products on successful fetch
    useEffect(() => {
        if (data && Array.isArray(data.data)) {
            setAllProducts((prev) =>
                currentPage === 1 ? data.data : [...prev, ...data.data]
            );
            setIsNextPage(data.is_next_page === "Y");
        }
    }, [data, currentPage]);

    const handleLoadMore = () => {
        if (isNextPage && !isFetching) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const  filteredProducts = allProducts.filter((product: any) => product.product_id !== excludeProductId); 

    return (
        <AnimatedSection direction="up" delay={0.2}>
            <section className='xl:mb-[140px] lg:mb-[120px] md:mb-[100px] mb-[80px] xl:mt-[160px] lg:mt-[140px] md:mt-[100px] mt-[80px]'>
                <div className="container">
                    <div className="flex items-center gap-2 md:flex-nowrap flex-wrap justify-between 2xl:mb-[60px] xl:mb-[50px] lg:mb-[40px] md:mb-[30px] mb-[20px]">
                        <h1 className="text-primary flex-none italic 2xl:text-[48px] xl:text-[38px] lg:text-[28px] md:text-[24px] text-[20px] leading-normal font-playfairDisplay">

                            {
                                filteredProducts?.find(
                                    (category: any) => category.product_category_id === Number(categoryId)
                                )?.title
                            }
                        </h1>
                        {/* <div className="flex items-center gap-4 w-full">
                            <span className="lg:text-2sm md:text-sm text-[12px] ml-auto flex-none">
                                Showing all 12 results
                            </span>
                            <SortDropdown text="Sort by" width="max-w-[300px]" sortbytext={true} options={sortOptions} onChange={handleSortChange} />
                        </div> */}
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6 lg:gap-5 md:gap-4 gap-3">
                        {/* First load - show skeletons */}
                        {isLoading && currentPage === 1 ? (
                            Array.from({ length: 8 }).map((_, index) => (
                                <ProductSkeleton key={index} />
                            ))
                        ) : (
                            filteredProducts?.map((product: any) => (
                                <ProductCard
                                    key={product.product_id}
                                    id={product.product_id}
                                    title={product.title}
                                    price={product.price}
                                    imageUrl={product.image}
                                    slug={product?.slug}
                                    price_per_box={product.price_per_box}
                                    // price_per_piece={product.price_per_piece}
                                    type={product.type}
                                />
                            ))
                        )}
                    </div>
                    {isNextPage && (
                        <div className="flex justify-center mt-6">
                            <button
                                className="px-6 py-2 bg-primary text-white rounded hover:bg-primary-dark transition disabled:opacity-50"
                                onClick={handleLoadMore}
                                disabled={isFetching}
                            >
                                {isFetching ? <span className="flex items-center gap-2">
                                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                    Loading...
                                </span> : "View More"}
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </AnimatedSection>
    );
};

export default ProductList;
