import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../../lib/api";
import ProductCard from "../ProductCard";
import ProductSkeleton from "../ui/ProductSkeleton";

type RelatedProductProps = {
  categoryId: string;
  excludeProductId: string; // 👈 pass current productId from details page
};

const PRODUCTS_PER_PAGE = 8;

const RelatedProduct: React.FC<RelatedProductProps> = ({
  categoryId,
  excludeProductId
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [isNextPage, setIsNextPage] = useState(true);

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
  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["product", categoryId, currentPage],
    queryFn: () => fetchProductPage(currentPage),
    enabled: !!categoryId,
    refetchOnWindowFocus: false,
    // keepPreviousData: true,
  }) as any;

  useEffect(() => {
    if (categoryId) {
      refetch();
    }
  }, [categoryId, refetch]);

  // 👇 remove the current product
  // const filteredProducts =
  //   products?.filter((p: any) => p.product_id !== excludeProductId) || [];

  const handleLoadMore = () => {
        if (isNextPage && !isFetching) {
            setCurrentPage((prev) => prev + 1);
        }
    };

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

  const  filteredProducts = allProducts.filter((product: any) => product.product_id !== excludeProductId); 

  return (
    <section className="my-12">
      <div className="container">
        {/* Section Title */}       
         <h2 className="font-extralight 2xl:text-[40px] xl:text-[30px] lg:text-[24px] md:text-[20px] text-[18px] xl:leading-none leading-normal">
              Related
            </h2>
            <h2 className="text-primary 2xl:text-[48px] xl:text-[38px] lg:text-[28px] md:text-[24px] text-[20px] leading-normal font-playfairDisplay -mt-3">
              Products
            </h2>
        {/* Grid */}
        <div>
          
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6 lg:gap-5 md:gap-4 gap-3 mt-6">
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
      </div>
    </section>
  );
};

export default RelatedProduct;
