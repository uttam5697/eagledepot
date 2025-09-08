import React from 'react';

const ProductSkeleton: React.FC = () => {
    return (
        <div className="animate-pulse rounded-[24px] bg-white md:p-2 p-1 shadow-sm">
            {/* Image Skeleton */}
            <div className="relative overflow-hidden rounded-[16px]">
                <div className="w-full h-[200px] max-w-[356px] max-h-[350px] bg-gray-200 rounded-[16px]"></div>
            </div>

            {/* Title Skeleton */}
            <div className="mt-4 text-center">
                <div className="mx-auto h-4 bg-gray-300 rounded mb-[14px] w-3/4"></div>

                {/* Price Placeholder (optional) */}
                <div className="mx-auto h-4 bg-gray-300 rounded mb-3 w-1/2"></div>

                {/* Button Skeleton */}
                <div className="lg:mb-[18px] md:mb-4 mb-3 lg:mt-5 md:mt-4 mt-3 flex justify-center">
                    <div className="flex items-center gap-2 bg-gray-200 rounded-md px-4 py-2 w-[120px] h-[38px]">
                        <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                        <div className="h-3 w-3/4 bg-gray-300 rounded"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductSkeleton;
