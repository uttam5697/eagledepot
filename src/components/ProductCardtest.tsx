import React from 'react';
import { Heart, ShoppingCart } from 'lucide-react';

type ProductCardProps = {
  imageUrl: string | undefined;
  title: string;
  price: number;
};

const ProductCard: React.FC<ProductCardProps> = ({ imageUrl, title, price }) => {
  return (
    <div className="group max-w-sm rounded-2xl bg-white p-2 shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.02]">
      <div className="relative overflow-hidden rounded-xl">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-48 object-cover transform transition-transform duration-300 group-hover:scale-105"
        />
        <button className="absolute top-2 right-2 bg-white p-[11px] rounded-full shadow hover:bg-gray-100 hover:scale-110 transition-transform duration-200">
          <Heart size={14} />
        </button>
      </div>

      <div className="mt-3 text-center">
        <h3 className="text-sm font-medium text-black">{title}</h3>
        <p className="mt-1 text-xl font-bold text-black">
          ${price.toFixed(2)} <span className="text-xl font-bold">/ sqft</span>
        </p>

        <button className="mb-[26px] mt-[21px] flex items-center justify-center gap-2 w-full rounded-full bg-black px-4 py-2 text-white font-semibold transition-all duration-300 hover:bg-gray-800 hover:shadow-lg hover:scale-[1.01]">
          Add To Cart
          <ShoppingCart />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
