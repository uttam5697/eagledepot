import { FaAward, FaHeadset, FaShieldAlt } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import AnimatedSection from "../ui/AnimatedSection";
import api from "../../lib/api";

type WarrantyDocument = {
  warranty_document_id: number;
  warranty_id: number;
  title: string;
  file: string;
  created_at: string;
  updated_at: string | null;
};

type WarrantyCertificate = {
  warranty_certificate_id: number;
  image: string;
  created_at: string;
  updated_at: string | null;
};

type WarrantyData = {
  warranty_id: number;
  label: string;
  title: string;
  sub_title: string;
  image: string;
  document: WarrantyDocument[];
  certificate: WarrantyCertificate[];
};

type WarrantyApiResponse = {
  status: number;
  data: WarrantyData;
} | WarrantyData;

const fallbackWarranty: WarrantyData = {
  warranty_id: 0,
  label: "Our Commitment",
  title: "10-Year Limited Warranty",
  sub_title:
    "We stand behind our quality. Enjoy peace of mind with our 10-year limited warranty on all installations.",
  image: "https://eagleflooringdepot.com/eagleflooringdepot/uploads/images/warranty/0abp5hzdm6849mtgncjpat3x41tk2lbb.png",
  document: [],
  certificate: [],
};

const getWarrantyData = async (): Promise<WarrantyData> => {
  const res = (await api.get("/beforeauth/getwarranty")) as unknown as WarrantyApiResponse;
  return "data" in res && res.data ? res.data : res as WarrantyData;
};

export default function Warranty() {
  const { data } = useQuery({
    queryKey: ["warranty"],
    queryFn: getWarrantyData,
    refetchOnWindowFocus: false,
  });

  const warranty = data ?? fallbackWarranty;
  const warrantyDocuments = warranty.document ?? [];
  const warrantyCertificates = warranty.certificate ?? [];

  return (
    <AnimatedSection direction="up" delay={0.2}>
      <section className="w-full text-white pb-6 md:pb-8 lg:pb-10 bg-[#1b1a20]">
        <div className="container">

          {/* Hero Section */}
          <div className="rounded-[24px] border border-white/10">
            <div className="relative overflow-hidden rounded-t-[24px]">

                {/* Background Image */}
                <img
                  src={warranty.image || fallbackWarranty.image}
                  alt={warranty.title || "Warranty Banner"}
                  className="w-full h-[320px] lg:h-[600px] md:h-[400px] object-cover"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 flex items-center">
                  <div className="max-w-[620px] px-6 md:px-12">
                    <p className="text-primary     mb-4 lg:text-[24px] md:text-[34px] text-[24px] leading-none">
                      {warranty.label}
                    </p>

                    <h1 className="text-white lg:mb-8 md:mb-6 mb-4 2xl:text-[54px] xl:text-[44px] lg:text-[34px] md:text-[34px] text-[24px] leading-none">
                      {warranty.title}
                    </h1>

                    <p className="text-white 2xl:text-[24px] xl:text-[20px] lg:text-[18px] md:text-[16px] text-[14px]">
                      {warranty.sub_title}
                    </p>
                  </div>
                </div>
            </div>
            {/* Bottom Features */}
            <div className="bg-[#090909]/95 rounded-b-[24px] border-t border-white/10 px-4 md:px-8 py-6 md:py-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8 md:gap-6 gap-4">

                {/* Item */}
                <div className="flex items-start gap-4 lg:border-r lg:border-white/10 lg:pr-6">
                  <div className="flex-none lg:w-[60px] lg:h-[60px] md:w-[50px] md:h-[50px] w-[40px] h-[40px] rounded-full border border-[#D8A029] flex items-center justify-center">
                    <FaShieldAlt className="text-[#D8A029] lg:text-[30px] md:text-[24px] text-[20px]" />
                  </div>

                  <div>
                    <h3 className="text-[18px] lg:text-[24px] md:text-[20px] font-semibold mb-2">
                      Long-Term Protection
                    </h3>

                    <p className="text-white/70 text-[14px] md:text-[16px] leading-[1.3]">
                      Covers material & installation defects for 10 years
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 lg:border-r lg:border-white/10 lg:pr-6">
                  <div className="flex-none lg:w-[60px] lg:h-[60px] md:w-[50px] md:h-[50px] w-[40px] h-[40px] rounded-full border border-[#D8A029] flex items-center justify-center">
                    <FaHeadset className="text-[#D8A029] lg:text-[30px] md:text-[24px] text-[20px]"/>
                  </div>

                  <div>
                    <h3 className="text-[18px] lg:text-[24px] md:text-[20px] font-semibold mb-2">
                      Hassle-Free Support
                    </h3>

                    <p className="text-white/70 text-[14px] md:text-[16px] leading-[1.3]">
                      Quick resolution and dedicated customer assistance
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-none lg:w-[60px] lg:h-[60px] md:w-[50px] md:h-[50px] w-[40px] h-[40px] rounded-full border border-[#D8A029] flex items-center justify-center">
                    <FaAward className="text-[#D8A029] lg:text-[30px] md:text-[24px] text-[20px]"/>
                  </div>

                  <div>
                    <h3 className="text-[18px] lg:text-[24px] md:text-[20px] font-semibold mb-2">
                      Quality Assurance
                    </h3>

                    <p className="text-white/70 text-[14px] md:text-[16px] leading-[1.3]">
                      Built to last with trusted materials and workmanship
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Certifications & Downloads */}
          <div className="mt-8 md:mt-10 rounded-[24px] border border-white/10 bg-[#080808] p-5 md:p-10">

            {/* Certifications */}
            <div>
              <div className="flex items-center gap-5 mb-10">
                <h3 className="text-[#D8A029] uppercase text-sm md:text-lg font-medium whitespace-nowrap">
                  Certifications
                </h3>
                <div className="w-full h-[1px] bg-[#D8A029]" />
              </div>

              <div className="flex lg:gap-10 md:gap-8 gap-6 lg:mt-16 md:mt-12 mt-8 justify-center flex-wrap">
                {warrantyCertificates.map((certificate) => (
                  <div
                    key={certificate.warranty_certificate_id}
                    className="lg:w-[172px] lg:h-[172px] md:w-[152px] md:h-[152px] w-[132px] h-[132px] rounded-full"
                  >
                    <img
                      src={certificate.image}
                      alt="Warranty certification"
                      className="w-full h-full flex items-center justify-center rounded-full object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Downloads */}
            <div className="lg:mt-16 md:mt-12 mt-8">
              <div className="flex items-center gap-5 mb-10">
                <h3 className="text-[#D8A029] uppercase text-sm md:text-lg font-medium whitespace-nowrap">
                  Downloads
                </h3>

                <div className="w-full h-[1px] bg-[#D8A029]" />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-5 md:gap-8">
                {warrantyDocuments.map((document) => (
                  <div
                    key={document.warranty_document_id}
                    className="group"
                  >
                    <a href={document.file} title={`Open ${document.title}`} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-xl bg-white mb-4 h-[240px] md:h-[340px] transition duration-500 group-hover:scale-[1.02]">
                      <iframe
                        src={`https://docs.google.com/viewer?url=${encodeURIComponent(document.file)}&embedded=true`}
                        title={`${document.title} preview`}
                        className="w-full h-full border-0 pointer-events-none"
                        loading="lazy"
                      />
                    </a>

                    <h4 className="text-center text-[12px] md:text-[16px] lg:text-[19px] leading-[1.3]">
                      {document.title}
                    </h4>
                    {/* <a
                      href={document.file}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 mx-auto flex w-fit rounded-full border border-[#D8A029] px-4 py-2 text-[13px] md:text-[14px] text-[#D8A029] transition hover:bg-[#D8A029] hover:text-black"
                    >
                      Open PDF
                    </a> */}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>
    </AnimatedSection>
  );
}
