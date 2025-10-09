import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../../lib/api";
import ProductCard from "../ProductCard";
import ProductSkeleton from "../ui/ProductSkeleton";

type RelatedProductProps = {
  categoryId: string;
  excludeProductId: string; // 👈 pass current productId from details page
};

const fetchProductById = async (category: string) => {
  const formData = new FormData();
  formData.append("product_category_id", category);
  const { data } = await api.post(
    `/beforeauth/getproduct`,
    category === "ALL" ? {} : formData
  );
  return data;
};

const RelatedProduct: React.FC<RelatedProductProps> = ({
  categoryId,
  excludeProductId,
}) => {
  const [visibleCount, setVisibleCount] = useState(4);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const { data: products, isLoading, refetch } = useQuery({
    queryKey: ["related-products", categoryId],
    queryFn: () => fetchProductById(categoryId),
    enabled: !!categoryId,
  });

  useEffect(() => {
    if (categoryId) {
      refetch();
      setVisibleCount(4); // reset when category changes
    }
  }, [categoryId, refetch]);

  // 👇 remove the current product
  const filteredProducts =
    products?.filter((p: any) => p.product_id !== excludeProductId) || [];

  const handleViewMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 4);
      setIsLoadingMore(false);
    }, 300); // 👈 fake loader delay (smooth UX)
  };

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
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))
            : filteredProducts
                .slice(0, visibleCount)
                .map((product: any) => (
                  <ProductCard
                    key={product.product_id}
                    id={product.product_id}
                    title={product.title}
                    price={product.price}
                    imageUrl={product.image}
                    slug={product.slug}
                    price_per_box={product.price_per_box}
                  />
                ))}
        </div>

        {/* View More Button */}
        {visibleCount < filteredProducts.length && (
          <div className="flex justify-center mt-8">
            <button
              onClick={handleViewMore}
              disabled={isLoadingMore}
              className="px-8 py-3 border border-primary text-primary rounded-full text-sm md:text-base font-medium transition duration-300 hover:bg-primary hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoadingMore ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Loading...
                </span>
              ) : (
                "View More"
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default RelatedProduct;
