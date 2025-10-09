import React, { useEffect } from 'react';
import ProductCard from './ProductCard';
// import SortDropdown from './ui/SortDropdown';
import AnimatedSection from './ui/AnimatedSection';
import { useQuery, type QueryFunctionContext } from "@tanstack/react-query";
import api from '../lib/api';
import ProductSkeleton from './ui/ProductSkeleton';

// const sortOptions = [
//     { label: 'Popularity', value: 'popularity' },
//     { label: 'Price: Low to High', value: 'low-high' },
//     { label: 'Price: High to Low', value: 'high-low' },
//     { label: 'Newest', value: 'newest' },
// ];
type CategoryListProps = {
    categoryId?: string | undefined;
};
const ProductList: React.FC<CategoryListProps> = ({ categoryId }) => {


    const fetchProductById = async (categoryId: string) => {
        const formData = new FormData();
        formData.append('product_category_id', categoryId);
        const { data } = await api.post(`/beforeauth/getproduct`, categoryId === 'ALL' ? {} : formData);
        return data;
    };

    const { data: productDataById, isLoading, refetch } = useQuery({
        queryKey: ["product", categoryId],
        queryFn: () => fetchProductById(categoryId!),
        enabled: false,
    });

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
    useEffect(() => {
        refetch();
    }, []);

    return (
        <AnimatedSection direction="up" delay={0.2}>
            <section className='xl:mb-[140px] lg:mb-[120px] md:mb-[100px] mb-[80px] xl:mt-[160px] lg:mt-[140px] md:mt-[100px] mt-[80px]'>
                <div className="container">
                    <div className="flex items-center gap-2 md:flex-nowrap flex-wrap justify-between 2xl:mb-[60px] xl:mb-[50px] lg:mb-[40px] md:mb-[30px] mb-[20px]">
                        <h1 className="text-primary flex-none italic 2xl:text-[48px] xl:text-[38px] lg:text-[28px] md:text-[24px] text-[20px] leading-normal font-playfairDisplay">
                            {
                                productCategoryData?.find(
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
                        {isLoading
                            ? Array.from({ length: 8 }).map((_, index) => (
                                <ProductSkeleton key={index} />
                            ))
                            : productDataById?.map((product: any) => (
                                <ProductCard
                                    key={product.product_id}
                                    id={product.product_id}
                                    title={product.title}
                                    price={product.price}
                                    imageUrl={product.image}
                                    slug={product?.slug}
                                    price_per_box={product.price_per_box}
                                />
                            ))}
                    </div>
                </div>
            </section>
        </AnimatedSection>
    );
};

export default ProductList;
