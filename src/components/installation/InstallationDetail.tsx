import { useState, type FormEvent } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Parallax,Autoplay,Pagination} from 'swiper/modules';
import { FiArrowUpRight, FiCheckCircle, FiChevronUp, FiUploadCloud, FiX } from "react-icons/fi";
import { LuInspectionPanel } from "react-icons/lu";
import { IoSettingsOutline } from "react-icons/io5";
import { RiSecurePaymentFill } from "react-icons/ri";
import { FaLayerGroup } from "react-icons/fa";
import { IoMdCrop, IoMdDoneAll } from "react-icons/io";
import { MdOutlineStairs } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import api from "../../lib/api";
import { useFooter } from "../../api/home";
import { showToast } from "../../utils/toastUtils";
import { getPhoneDigits, getWhatsAppUrl } from "../../config/contact";
import { env } from "../../config/env";

type ProductCategory = {
  product_category_id: number;
  title: string;
  price?: string;
  material_per_step?: string;
  installation_per_step?: string;
};

type InstallationOption = {
  type: string;
  price: string;
  created_at: string;
  updated_at: string | null;
};

type SpaceType = InstallationOption & {
  space_type_id: number;
};

type InstallationComplexity = InstallationOption & {
  installation_complexity_id: number;
};

type SubfloorCondition = InstallationOption & {
  subfloor_condition_id: number;
};

type InstallationDetailData = {
  space_type: SpaceType[];
  installation_complexity: InstallationComplexity[];
  subfloor_condition: SubfloorCondition[];
};

type InstallationDetailApiResponse = {
  status: number;
  data: InstallationDetailData;
};

type StairPhoto = {
  id: string;
  file: File;
  previewUrl: string;
  uploadedUrl?: string;
  status: "uploading" | "uploaded" | "error";
};

const formatCurrency = (value: number) =>
  `$${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const getProductCategory = async () => {
  const res = (await api.post("/beforeauth/getproductcategory")) as unknown as ProductCategory[] | { data: ProductCategory[] };
  return Array.isArray(res) ? res : res.data;
};

const getInstallationDetail = async () => {
  const res = (await api.get("/beforeauth/getinstallationdetail")) as unknown as InstallationDetailApiResponse;
  return res.data;
};

const getOptionPrice = (price?: string) => {
  const optionPrice = Number(price);
  return Number.isFinite(optionPrice) ? optionPrice : 0;
};

const MAX_STAIR_STEPS = 9999999999;
const MAX_STAIR_PHOTO_SIZE = 20 * 1024 * 1024;

const createPhotoPreview = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

const getUploadedUrls = (response: unknown) => {
  const urls: string[] = [];
  const uploadBaseUrl = new URL("../", env.API_URL).toString();

  const visit = (value: unknown) => {
    if (typeof value === "string") {
      const isAbsoluteUrl = /^https?:\/\//i.test(value);
      const looksLikeFilePath =
        /\.(?:jpe?g|png|webp|heic|gif)(?:\?.*)?$/i.test(value);

      if (isAbsoluteUrl || looksLikeFilePath) {
        try {
          const baseUrl = value.startsWith("/") ? env.SITE_URL : uploadBaseUrl;
          urls.push(new URL(value, baseUrl).toString());
        } catch {
          // Ignore strings that are not valid public file locations.
        }
      }
      return;
    }

    if (Array.isArray(value)) {
      value.forEach(visit);
      return;
    }

    if (value && typeof value === "object") {
      Object.values(value).forEach(visit);
    }
  };

  visit(response);
  return [...new Set(urls)];
};

function InstallationDetail() {
  const [area, setArea] = useState<number | "">(0);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSpaceType, setSelectedSpaceType] = useState("");
  const [selectedComplexity, setSelectedComplexity] = useState("");
  const [selectedSubfloorCondition, setSelectedSubfloorCondition] = useState("");
  const [includesStairs, setIncludesStairs] = useState(false);
  const [stairSteps, setStairSteps] = useState<number | "">(12);
  const [stairCollection, setStairCollection] = useState("");
  const [stairPhotos, setStairPhotos] = useState<StairPhoto[]>([]);
  const [isUploadingStairPhotos, setIsUploadingStairPhotos] = useState(false);
  const [stairOptionalAcknowledged, setStairOptionalAcknowledged] = useState(false);
  const [stairPricingAcknowledged, setStairPricingAcknowledged] = useState(false);
  const { data: generaldata } = useFooter(false);
  const { data: productCategoryData = [] } = useQuery({
    queryKey: ["productCategory"],
    queryFn: getProductCategory,
    refetchOnWindowFocus: false,
  });
  const { data: installationDetail } = useQuery({
    queryKey: ["installationDetail"],
    queryFn: getInstallationDetail,
    refetchOnWindowFocus: false,
  });
  
  const spaceTypes = installationDetail?.space_type ?? [];
  const installationComplexities = installationDetail?.installation_complexity ?? [];
  const subfloorConditions = installationDetail?.subfloor_condition ?? [];
  const selectedSpaceTypeData = spaceTypes.find((item) => String(item.space_type_id) === selectedSpaceType) ?? spaceTypes[0];
  const selectedComplexityData = installationComplexities.find((item) => String(item.installation_complexity_id) === selectedComplexity) ?? installationComplexities[0];
  const selectedSubfloorConditionData = subfloorConditions.find((item) => String(item.subfloor_condition_id) === selectedSubfloorCondition) ?? subfloorConditions[0];
  const selectedCategoryData = productCategoryData.find((item) => String(item.product_category_id) === selectedCategory) ?? productCategoryData[0];
  const selectedStairCategoryData =
    productCategoryData.find((item) => String(item.product_category_id) === stairCollection) ?? selectedCategoryData;
  const stairMaterialCost = getOptionPrice(selectedStairCategoryData?.material_per_step);
  const stairInstallationCost = getOptionPrice(selectedStairCategoryData?.installation_per_step);
  const stairPricePerStep = stairMaterialCost + stairInstallationCost;
  const selectedStairCategoryId = String(selectedStairCategoryData?.product_category_id ?? "");
  const selectedRateItems = [
    { label: selectedCategoryData?.title || "Flooring type", price: getOptionPrice(selectedCategoryData?.price) },
    { label: selectedSpaceTypeData?.type || "Space type", price: getOptionPrice(selectedSpaceTypeData?.price) },
    { label: selectedComplexityData?.type || "Installation complexity", price: getOptionPrice(selectedComplexityData?.price) },
    { label: selectedSubfloorConditionData?.type || "Subfloor condition", price: getOptionPrice(selectedSubfloorConditionData?.price) },
  ];

  const installationRate =
    selectedRateItems.reduce((sum, item) => sum + item.price, 0);
  const taxPercent = Number(generaldata?.tax || 0);
  const areaValue = area === "" ? 0 : area;
  const subtotal = areaValue * installationRate;
  const tax = subtotal * (taxPercent / 100);
  const stairStepsValue = stairSteps === "" ? 0 : stairSteps;
  const stairTreadTotal = includesStairs ? stairStepsValue * stairPricePerStep : 0;
  const totalEstimate = subtotal + tax + stairTreadTotal;

  const handleAreaChange = (value: string) => {
    if (value === "") {
      setArea("");
      return;
    }

    const nextArea = Number(value);
    setArea(Number.isFinite(nextArea) && nextArea >= 0 ? nextArea : 0);
  };

  const handleStairStepsChange = (value: string) => {
    if (value === "") {
      setStairSteps("");
      return;
    }

    const digitsOnlyValue = value.replace(/\D/g, "");
    if (digitsOnlyValue === "") {
      setStairSteps("");
      return;
    }

    const nextSteps = Number(digitsOnlyValue);
    if (!Number.isFinite(nextSteps)) {
      setStairSteps(MAX_STAIR_STEPS);
      return;
    }

    setStairSteps(Math.min(Math.max(Math.floor(nextSteps), 1), MAX_STAIR_STEPS));
  };

  const handleStairPhotosChange = async (files: FileList | null) => {
    const selectedFiles = Array.from(files ?? []);
    if (selectedFiles.length === 0) return;
    if (isUploadingStairPhotos) {
      showToast("Please wait for the current photos to finish uploading", "error");
      return;
    }

    const oversizedPhoto = selectedFiles.find((photo) => photo.size > MAX_STAIR_PHOTO_SIZE);

    if (oversizedPhoto) {
      showToast(`${oversizedPhoto.name} exceeds the 20MB file size limit`, "error");
      return;
    }

    setIsUploadingStairPhotos(true);

    try {
      const photosWithPreviews = await Promise.all(
        selectedFiles.map(async (file, index) => {
          const id = `${file.name}-${file.lastModified}-${file.size}-${Date.now()}-${index}`;
          return {
            id,
            file,
            previewUrl: await createPhotoPreview(file),
            status: "uploading" as const,
          };
        })
      );
      setStairPhotos((currentPhotos) => [...currentPhotos, ...photosWithPreviews]);

      const uploadData = new FormData();
      selectedFiles.forEach((file) => uploadData.append("files[]", file));

      const response = await api.post("/beforeauth/upload", uploadData);
      const uploadedUrls = getUploadedUrls(response);

      if (uploadedUrls.length < selectedFiles.length) {
        throw new Error("The upload API did not return a URL for every photo");
      }

      const uploadedUrlById = new Map(
        photosWithPreviews.map((photo, index) => [photo.id, uploadedUrls[index]])
      );

      setStairPhotos((currentPhotos) =>
        currentPhotos.map((photo) => {
          const uploadedUrl = uploadedUrlById.get(photo.id);
          return uploadedUrl
            ? { ...photo, uploadedUrl, status: "uploaded" }
            : photo;
        })
      );
      showToast(
        `${selectedFiles.length} stair photo${selectedFiles.length === 1 ? "" : "s"} uploaded successfully`,
        "success"
      );
    } catch {
      setStairPhotos((currentPhotos) =>
        currentPhotos.map((photo) =>
          photo.status === "uploading"
            ? { ...photo, status: "error" }
            : photo
        )
      );
      showToast("Stair photo upload failed. Please remove the failed photos and try again.", "error");
    } finally {
      setIsUploadingStairPhotos(false);
    }
  };

  const removeStairPhoto = (photoIndex: number) => {
    setStairPhotos((currentPhotos) =>
      currentPhotos.filter((_, index) => index !== photoIndex)
    );
  };

  const validateQuote = () => {
    if (!areaValue || areaValue <= 0) {
      showToast("Please enter total area", "error");
      return false;
    }

    if (!selectedCategoryData || !selectedSpaceTypeData || !selectedComplexityData || !selectedSubfloorConditionData) {
      showToast("Please select all quote options", "error");
      return false;
    }

    if (includesStairs) {
      if (!stairStepsValue) {
        showToast("Please enter the number of stair steps", "error");
        return false;
      }

      if (stairPhotos.length === 0) {
        showToast("Please upload stair photos", "error");
        return false;
      }

      if (isUploadingStairPhotos) {
        showToast("Please wait for stair photos to finish uploading", "error");
        return false;
      }

      if (stairPhotos.some((photo) => photo.status !== "uploaded" || !photo.uploadedUrl)) {
        showToast("Please remove failed photos and upload them again", "error");
        return false;
      }

      if (!stairOptionalAcknowledged || !stairPricingAcknowledged) {
        showToast("Please accept both stair tread acknowledgments", "error");
        return false;
      }
    }

    return true;
  };

  const getQuoteMessage = () =>
    [
      "Hello, I would like an installation quote.",
      "",
      `Area: ${areaValue} sq ft`,
      `Flooring Type: ${selectedCategoryData?.title}`,
      `Space Type: ${selectedSpaceTypeData?.type}`,
      `Installation Complexity: ${selectedComplexityData?.type}`,
      `Subfloor Condition: ${selectedSubfloorConditionData?.type}`,
      `Rate: ${formatCurrency(installationRate)}/sqft`,
      `Subtotal: ${formatCurrency(subtotal)}`,
      `Estimated Tax: ${formatCurrency(tax)}`,
      `Project Includes Stairs: ${includesStairs ? "Yes" : "No"}`,
      ...(includesStairs
        ? [
            `Stair Steps: ${stairStepsValue}`,
            `Stair Collection: ${selectedStairCategoryData?.title}`,
            `Stair Rate: ${formatCurrency(stairPricePerStep)}/step`,
            `Stair Tread Total: ${formatCurrency(stairTreadTotal)}`,
            "Stair Photos:",
            ...stairPhotos.map(({ uploadedUrl }, index) => `${index + 1}. ${uploadedUrl}`),
          ]
        : []),
      `Total Estimate: ${formatCurrency(totalEstimate)}`,
    ].join("\n");

  const openEmailInquiry = () => {
    if (!validateQuote()) return;

    if (!generaldata?.email) {
      showToast("Email address is not available", "error");
      return;
    }

    window.location.href = `mailto:${generaldata.email}?subject=${encodeURIComponent("Installation Quote Inquiry")}&body=${encodeURIComponent(getQuoteMessage())}`;
  };

  const handleQuoteSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateQuote()) return;

    const whatsappNumber = getPhoneDigits(generaldata?.telephone_no);
    console.log("🚀 ~ handleQuoteSubmit ~ whatsappNumber:", whatsappNumber)
    if (!whatsappNumber) {
      openEmailInquiry();
      return;
    }

    window.open(getWhatsAppUrl(generaldata?.telephone_no, getQuoteMessage()), "_blank", "noopener,noreferrer");
  };

  return (
    <>
      {/* ✅ Hero Section */}
      <section className="min-h-screen bg-[#101113]  text-white lg:pb-8 md:pb-6 pb-4">
        <div className="container">
          <div className="relative mb-8">
            <Swiper
              speed={600}
              parallax={true}
              // autoplay={{
              //   delay: 3000,
              //   disableOnInteraction: false,
              // }}
              pagination={{
                el: ".custom-pagination", // connect to custom container
                clickable: true,
              }}
              modules={[Parallax, Autoplay, Pagination]}
              className="hero-banner lg:rounded-[30px] md:rounded-[20px] rounded-[10px]"
            >
              <SwiperSlide
                className="relative lg:rounded-[30px] md:rounded-[20px] rounded-[10px] overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:rounded-[12px] before:bg-[linear-gradient(70deg,_#000000,_rgba(0,0,0,0))] before:z-[1]">
                <img
                  className="w-full max-h-[500px] min-h-[300px] object-cover object-center lg:rounded-[30px] md:rounded-[20px] rounded-[10px]"
                  src="https://luxurylayers.pro/luxurylayerfloor/uploads/images/banner/image/5des94s05khmx8mdl52a0tof2pjntk59.png"
                  alt="Luxury Layers flooring installation quote service"
                />

                <div className="md:px-6 px-3 absolute inset-0 z-10 flex items-center">
                  <div className="max-w-[775px] lg:py-10 md:py-8 py-6">
                    <h1
                      className="text-[#d4af37] font-quicksand mb-4 lg:text-[24px] md:text-[34px] text-[24px] leading-none"
                      data-swiper-parallax="-1000"
                    >
                      Installation Quote
                    </h1>

                    <h2
                      className="text-white lg:mb-8 md:mb-6 mb-4 font-quicksand 2xl:text-[54px] xl:text-[44px] lg:text-[34px] md:text-[34px] text-[24px] leading-none"
                      data-swiper-parallax="-1500"
                    >
                      Get Your Installation Quote
                    </h2>

                    <p className="text-white leading-none mb-8 2xl:text-[24px] xl:text-[20px] lg:text-[18px] md:text-[16px] text-[14px]" data-swiper-parallax="-2000">
                      Fast, Transparent & Hassle-free Pricing
                    </p>

                    {/* <p className="text-white mb-8 2xl:text-[24px] xl:text-[20px] lg:text-[18px] md:text-[16px] text-[14px] flex items-center gap-4"><span className="w-10 h-10 rounded-full bg-[#d4af37] text-black font-bold flex items-center justify-center">1</span>Area Detail</p> */}
                  </div>
                </div>
              </SwiperSlide>
            </Swiper>
            <div className="custom-pagination container absolute left-0 right-0 xl:!bottom-4 lg:!bottom-[50px] md:!bottom-[40px] sm:!bottom-[30px] !bottom-[20px] z-10 text-center" />
          </div>
          <div className="max-w-full mx-auto grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-6 font-outfit mb-8">
            
            {/* LEFT SIDE */}
            <form onSubmit={handleQuoteSubmit} className="rounded-[24px] border border-white/10 bg-[#101415] p-5 sm:p-7 lg:p-10">
              
              {/* Heading */}
              <h2 className="text-[#d4af37] text-[24px] sm:text-[20px] lg:text-[18px] font-semibold">
                1. Area Details
              </h2>

              <p className="text-white/60 text-sm sm:text-base lg:text-lg mt-2 mb-8">
                Tell us about your space
              </p>

              {/* Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* Total Area */}
                <div>
                  <label className="block text-white text-sm sm:text-base mb-3">
                    Total Area (sq ft)
                  </label>

                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      value={area}
                      onChange={(event) => handleAreaChange(event.target.value)}
                      className="w-full h-[52px] sm:h-[58px] lg:h-[64px] rounded-xl bg-black border border-white/10 px-4 sm:px-5 text-white text-[14px] md:text-[16px] outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
                    />

                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 text-sm sm:text-base">
                      sq ft
                    </span>
                  </div>
                </div>

                {/* Space Type */}
                <div>
                  <label className="block text-white text-sm sm:text-base mb-3">
                    Space Type
                  </label>

                  <div className="relative">
                    <select
                      value={selectedSpaceType || String(spaceTypes[0]?.space_type_id ?? "")}
                      onChange={(event) => setSelectedSpaceType(event.target.value)}
                      className="w-full h-[52px] sm:h-[58px] lg:h-[64px] rounded-xl bg-black border border-white/10 px-4 sm:px-5 text-white text-[14px] md:text-[16px] outline-none appearance-none"
                    >
                      {spaceTypes.length === 0 && <option value="">Select Space Type</option>}
                      {spaceTypes.map((spaceType) => (
                        <option key={spaceType.space_type_id} value={spaceType.space_type_id}>
                          {spaceType.type} - {formatCurrency(getOptionPrice(spaceType.price))}/sqft
                        </option>
                      ))}
                    </select>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.2" stroke="currentColor" className="h-5 w-5 ml-1 absolute right-2.5 text-white top-1/2 -translate-y-1/2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Flooring Type */}
              <div className="mt-5">
                <label className="block text-white text-sm sm:text-base mb-3">
                  Flooring Type
                </label>
                <div className="relative">
                  <select
                    value={selectedCategory || String(productCategoryData[0]?.product_category_id ?? "")}
                    onChange={(event) => setSelectedCategory(event.target.value)}
                    className="w-full h-[52px] sm:h-[58px] lg:h-[64px] rounded-xl bg-black border border-white/10 px-4 sm:px-5 text-white text-[14px] md:text-[16px] outline-none appearance-none"
                  >
                    {/* <option value="">Select Flooring Type</option> */}
                    {productCategoryData.map((category) => (
                      <option
                        key={category.product_category_id}
                        value={category.product_category_id}
                      >
                        {category.title} - {formatCurrency(getOptionPrice(category.price))}/sqft
                      </option>
                    ))}
                  </select>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.2" stroke="currentColor" className="h-5 w-5 ml-1 absolute right-2.5 text-white top-1/2 -translate-y-1/2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                  </svg>
                </div>
              </div>

              {/* Bottom Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                
                {/* Installation Complexity */}
                <div>
                  <label className="block text-white text-sm sm:text-base mb-3">
                    Installation Complexity
                  </label>

                  <div className="relative">
                    <select
                      value={selectedComplexity || String(installationComplexities[0]?.installation_complexity_id ?? "")}
                      onChange={(event) => setSelectedComplexity(event.target.value)}
                      className="w-full h-[52px] sm:h-[58px] lg:h-[64px] rounded-xl bg-black border border-white/10 px-4 sm:px-5 text-white text-[14px] md:text-[16px] outline-none appearance-none"
                    >
                      {installationComplexities.length === 0 && <option value="">Select Complexity</option>}
                      {installationComplexities.map((complexity) => (
                        <option key={complexity.installation_complexity_id} value={complexity.installation_complexity_id}>
                          {complexity.type} - {formatCurrency(getOptionPrice(complexity.price))}/sqft
                        </option>
                      ))}
                    </select>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.2" stroke="currentColor" className="h-5 w-5 ml-1 absolute right-2.5 text-white top-1/2 -translate-y-1/2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                    </svg>
                  </div>
                </div>

                {/* Subfloor Condition */}
                <div>
                  <label className="block text-white text-sm sm:text-base mb-3">
                    Subfloor Condition
                  </label>

                  <div className="relative">
                    <select
                      value={selectedSubfloorCondition || String(subfloorConditions[0]?.subfloor_condition_id ?? "")}
                      onChange={(event) => setSelectedSubfloorCondition(event.target.value)}
                      className="w-full h-[52px] sm:h-[58px] lg:h-[64px] rounded-xl bg-black border border-white/10 px-4 sm:px-5 text-white text-[14px] md:text-[16px] outline-none appearance-none"
                    >
                      {subfloorConditions.length === 0 && <option value="">Select Subfloor Condition</option>}
                      {subfloorConditions.map((condition) => (
                        <option key={condition.subfloor_condition_id} value={condition.subfloor_condition_id}>
                          {condition.type} - {formatCurrency(getOptionPrice(condition.price))}/sqft
                        </option>
                      ))}
                    </select>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.2" stroke="currentColor" className="h-5 w-5 ml-1 absolute right-2.5 text-white top-1/2 -translate-y-1/2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="mt-6 min-h-[58px] rounded-[7px] border border-white/35 bg-[#090d0e]/70 px-5 py-3">
                <div className="flex h-full flex-col gap-3 sm:flex-row sm:items-center">
                  <p className="text-sm font-medium text-white sm:w-[42%] sm:text-base">
                    Does Your Project Include Stairs?
                  </p>
                  <div className="flex flex-1 items-center justify-start gap-12 sm:justify-around">
                    {[
                      { value: false, label: "No" },
                      { value: true, label: "Yes" },
                    ].map((option) => (
                      <label key={option.label} className="flex cursor-pointer items-center gap-2 text-sm text-white sm:text-base">
                        <input
                          type="radio"
                          name="includesStairs"
                          checked={includesStairs === option.value}
                          onChange={() => setIncludesStairs(option.value)}
                          className="peer sr-only"
                        />
                        <span className="h-[17px] w-[17px] rounded-full border border-white/75 bg-[#090d0e] shadow-[inset_0_0_0_4px_#090d0e] peer-checked:border-[#e4ad27] peer-checked:bg-[#e4ad27] peer-checked:shadow-[inset_0_0_0_4px_#090d0e,0_0_0_2px_rgba(228,173,39,0.12)]" />
                        {option.label}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {includesStairs && (
                <section className="mt-5 overflow-hidden rounded-[8px] border border-[#c9962b] bg-[#0a0e0f]/80 shadow-[inset_0_0_24px_rgba(255,255,255,0.015)]">
                  <header className="flex min-h-[67px] items-center justify-between border-b border-white/10 px-4 py-3 sm:px-5">
                    <div className="flex items-center gap-3">
                      <MdOutlineStairs className="text-[38px] text-[#dca629]" aria-hidden="true" />
                      <div>
                        <h3 className="text-[24px] font-semibold uppercase leading-none tracking-[0.03em] text-[#dca629] sm:text-[20px] lg:text-[18px]">
                          Matching Stair Tread Options
                        </h3>
                        <p className="mt-2 text-sm text-white/60 sm:text-base lg:text-lg">
                          Only required if your project includes stairs.
                        </p>
                      </div>
                    </div>
                    <FiChevronUp className="text-[17px] text-white" aria-hidden="true" />
                  </header>

                  <div className="grid grid-cols-1 border-b border-white/10 lg:grid-cols-[1.05fr_0.85fr_1fr]">
                    <div className="p-4 lg:border-r lg:border-white/10">
                      <label className="mb-3 block text-sm font-medium text-white sm:text-base">
                        Number of Steps Requiring Stair Treads
                      </label>
                      <input
                        type="number"
                        min="1"
                        max={MAX_STAIR_STEPS}
                        inputMode="numeric"
                        value={stairSteps}
                        onChange={(event) => handleStairStepsChange(event.target.value)}
                        className="h-[42px] w-full rounded-[6px] border border-white/25 bg-[#050708] px-4 text-[14px] text-white outline-none focus:border-[#d4af37] md:text-[16px]"
                      />
                      <p className="mt-2 text-[11px] text-white/45">Example: 12 Steps. Max {MAX_STAIR_STEPS} steps.</p>
                    </div>

                    <fieldset className="p-4 lg:border-r lg:border-white/10">
                      <legend className="mb-3 text-sm font-medium text-white sm:text-base">Select Flooring Collection</legend>
                      <div className="space-y-2.5">
                        {productCategoryData.length === 0 && (
                          <p className="text-[14px] text-white/60 md:text-[16px]">No flooring collections available</p>
                        )}
                        {productCategoryData.map((collection) => (
                          <label key={collection.product_category_id} className="flex cursor-pointer items-center gap-2.5 text-[14px] text-white md:text-[16px]">
                            <input
                              type="radio"
                              name="stairCollection"
                              value={collection.product_category_id}
                              checked={selectedStairCategoryId === String(collection.product_category_id)}
                              onChange={(event) => setStairCollection(event.target.value)}
                              className="peer sr-only"
                            />
                            <span className="h-[17px] w-[17px] rounded-full border border-white/70 bg-[#090d0e] shadow-[inset_0_0_0_4px_#090d0e] peer-checked:border-[#e4ad27] peer-checked:bg-[#e4ad27]" />
                            {collection.title}
                          </label>
                        ))}
                      </div>
                    </fieldset>

                    <div className="m-3 rounded-[6px] border border-white/10 bg-white/[0.035] p-4">
                      <h4 className="mb-3 text-sm font-semibold text-[#dca629] sm:text-base">
                        Stair Tread Pricing (Per Step)
                      </h4>
                      <div className="space-y-2.5 text-[14px] md:text-[16px]">
                        <div className="flex justify-between gap-3 text-white/75">
                          <span>Material Cost</span>
                          <span>{formatCurrency(stairMaterialCost)} /Step</span>
                        </div>
                        <div className="flex justify-between gap-3 text-white/75">
                          <span>Installation Cost</span>
                          <span>{formatCurrency(stairInstallationCost)} /Step</span>
                        </div>
                        <div className="border-t border-white/10 pt-2.5">
                          <div className="flex justify-between gap-3 font-semibold text-[#dca629]">
                            <span>Total Installed</span>
                            <span>{formatCurrency(stairPricePerStep)} /Step</span>
                          </div>
                          <p className="mt-1 text-[11px] text-white/40">
                            {selectedStairCategoryData?.title ? `(${selectedStairCategoryData.title})` : ""}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 p-3 md:grid-cols-[0.78fr_1.72fr]">
                    <div className="rounded-[6px] border border-white/15 bg-white/[0.035] p-4">
                      <h4 className="text-sm font-semibold text-[#dca629] sm:text-base">Automatic Stair Calculator</h4>
                      <p className="mt-4 break-words text-[14px] leading-6 text-white md:text-[16px]">
                        {stairStepsValue} Steps <span className="mx-2 text-white/40">x</span> {formatCurrency(stairPricePerStep)}
                      </p>
                      <div className="my-3 border-t border-white/10" />
                      <p className="text-sm text-[#dca629] sm:text-base">Stair Tread Total</p>
                      <p className="mt-0.5 break-words text-[22px] font-bold leading-tight text-[#dca629] sm:text-[28px]">
                        {formatCurrency(stairTreadTotal)}
                      </p>
                      <p className="mt-3 text-[10px] leading-4 text-white/45">
                        Automatically calculated. Price updates when you change steps or collection.
                      </p>
                    </div>

                    <div className="rounded-[6px] border border-white/15 bg-white/[0.035] p-3.5">
                      <h4 className="text-sm font-semibold text-white sm:text-base">Upload Stair Photos (Required)</h4>
                      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-[0.82fr_1.18fr]">
                        <div>
                          <p className="mb-2.5 text-sm text-[#dca629] sm:text-base">Required Photos:</p>
                          <ul className="space-y-2 text-[14px] text-white/75 md:text-[16px]">
                            {["All Staircases", "Stair Landings", "Stair Transitions", "Open Stair Ends"].map((item) => (
                              <li key={item} className="flex items-center gap-2">
                                <FiCheckCircle className="shrink-0 text-[#dca629]" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <label
                          className={`flex min-h-[164px] flex-col items-center justify-center rounded-[6px] border border-dashed bg-black/20 px-4 text-center transition-colors ${
                            isUploadingStairPhotos
                              ? "cursor-wait border-[#d4af37]/60 opacity-70"
                              : "cursor-pointer border-white/35 hover:border-[#d4af37]"
                          }`}
                          onDragOver={(event) => event.preventDefault()}
                          onDrop={(event) => {
                            event.preventDefault();
                            void handleStairPhotosChange(event.dataTransfer.files);
                          }}
                        >
                          <FiUploadCloud className="text-[38px] text-[#dca629]" />
                          <span className="mt-1.5 text-[14px] text-white md:text-[16px]">
                            {isUploadingStairPhotos ? "Uploading Images..." : "Drag & Drop Images Here"}
                          </span>
                          <span className="my-0.5 text-[10px] text-white/50">or</span>
                          <span className="rounded-md bg-gradient-to-r from-[#d4af37] to-[#f5d76e] px-5 py-2 text-xs font-bold text-black">
                            Upload Photos
                          </span>
                          <input
                            type="file"
                            accept=".jpg,.jpeg,.png,.heic,image/jpeg,image/png,image/heic"
                            multiple
                            disabled={isUploadingStairPhotos}
                            className="sr-only"
                            onChange={(event) => {
                              void handleStairPhotosChange(event.currentTarget.files);
                              event.currentTarget.value = "";
                            }}
                          />
                          <span className="mt-2 text-[9px] text-white/45">You can upload multiple images</span>
                        </label>
                      </div>

                      {stairPhotos.length > 0 && (
                        <div className="mt-3">
                          <div className="mb-2 flex items-center justify-between">
                            <p className="text-sm font-medium text-white">
                              Selected Photos ({stairPhotos.length})
                            </p>
                            <p className="text-[9px] text-white/40">Click x to remove</p>
                          </div>
                          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                            {stairPhotos.map(({ id, file, previewUrl, status }, index) => (
                              <div key={id} className="group relative overflow-hidden rounded-[5px] border border-white/15 bg-black">
                                <img
                                  src={previewUrl}
                                  alt={`Stair preview ${index + 1}`}
                                  className="h-[78px] w-full object-cover"
                                />
                                <span
                                  className={`absolute bottom-[22px] left-1 rounded px-1.5 py-0.5 text-[8px] font-semibold uppercase ${
                                    status === "uploaded"
                                      ? "bg-green-500/90 text-black"
                                      : status === "error"
                                        ? "bg-red-500/90 text-white"
                                        : "bg-[#dca629]/90 text-black"
                                  }`}
                                >
                                  {status}
                                </span>
                                <button
                                  type="button"
                                  aria-label={`Remove ${file.name}`}
                                  onClick={() => removeStairPhoto(index)}
                                  className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full border border-white/30 bg-black/85 text-white transition-colors hover:border-[#d4af37] hover:text-[#d4af37]"
                                >
                                  <FiX className="text-[12px]" />
                                </button>
                                <p className="truncate px-1.5 py-1 text-[9px] text-white/65">{file.name}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mt-2 text-[9px] leading-4 text-white/45">
                        <span>Accepted formats: JPG, PNG, HEIC</span>
                        <span className="ml-3">Max file size: 20MB per image</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 px-4 pb-4 pt-1">
                    <label className="flex cursor-pointer items-start gap-3 text-sm leading-5 text-white/80 sm:text-base">
                      <input
                        type="checkbox"
                        checked={stairOptionalAcknowledged}
                        onChange={(event) => setStairOptionalAcknowledged(event.target.checked)}
                        className="gold-check mt-0.5"
                      />
                      I understand matching stair treads are optional and are not included with flooring purchases or standard flooring installation pricing.
                    </label>
                    <label className="flex cursor-pointer items-start gap-3 text-sm leading-5 text-white/80 sm:text-base">
                      <input
                        type="checkbox"
                        checked={stairPricingAcknowledged}
                        onChange={(event) => setStairPricingAcknowledged(event.target.checked)}
                        className="gold-check mt-0.5"
                      />
                      I understand final stair tread quantities and pricing will be confirmed prior to installation.
                    </label>
                  </div>
                </section>
              )}

              {/* Button */}
              <div className="grid sm:grid-cols-2 grid-cols-1 gap-3 mt-5">
                <button
                  type="submit"
                  disabled={isUploadingStairPhotos}
                  className="flex items-center justify-center font-outfit gap-2 bg-gradient-to-r from-[#d4af37] to-[#f5d76e] text-black font-semibold rounded-full px-6 py-3 transition-all duration-300 group disabled:cursor-wait disabled:opacity-60"
                >
                  <span>{isUploadingStairPhotos ? "Uploading Photos..." : "WhatsApp Quote"}</span>
                  <FiArrowUpRight className="group-hover:rotate-45 transition-transform duration-300" />
                </button>
                {/* <button type="button" onClick={openEmailInquiry} className="flex items-center justify-center font-outfit gap-2 border border-[#d4af37] text-[#d4af37] font-semibold rounded-full px-6 py-3 transition-all duration-300 group hover:bg-[#d4af37] hover:text-black">
                  <span>Email Quote</span>
                  <FiArrowUpRight className="group-hover:rotate-45 transition-transform duration-300" />
                </button> */}
              </div>
            </form>

            {/* RIGHT SIDE */}
            <div className="rounded-[24px] border border-white/10 bg-[#101415] p-5 sm:p-7 lg:p-8 h-full">
              
              <p className="text-white/70 text-base sm:text-lg">
                Installation Rate
              </p>

              <h2 className="text-[#d4af37] text-[20px] md:text-[24px] lg:text-[30px] font-bold mt-2">
                {formatCurrency(installationRate)}
                <span className="text-white text-base sm:text-lg lg:text-xl font-medium">
                  /sqft
                </span>
              </h2>

              <div className="border-t border-dashed border-white/10 my-2 md:my-4" />

              {/* Area */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-white text-sm sm:text-base lg:text-lg">
                  <span>Area</span>
                  <span>{areaValue} sq ft</span>
                </div>

                <div className="flex items-center justify-between text-white text-sm sm:text-base lg:text-lg">
                  <span>Rate / sq ft</span>
                  <span>{formatCurrency(installationRate)}</span>
                </div>

                {selectedRateItems.map((item, index) => (
                  <div
                    key={`${item.label}-${index}`}
                    className="flex items-center justify-between text-white/60 text-xs sm:text-sm"
                  >
                    <span>{item.label}</span>
                    <span>{formatCurrency(item.price)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-dashed border-white/10 my-2 md:my-4" />

              {/* Pricing */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-white text-sm sm:text-base lg:text-lg">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>

                <div className="flex items-center justify-between text-white text-sm sm:text-base lg:text-lg">
                  <span>Estimated Tax ({taxPercent}%)</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                {includesStairs && (
                  <div className="flex items-center justify-between text-sm font-semibold text-[#d4af37] sm:text-base lg:text-lg">
                    <span>Stair Tread Total</span>
                    <span className="min-w-0 break-words text-right">{formatCurrency(stairTreadTotal)}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-dashed border-white/10 my-2 md:my-4" />

              {/* Total */}
              <div>
                <p className="text-white text-lg sm:text-xl mb-3">
                  Total Estimate
                </p>

                <h3 className="text-[#d4af37] text-[20px] md:text-[24px] lg:text-[30px] font-bold">
                  {formatCurrency(totalEstimate)}
                </h3>
              </div>

              {/* Info Box */}
              <div className="lg:mt-8 md:mt-6 mt-4 border border-white/10 rounded-2xl p-4 sm:p-5 bg-black/40 flex items-start gap-4">
                
                <div className="min-w-[38px] sm:min-w-[42px] h-[38px] sm:h-[42px] rounded-full border border-[#d4af37] flex items-center justify-center text-[#d4af37] text-sm sm:text-base">
                  i
                </div>

                <p className="text-white/70 text-sm sm:text-base leading-6 sm:leading-7">
                  This is an estimated quote.
                  <br />
                  Final price may vary after site inspection.
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-[24px] border border-white/10 bg-[#101415] p-5 sm:p-7 lg:p-10 mb-8">
            <h3 className="text-white font-outfit lg:text-[32px] mb-4 md:text-[22px] text-[15px] leading-none text-center ">What's Included in Installation <span className="text-[#d4af37]">({formatCurrency(installationRate)}/sqft)</span></h3>
            <p className="text-white font-outfit md:text-[16px] text-center text-[14px]">watch our step-by-step installation process for a flawless, long-lasting finish</p>
            <div className="grid xl:grid-cols-6 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 items-center lg:gap-6 mt-5 sm:mt-7 lg:mt-10 md:gap-5 gap-4">
              <div className="text-center md:border-r md:border-[#d4af37] lg:pr-6 md:pr-5">
                <LuInspectionPanel className="text-[#d4af37] lg:text-[40px] md:text-[30px] text-[24px] mx-auto mb-4"/>
                <div>
                  <h5 className="text-white lg:text-[16px] md:text-[14px] leading-none lg:mb-4 md:mb-3 mb-2 text-[13px] font-outfit font-semibold">Site Inspection</h5>
                  <p className="text-white font-outfit lg:text-[16px] text-[14px] leading-[1.3]">Inspection of site and subfloor conditions</p>
                </div>
              </div>
              <div className="text-center lg:border-r md:border-[#d4af37] lg:pr-6 md:pr-5">
                <IoSettingsOutline className="text-[#d4af37] lg:text-[40px] md:text-[30px] text-[24px] mx-auto mb-4"/>
                <div>
                  <h5 className="text-white lg:text-[16px] md:text-[14px] leading-none lg:mb-4 md:mb-3 mb-2 text-[13px] font-outfit font-semibold">Surface Preparation</h5>
                  <p className="text-white font-outfit lg:text-[16px] text-[14px] leading-[1.3]">Cleaning and leveling of subfloor</p>
                </div>
              </div>
              <div className="text-center xl:border-r lg:border-r-0 md:border-r border-[#d4af37] lg:pr-6 md:pr-5">
                <RiSecurePaymentFill className="text-[#d4af37] lg:text-[40px] md:text-[30px] text-[24px] mx-auto mb-4"/>
                <div>
                  <h5 className="text-white lg:text-[16px] md:text-[14px] leading-none lg:mb-4 md:mb-3 mb-2 text-[13px] font-outfit font-semibold">Underlayment</h5>
                  <p className="text-white font-outfit lg:text-[16px] text-[14px] leading-[1.3]">Premium underlayment for comfort & durability</p>
                </div>
              </div>
              <div className="text-center lg:border-r md:border-[#d4af37] lg:pr-6 md:pr-5">
                <FaLayerGroup className="text-[#d4af37] lg:text-[40px] md:text-[30px] text-[24px] mx-auto mb-4"/>
                <div>
                  <h5 className="text-white lg:text-[16px] md:text-[14px] leading-none lg:mb-4 md:mb-3 mb-2 text-[13px] font-outfit font-semibold">SPC Flooring Installation</h5>
                  <h5 className="text-white lg:text-[16px] md:text-[14px] leading-none lg:mb-4 md:mb-3 mb-2 text-[13px] font-outfit font-semibold">SPC Flooring Installation</h5>
                  <p className="text-white font-outfit lg:text-[16px] text-[14px] leading-[1.3]">Professional installation with precision</p>
                </div>
              </div>
              <div className="text-center md:border-r md:border-[#d4af37] lg:pr-6 md:pr-5">
                <IoMdCrop className="text-[#d4af37] lg:text-[40px] md:text-[30px] text-[24px] mx-auto mb-4"/>
                <div>
                  <h5 className="text-white lg:text-[16px] md:text-[14px] leading-none lg:mb-4 md:mb-3 mb-2 text-[13px] font-outfit font-semibold">Trims & Molding</h5>
                  <p className="text-white font-outfit lg:text-[16px] text-[14px] leading-[1.3]">T-Molding, Bullnose & Stair Nosing</p>
                </div>
              </div>
              <div className="text-center lg:pr-6 md:pr-5">
                <IoMdDoneAll className="text-[#d4af37] lg:text-[40px] md:text-[30px] text-[24px] mx-auto mb-4"/>
                <div>
                  <h5 className="text-white lg:text-[16px] md:text-[14px] leading-none lg:mb-4 md:mb-3 mb-2 text-[13px] font-outfit font-semibold">Final Finishing</h5>
                  <p className="text-white font-outfit lg:text-[16px] text-[14px] leading-[1.3]">Edge sealing, cleaning & quality check</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default InstallationDetail;
