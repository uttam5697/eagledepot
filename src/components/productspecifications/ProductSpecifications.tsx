
type ProductSpecificationDetail = {
  product_specifications_id: number;
  title: string;
  sub_title: string;
  created_at: string;
};

type ProductSpecification = {
  product_specifications_id: number;
  product_id: number;
  title: string;
  created_at: string;
  product_specifications_detail: ProductSpecificationDetail[];
};

type Props = {
  product_specifications: ProductSpecification[];
};

export default function ProductSpecifications({ product_specifications }: Props) {
  return (
    <section className="xl:mb-[140px] lg:mb-[120px] md:mb-[100px] mb-[80px] mt-[60px]">
      <div className="container">
        <div className="bg-white rounded-[24px] xl:p-[30px] lg:p-6 md:p-5 p-4">
          <div className="2xl:mb-[60px] xl:mb-[50px] lg:mb-[40px] md:mb-[30px] mb-[20px]">
            <h2 className="font-extralight 2xl:text-[40px] xl:text-[30px] lg:text-[24px] md:text-[20px] text-[18px] xl:leading-none leading-normal">
              Product
            </h2>
            <h2 className="text-primary 2xl:text-[48px] xl:text-[38px] lg:text-[28px] md:text-[24px] text-[20px] leading-normal font-playfairDisplay -mt-3">
              Specifications
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 xl:gap-[30px] lg:gap-5 md:gap-4 gap-3">
            {product_specifications?.map((spec) => (
              <div
                key={spec.product_specifications_id}
                className="bg-light-white xl:p-5 lg:p-4 md:p-3 p-2 lg:rounded-[18px] md:rounded-[14px] rounded-[10px]"
              >
                <h5 className="xl:text-xl leading-none lg:text-lg md:text-base text-[14px] font-medium xl:pb-[30px] lg:pb-6 md:pb-5 pb-4 xl:mb-[18px] lg:mb-4 mb-3 border-b border-peru/20">
                  {spec.title}
                </h5>
                <ul className="flex flex-col xl:gap-[18px] lg:gap-4 gap-3">
                  {spec.product_specifications_detail.map((detail, index) => (
                    <li
                      key={index}
                      className="lg:text-[16px] md:text-[14px] text-[12px] border-b border-peru/20 xl:pb-[18px] lg:pb-4 pb-3 flex gap-2 justify-between items-center"
                    >
                      <p className="font-extralight leading-none">{detail.title}</p>
                      <p className="font-semibold leading-none text-end">{detail.sub_title}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
