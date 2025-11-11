const ProductSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse group rounded-lg flex flex-col h-full bg-white md:p-2 p-1 shadow-sm">
      {/* Image Placeholder */}
      <div className="relative overflow-hidden h-40 rounded-t-lg bg-gray-200"></div>

      {/* Text & Button Placeholder */}
      <div className="mt-4 text-center px-[10px] pb-[10px] flex flex-col gap-2">
        {/* Title */}
        <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>

        {/* Price */}
        <div className="h-4 bg-gray-300 rounded w-1/3 mx-auto"></div>

        {/* Button */}
        <div className="h-8 bg-gray-300 rounded w-2/3 mx-auto mt-2"></div>
      </div>
    </div>
  );
};

export default ProductSkeleton;
