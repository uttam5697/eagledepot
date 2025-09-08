// import { FiArrowUpRight } from 'react-icons/fi';
// import { FaRegHeart } from 'react-icons/fa';
// import { AiFillHeart } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

type ProductCardProps = {
  imageUrl: string | undefined;
  title: string;
  id: number;
  slug: any
  price_per_box: number
  price: number
};

const ProductCard: React.FC<ProductCardProps> = ({ imageUrl, title ,slug,price}) => {
    // const [liked, setLiked] = useState(false);
    const navigate = useNavigate();

    return (
        <div  onClick={() => navigate(`/products/${slug}`)} className="group rounded-lg flex flex-col h-full bg-white md:p-2 p-1 shadow-sm transition-transform duration-300 hover:shadow-md">
            <div className="relative overflow-hidden h-full rounded-t-lg">
                <img
                    src={imageUrl}
                    alt={title}
                    className="w-full object-cover h-full transition-transform duration-300 group-hover:scale-105 rounded-t-lg"
                />
                {/* <button
                    onClick={() => setLiked(!liked)}
                    className="absolute top-2 right-2 bg-white lg:p-[11px] md:p-2 p-1 rounded-full shadow transition-transform duration-200 hover:bg-gray-100 hover:scale-110"
                >
                    {liked ? (
                        <AiFillHeart className="fill-red-500 text-red-500 lg:text-[18px] md:text-[16px] text-[14px]" />
                    ) : (
                        <FaRegHeart className="text-black lg:text-[18px] md:text-[16px] text-[14px]" />
                    )}
                </button> */}
            </div>

            <div className="mt-4 text-center px-[10px] pb-[10px]">
                <h3 className="xl:text-2sm lg:text-sm md:text-[14px] text-[12px] font-regular text-black leading-none lg:mb-3 md:mb-2 mb-1">{title}</h3>
                <div>
                    {/* {price_per_box && (
                        <p className="xl:text-xl lg:text-base md:text-2sm text-sm font-bold text-black leading-none">
                            ${price_per_box} <span className="xl:text-xl lg:text-base md:text-2sm text-sm font-bold"></span>
                        </p>
                    )} */}
                    {price && (
                        <p className="xl:text-xl lg:text-base md:text-2sm text-sm font-bold text-black leading-none">
                            ${price} / sqft
                        </p>
                    )}
                    <button onClick={() => navigate(`/products/${slug}`)} className="mx-auto mt-4 lg:py-[11px] md:py-[8px] py-[6px] lg:px-8 md:px-6 px-4 black-btn group before:!hidden after:!hidden">
                        Shop Now
                    </button>
                </div>

            </div>
            
        </div>
    );
};

export default ProductCard;
