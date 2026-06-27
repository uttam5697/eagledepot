import { type ChangeEvent, type FormEvent, type RefObject, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Upload, X } from "lucide-react";
import { Logo } from "../assets/Index";
import { paths } from "../config/path";
import api from "../lib/api";
import { showToast } from "../utils/toastUtils";

type TradeProForm = {
  business_name: string;
  primary_contact_name: string;
  title_position: string;
  business_address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  mobile: string;
  email: string;
  website: string;
  federal_ein_tax_id: string;
  taxable_account: boolean;
  resale_account: boolean;
  tax_exempt_organization: boolean;
  flooring_contractor: boolean;
  general_contractor: boolean;
  builder_developer: boolean;
  property_management: boolean;
  retail_showroom: boolean;
  distributor_supplier: boolean;
  commercial_end_user: boolean;
  business_type_other: string;
  insurance_carrier: string;
  policy_number: string;
  coverage_amount: string;
  spc_flooring: boolean;
  commercial_glue_down_lvt: boolean;
  project_supply_logistics: boolean;
  private_label_programs: boolean;
  national_bulk_supply: boolean;
  government_institutional_projects: boolean;
  product_interest_other: string;
  terms_accepted: boolean;
  printed_name: string;
  sign_title: string;
  signed_date: string;
};

type ValidationKey =
  | keyof TradeProForm
  | "authorized_signature"
  | "st3_resale_certificate"
  | "tax_exemption_certificate"
  | "tax_status"
  | "business_type"
  | "product_interest";

type ValidationErrors = Partial<Record<ValidationKey, string>>;

const initialFormData: TradeProForm = {
  business_name: "",
  primary_contact_name: "",
  title_position: "",
  business_address: "",
  city: "",
  state: "",
  zip: "",
  phone: "",
  mobile: "",
  email: "",
  website: "",
  federal_ein_tax_id: "",
  taxable_account: false,
  resale_account: false,
  tax_exempt_organization: false,
  flooring_contractor: false,
  general_contractor: false,
  builder_developer: false,
  property_management: false,
  retail_showroom: false,
  distributor_supplier: false,
  commercial_end_user: false,
  business_type_other: "",
  insurance_carrier: "",
  policy_number: "",
  coverage_amount: "",
  spc_flooring: false,
  commercial_glue_down_lvt: false,
  project_supply_logistics: false,
  private_label_programs: false,
  national_bulk_supply: false,
  government_institutional_projects: false,
  product_interest_other: "",
  terms_accepted: false,
  printed_name: "",
  sign_title: "",
  signed_date: "",
};

const requiredFields: Array<[keyof TradeProForm, string]> = [
  ["business_name", "Business Name"],
  ["primary_contact_name", "Primary Contact Name"],
  ["title_position", "Title/Position"],
  ["business_address", "Business Address"],
  ["city", "City"],
  ["state", "State"],
  ["zip", "Zip"],
  ["phone", "Phone"],
  ["mobile", "Mobile"],
  ["email", "Email"],
  ["federal_ein_tax_id", "Federal EIN / Tax ID"],
  ["printed_name", "Printed Name"],
  ["sign_title", "Title"],
  ["signed_date", "Date"],
];

export default function TradePro() {
  const signatureInputRef = useRef<HTMLInputElement>(null);
  const st3InputRef = useRef<HTMLInputElement>(null);
  const taxExemptionInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<TradeProForm>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [signatureFileName, setSignatureFileName] = useState("");
  const [signaturePreview, setSignaturePreview] = useState("");
  const [st3Certificate, setSt3Certificate] = useState<File | null>(null);
  const [st3CertificatePreview, setSt3CertificatePreview] = useState("");
  const [taxExemptionCertificate, setTaxExemptionCertificate] = useState<File | null>(null);
  const [taxExemptionCertificatePreview, setTaxExemptionCertificatePreview] = useState("");
  const [errors, setErrors] = useState<ValidationErrors>({});

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, type, value, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((previous) => {
      const next = { ...previous };
      delete next[name as keyof TradeProForm];

      if (["taxable_account", "resale_account", "tax_exempt_organization"].includes(name)) {
        delete next.tax_status;
      }

      if (
        [
          "flooring_contractor",
          "general_contractor",
          "builder_developer",
          "property_management",
          "retail_showroom",
          "distributor_supplier",
          "commercial_end_user",
          "business_type_other",
        ].includes(name)
      ) {
        delete next.business_type;
      }

      if (
        [
          "spc_flooring",
          "commercial_glue_down_lvt",
          "project_supply_logistics",
          "private_label_programs",
          "national_bulk_supply",
          "government_institutional_projects",
          "product_interest_other",
        ].includes(name)
      ) {
        delete next.product_interest;
      }

      if (name === "terms_accepted") {
        delete next.terms_accepted;
      }

      return next;
    });
  };

  const handleSignatureUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setSignatureFile(file);
    setSignatureFileName(file.name);
    setErrors((previous) => {
      const next = { ...previous };
      delete next.authorized_signature;
      return next;
    });

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setSignaturePreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const clearSignature = () => {
    setSignatureFile(null);
    setSignatureFileName("");
    setSignaturePreview("");
    if (signatureInputRef.current) {
      signatureInputRef.current.value = "";
    }
  };

  const handleDocumentUpload =
    (setter: (file: File | null) => void, previewSetter: (preview: string) => void, errorKey: ValidationKey) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0] ?? null;

      setter(file);
      previewSetter("");
      setErrors((previous) => {
        const next = { ...previous };
        delete next[errorKey];
        return next;
      });

      if (!file || !file.type.startsWith("image/")) {
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          previewSetter(reader.result);
        }
      };
      reader.readAsDataURL(file);
    };

  const clearDocument = (
    setter: (file: File | null) => void,
    previewSetter: (preview: string) => void,
    inputRef: RefObject<HTMLInputElement | null>,
  ) => {
    setter(null);
    previewSetter("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const validateForm = () => {
    const nextErrors: ValidationErrors = {};

    requiredFields.forEach(([key, label]) => {
      const value = formData[key];
      if (typeof value === "string" && value.trim() === "") {
        nextErrors[key] = `${label} is required.`;
      }
    });
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      nextErrors.email = formData.email.trim() === "" ? "Email is required." : "Please enter a valid email address.";
    }

    if (!formData.taxable_account && !formData.resale_account && !formData.tax_exempt_organization) {
      nextErrors.tax_status = "Please select at least one tax status.";
    }

    if (
      !formData.flooring_contractor &&
      !formData.general_contractor &&
      !formData.builder_developer &&
      !formData.property_management &&
      !formData.retail_showroom &&
      !formData.distributor_supplier &&
      !formData.commercial_end_user &&
      formData.business_type_other.trim() === ""
    ) {
      nextErrors.business_type = "Please select or enter at least one business type.";
    }

    if (
      !formData.spc_flooring &&
      !formData.commercial_glue_down_lvt &&
      !formData.project_supply_logistics &&
      !formData.private_label_programs &&
      !formData.national_bulk_supply &&
      !formData.government_institutional_projects &&
      formData.product_interest_other.trim() === ""
    ) {
      nextErrors.product_interest = "Please select or enter at least one product/service interest.";
    }

    if (!formData.terms_accepted) {
      nextErrors.terms_accepted = "Please accept the Pro Account Terms.";
    }

    if (!signatureFile) {
      nextErrors.authorized_signature = "Please upload an authorized signature image.";
    }

    if (formData.resale_account && !st3Certificate) {
      nextErrors.st3_resale_certificate = "Please upload the ST-3 Resale Certificate.";
    }

    if (formData.tax_exempt_organization && !taxExemptionCertificate) {
      nextErrors.tax_exemption_certificate = "Please upload the Tax Exemption Certificate.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const appendFormData = (payload: FormData) => {
    Object.entries(formData).forEach(([key, value]) => {
      payload.append(key, typeof value === "boolean" ? (value ? "1" : "0") : value);
    });

    payload.append("authorized_signature", signatureFile as File);

    if (st3Certificate) {
      payload.append("st3_resale_certificate", st3Certificate);
    }

    if (taxExemptionCertificate) {
      payload.append("tax_exemption_certificate", taxExemptionCertificate);
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    clearSignature();
    setSt3Certificate(null);
    setSt3CertificatePreview("");
    setTaxExemptionCertificate(null);
    setTaxExemptionCertificatePreview("");
    setErrors({});

    if (st3InputRef.current) {
      st3InputRef.current.value = "";
    }

    if (taxExemptionInputRef.current) {
      taxExemptionInputRef.current.value = "";
    }
  };

  const fieldError = (field: ValidationKey) =>
    errors[field] ? (
      <p className="mt-1 text-[11px] leading-snug text-red-400">{errors[field]}</p>
    ) : null;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = new FormData();
      appendFormData(payload);

      const response = await api.post("/beforeauth/tradeproapplication", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }) as any;

      if (response?.status === 1) {
        showToast(response?.message || "Trade Pro application submitted successfully.", "success");
        resetForm();
      } else {
        showToast(response?.message || "Unable to submit the application. Please try again.", "error");
      }
    } catch (error: any) {
      showToast(error?.response?.data?.message || "Something went wrong. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#101113]  text-white lg:pb-8 md:pb-6 pb-4">
        <div className="container">
            <div className="border-2 border-primary rounded-[20px] p-4">
                <form onSubmit={handleSubmit} noValidate>
                    {/* Header / Logo */}
                    <div className="text-center lg:mb-8 md:mb-6 mb-4">
                    <img src={Logo} alt="Luxury Layers Company logo" className="mb-2 w-[150px] md:w-[180px] mx-auto" />
                    </div>
                    <h1 className="serif md:text-2xl text-xl lg:text-3xl text-center font-semibold mb-3 leading-none">
                    A-TRADE PRO PARTNERSHIP AGREEMENT
                    </h1>
                    <p className="text-center md:text-[14px] text-[10px] text-gray-300 max-w-3xl mx-auto lg:mb-10 md:mb-8 mb-6">
                    Complete this application to request access to A-Trade Pro pricing,
                    project support, commercial purchasing programs, supply-chain
                    services, and partnership benefits.
                    </p>

                    {/* Top grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8 md:gap-6 gap-4 lg:mb-10 md:mb-8 mb-6">
                    {/* Business Information */}
                    <div className="lg:col-span-2">
                        <h2 className="section-title lg:mb-5 md:mb-4 mb-3">BUSINESS INFORMATION</h2>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 lg:gap-y-5 md:gap-y-4 gap-y-3">
                        <div className="flex gap-2">
                            <label className="md:text-[14px] text-[10px] lg:w-[120px] md:w-[175px] w-[140px] flex-none whitespace-nowrap">
                            Business Name:
                            </label>
                            <div className="flex-1">
                            <input type="text" name="business_name" value={formData.business_name} onChange={handleInputChange} className="lux-input" />
                            {fieldError("business_name")}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <label className="md:text-[14px] text-[10px] md:w-[175px] w-[140px] flex-none whitespace-nowrap">
                            Primary Contact Name:
                            </label>
                            <div className="flex-1">
                            <input type="text" name="primary_contact_name" value={formData.primary_contact_name} onChange={handleInputChange} className="lux-input" />
                            {fieldError("primary_contact_name")}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <label className="md:text-[14px] text-[10px] lg:w-[120px] md:w-[175px] w-[140px] flex-none whitespace-nowrap">
                            Title/Position:
                            </label>
                            <div className="flex-1">
                            <input type="text" name="title_position" value={formData.title_position} onChange={handleInputChange} className="lux-input" />
                            {fieldError("title_position")}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <label className="md:text-[14px] text-[10px] md:w-[175px] w-[140px] flex-none whitespace-nowrap">
                            Business Address:
                            </label>
                            <div className="flex-1">
                            <input type="text" name="business_address" value={formData.business_address} onChange={handleInputChange} className="lux-input" />
                            {fieldError("business_address")}
                            </div>
                        </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-5 md:gap-4 gap-3 lg:mt-5 md:mt-4 mt-3">
                        <div className="flex gap-2">
                            <label className="md:text-[14px] text-[10px] lg:w-[120px] md:w-[175px] w-[140px] flex-none whitespace-nowrap">City:</label>
                            <div className="flex-1">
                            <input type="text" name="city" value={formData.city} onChange={handleInputChange} className="lux-input" />
                            {fieldError("city")}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <label className="md:text-[14px] text-[10px] lg:w-[120px] md:w-[175px] w-[140px] flex-none lg:text-center whitespace-nowrap">State:</label>
                            <div className="flex-1">
                            <input type="text" name="state" value={formData.state} onChange={handleInputChange} className="lux-input" />
                            {fieldError("state")}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <label className="md:text-[14px] text-[10px] lg:w-[120px] md:w-[175px] w-[140px] flex-none lg:text-center whitespace-nowrap">Zip:</label>
                            <div className="flex-1">
                            <input type="text" name="zip" value={formData.zip} onChange={handleInputChange} className="lux-input" />
                            {fieldError("zip")}
                            </div>
                        </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-6 lg:gap-y-5 md:gap-y-4 gap-y-3 lg:mt-5 md:mt-4 mt-3">
                        <div className="flex gap-2">
                            <label className="md:text-[14px] text-[10px] lg:w-[120px] md:w-[175px] w-[140px] flex-none whitespace-nowrap">Phone:</label>
                            <div className="flex-1">
                            <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="lux-input" />
                            {fieldError("phone")}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <label className="md:text-[14px] text-[10px] lg:text-center lg:w-[120px] md:w-[175px] w-[140px] flex-none whitespace-nowrap">
                            Mobile:
                            </label>
                            <div className="flex-1">
                            <input type="tel" name="mobile" value={formData.mobile} onChange={handleInputChange} className="lux-input" />
                            {fieldError("mobile")}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <label className="md:text-[14px] text-[10px] lg:w-[120px] md:w-[175px] w-[140px] flex-none lg:text-center whitespace-nowrap">Email:</label>
                            <div className="flex-1">
                            <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="lux-input" />
                            {fieldError("email")}
                            </div>
                        </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 lg:gap-y-5 md:gap-y-4 gap-y-3 lg:mt-5 md:mt-4 mt-3">
                        <div className="flex items-center lg:gap-4 md:gap-3 gap-2">
                            <label className="md:text-[14px] text-[10px] md:w-auto w-[140px] flex-none whitespace-nowrap">
                            Website (Optional):
                            </label>
                            <div className="flex-1">
                            <input type="url" name="website" value={formData.website} onChange={handleInputChange} className="lux-input" />
                            </div>
                        </div>
                        <div className="flex items-center lg:gap-4 md:gap-3 gap-2">
                            <label className="md:text-[14px] text-[10px] md:w-auto w-[140px] flex-none whitespace-nowrap">
                            Federal EIN / Tax ID:
                            </label>
                            <div className="flex-1">
                            <input type="text" name="federal_ein_tax_id" value={formData.federal_ein_tax_id} onChange={handleInputChange} className="lux-input" />
                            {fieldError("federal_ein_tax_id")}
                            </div>
                        </div>
                        </div>

                        {/* Business Type */}
                        <h2 className="section-title lg:mt-8 md:mt-6 mt-4 mb-4">BUSINESS TYPE</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 space-y-1">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" name="flooring_contractor" checked={formData.flooring_contractor} onChange={handleInputChange} className="lux-check" />{' '}
                            <span className="md:text-[14px] text-[10px]">Flooring Contractor</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" name="property_management" checked={formData.property_management} onChange={handleInputChange} className="lux-check" />{' '}
                            <span className="md:text-[14px] text-[10px]">Property Management</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" name="commercial_end_user" checked={formData.commercial_end_user} onChange={handleInputChange} className="lux-check" />{' '}
                            <span className="md:text-[14px] text-[10px]">Commercial End User</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" name="general_contractor" checked={formData.general_contractor} onChange={handleInputChange} className="lux-check" />{' '}
                            <span className="md:text-[14px] text-[10px]">General Contractor</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" name="retail_showroom" checked={formData.retail_showroom} onChange={handleInputChange} className="lux-check" />{' '}
                            <span className="md:text-[14px] text-[10px]">Retail Showroom</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer flex-wrap">
                            <input type="checkbox" className="lux-check" checked={formData.business_type_other.trim() !== ""} readOnly />
                            <span className="md:text-[14px] text-[10px]">Other:</span>
                            <input type="text" name="business_type_other" value={formData.business_type_other} onChange={handleInputChange} className="lux-input flex-1 min-w-[120px]" />
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" name="builder_developer" checked={formData.builder_developer} onChange={handleInputChange} className="lux-check" />{' '}
                            <span className="md:text-[14px] text-[10px]">Builder / Developer</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" name="distributor_supplier" checked={formData.distributor_supplier} onChange={handleInputChange} className="lux-check" />{' '}
                            <span className="md:text-[14px] text-[10px]">Distributor / Supplier</span>
                        </label>
                        </div>
                        {fieldError("business_type")}
                    </div>

                    {/* Tax Status + Required Docs */}
                    <div>
                        <h2 className="section-title lg:mb-5 md:mb-4 mb-3">TAX STATUS</h2>
                        <div className="space-y-3 lg:mb-8 md:mb-6 mb-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" name="taxable_account" checked={formData.taxable_account} onChange={handleInputChange} className="lux-check" />{' '}
                            <span className="md:text-[14px] text-[10px]">Taxable Account</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" name="resale_account" checked={formData.resale_account} onChange={handleInputChange} className="lux-check" />{' '}
                            <span className="md:text-[14px] text-[10px]">Resale Account (ST-3 Required)</span>
                        </label>
                        <label className="flex items-start gap-2 cursor-pointer">
                            <input type="checkbox" name="tax_exempt_organization" checked={formData.tax_exempt_organization} onChange={handleInputChange} className="lux-check mt-1" />
                            <span className="md:text-[14px] text-[10px]">
                            Tax Exempt Organization
                            <br />
                            <span className="text-xs text-gray-400">
                                (Tax Exemption Certificate Required)
                            </span>
                            </span>
                        </label>
                        {fieldError("tax_status")}
                        </div>

                        <h2 className="section-title mb-4">REQUIRED DOCUMENTATION</h2>
                        <ul className="space-y-2 md:text-[14px] text-[10px] text-gray-300 list-disc list-inside">
                        <li>ST-3 Resale Certificate (if applicable)</li>
                        <li>Tax Exemption Certificate (if applicable)</li>
                        <li>
                            Documents may be uploaded with this application or emailed
                            separately.
                        </li>
                        </ul>
                        <div className="mt-4 space-y-3">
                        <label className="block cursor-pointer border border-[#323335] px-3 py-2 text-xs text-gray-300 transition-colors duration-300 hover:border-[#c9a961]">
                            <span className="flex items-center justify-between gap-3">
                            <span className="truncate">
                                {st3Certificate?.name || "Upload ST-3 Resale Certificate"}
                            </span>
                            <Upload className="h-4 w-4 flex-none text-[#c9a961]" aria-hidden="true" />
                            </span>
                            <input
                            ref={st3InputRef}
                            type="file"
                            accept="image/*,.pdf"
                            className="sr-only"
                            onChange={handleDocumentUpload(
                                setSt3Certificate,
                                setSt3CertificatePreview,
                                "st3_resale_certificate",
                            )}
                            />
                        </label>
                        {fieldError("st3_resale_certificate")}
                        {st3CertificatePreview && (
                            <div className="flex items-start gap-3">
                            <div className="flex h-28 max-w-[320px] flex-1 items-center justify-center border border-[#323335] bg-white p-2">
                                <img
                                src={st3CertificatePreview}
                                alt="ST-3 Resale Certificate preview"
                                className="max-h-full max-w-full object-contain"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => clearDocument(setSt3Certificate, setSt3CertificatePreview, st3InputRef)}
                                className="flex h-8 w-8 flex-none items-center justify-center border border-[#323335] text-gray-300 transition-colors duration-300 hover:border-[#c9a961] hover:text-[#c9a961]"
                                aria-label="Remove ST-3 Resale Certificate"
                            >
                                <X className="h-4 w-4" aria-hidden="true" />
                            </button>
                            </div>
                        )}
                        <label className="block cursor-pointer border border-[#323335] px-3 py-2 text-xs text-gray-300 transition-colors duration-300 hover:border-[#c9a961]">
                            <span className="flex items-center justify-between gap-3">
                            <span className="truncate">
                                {taxExemptionCertificate?.name || "Upload Tax Exemption Certificate"}
                            </span>
                            <Upload className="h-4 w-4 flex-none text-[#c9a961]" aria-hidden="true" />
                            </span>
                            <input
                            ref={taxExemptionInputRef}
                            type="file"
                            accept="image/*,.pdf"
                            className="sr-only"
                            onChange={handleDocumentUpload(
                                setTaxExemptionCertificate,
                                setTaxExemptionCertificatePreview,
                                "tax_exemption_certificate",
                            )}
                            />
                        </label>
                        {fieldError("tax_exemption_certificate")}
                        {taxExemptionCertificatePreview && (
                            <div className="flex items-start gap-3">
                            <div className="flex h-28 max-w-[320px] flex-1 items-center justify-center border border-[#323335] bg-white p-2">
                                <img
                                src={taxExemptionCertificatePreview}
                                alt="Tax Exemption Certificate preview"
                                className="max-h-full max-w-full object-contain"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() =>
                                clearDocument(
                                    setTaxExemptionCertificate,
                                    setTaxExemptionCertificatePreview,
                                    taxExemptionInputRef,
                                )
                                }
                                className="flex h-8 w-8 flex-none items-center justify-center border border-[#323335] text-gray-300 transition-colors duration-300 hover:border-[#c9a961] hover:text-[#c9a961]"
                                aria-label="Remove Tax Exemption Certificate"
                            >
                                <X className="h-4 w-4" aria-hidden="true" />
                            </button>
                            </div>
                        )}
                        </div>
                    </div>
                    </div>

                    {/* Middle Panel */}
                    <div className="panel p-6 sm:p-8 lg:mb-10 md:mb-8 mb-6">
                    <div className="flex md:flex-row flex-col gap-10">
                        <div className="lg:w-1/3 md:w-1/2">
                        <h2 className="section-title lg:mb-5 md:mb-4 mb-3">
                            INSURANCE INFORMATION (OPTIONAL)
                        </h2>
                        <div className="space-y-5">
                            <div className="flex gap-2">
                            <label className="md:text-[14px] text-[10px] lg:w-36 md:w-[120px] w-[104px] flex-none whitespace-nowrap">
                                Insurance Carrier:
                            </label>
                            <div className="flex-1">
                                <input type="text" name="insurance_carrier" value={formData.insurance_carrier} onChange={handleInputChange} className="lux-input" />
                            </div>
                            </div>
                            <div className="flex gap-2">
                            <label className="md:text-[14px] text-[10px] lg:w-36 md:w-[120px] w-[104px] flex-none whitespace-nowrap">
                                Policy Number:
                            </label>
                            <div className="flex-1">
                                <input type="text" name="policy_number" value={formData.policy_number} onChange={handleInputChange} className="lux-input" />
                            </div>
                            </div>
                            <div className="flex gap-2">
                            <label className="md:text-[14px] text-[10px] lg:w-36 md:w-[120px] w-[104px] flex-none whitespace-nowrap">
                                Coverage Amount:
                            </label>
                            <div className="flex-1">
                                <input type="text" name="coverage_amount" value={formData.coverage_amount} onChange={handleInputChange} className="lux-input" />
                            </div>
                            </div>
                        </div>
                        </div>

                        <div className="lg:w-2/3 md:w-1/2">
                        <h2 className="section-title lg:mb-5 md:mb-4 mb-3">PRODUCT / SERVICE INTEREST</h2>
                        <div className="flex gap-y-2 sm:gap-y-0 gap-x-6 flex-wrap 2xl:flex-nowrap">
                            <div className="flex-none lg:space-y-0 space-y-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" name="spc_flooring" checked={formData.spc_flooring} onChange={handleInputChange} className="lux-check" />{' '}
                                <span className="md:text-[14px] text-[10px]">SPC Flooring</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" name="private_label_programs" checked={formData.private_label_programs} onChange={handleInputChange} className="lux-check" />{' '}
                                <span className="md:text-[14px] text-[10px]">Private Label Programs</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" name="commercial_glue_down_lvt" checked={formData.commercial_glue_down_lvt} onChange={handleInputChange} className="lux-check" />{' '}
                                <span className="md:text-[14px] text-[10px]">Commercial Glue-Down LVT</span>
                            </label>
                            </div>
                            <div className="flex-none lg:space-y-0 space-y-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" name="national_bulk_supply" checked={formData.national_bulk_supply} onChange={handleInputChange} className="lux-check" />{' '}
                                <span className="md:text-[14px] text-[10px]">National / Bulk Supply</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" name="project_supply_logistics" checked={formData.project_supply_logistics} onChange={handleInputChange} className="lux-check" />{' '}
                                <span className="md:text-[14px] text-[10px]">
                                Project Supply &amp; Logistics
                                </span>
                            </label>
                            <label className="flex items-start gap-2 cursor-pointer">
                                <input type="checkbox" name="government_institutional_projects" checked={formData.government_institutional_projects} onChange={handleInputChange} className="lux-check mt-1" />{' '}
                                <span className="md:text-[14px] text-[10px]">
                                Government /<br />
                                Institutional Projects
                                </span>
                            </label>
                            </div>
                            <div className="w-full">
                            <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                                <input type="checkbox" className="lux-check" checked={formData.product_interest_other.trim() !== ""} readOnly />
                                <span className="md:text-[14px] text-[10px]">Other (Please Specify)</span>
                            </label>
                            <input type="text" name="product_interest_other" value={formData.product_interest_other} onChange={handleInputChange} className="lux-input mt-1" />
                            </div>
                        </div>
                        {fieldError("product_interest")}
                        </div>
                    </div>
                    </div>

                    {/* Bottom Section */}
                    <div className="flex lg:flex-row flex-col lg:gap-10 gap-6 mb-8">
                    <div className="lg:w-[36%]">
                        <h2 className="section-title mb-4">
                        PRO ACCOUNT TERMS &amp; NON-CIRCUMVENT AGREEMENT
                        </h2>
                        <div className="flex items-start gap-3 cursor-pointer">
                        <input
                            id="trade-pro-terms-accepted"
                            type="checkbox"
                            name="terms_accepted"
                            checked={formData.terms_accepted}
                            onChange={handleInputChange}
                            className="lux-check mt-1"
                        />
                        <label
                            htmlFor="trade-pro-terms-accepted"
                            className="cursor-pointer md:text-[14px] text-[10px] leading-relaxed"
                        >
                            I have read, understand, and agree to the{" "}
                            <Link
                            to={paths.tradeProTermsAndConditions.getHref()}
                            className="text-[#c9a961] underline underline-offset-4 transition-colors duration-300 hover:text-white"
                            onClick={(event) => event.stopPropagation()}
                            >
                            Pro Account Terms and Non-Circumvent Agreement
                            </Link>
                            .
                        </label>
                        </div>
                        {fieldError("terms_accepted")}
                    </div>

                    <div>
                        <h2 className="section-title lg:mb-5 md:mb-4 mb-3">
                        AUTHORIZATION &amp; ELECTRONIC SIGNATURE
                        </h2>
                        <div className="space-y-5">
                        <div className="flex gap-2 flex-wrap">
                            <label className="md:text-[14px] text-[10px] lg:w-[176px] md:w-[172px] whitespace-nowrap">
                            Authorized Signature:
                            </label>
                            <div className="flex-1">
                            <label
                                htmlFor="authorized-signature"
                                className="flex min-h-[38px] cursor-pointer items-start justify-between gap-3 border border-[#323335] px-3 py-2 text-sm text-white transition-colors duration-300 hover:border-[#c9a961]"
                            >
                                <span className="min-w-0 truncate text-gray-300">
                                {signatureFileName || "Upload signature image"}
                                </span>
                                <Upload className="h-4 w-4 flex-none text-[#c9a961]" aria-hidden="true" />
                            </label>
                            <input
                                ref={signatureInputRef}
                                id="authorized-signature"
                                name="authorized_signature"
                                type="file"
                                accept="image/*"
                                className="sr-only"
                                onChange={handleSignatureUpload}
                            />
                            {fieldError("authorized_signature")}
                            {signaturePreview && (
                                <div className="mt-3 flex items-start gap-3">
                                <div className="flex h-20 max-w-[260px] flex-1 items-center justify-center border border-[#323335] bg-white p-2">
                                    <img
                                    src={signaturePreview}
                                    alt="Authorized signature preview"
                                    className="max-h-full max-w-full object-contain"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={clearSignature}
                                    className="flex h-8 w-8 flex-none items-center justify-center border border-[#323335] text-gray-300 transition-colors duration-300 hover:border-[#c9a961] hover:text-[#c9a961]"
                                    aria-label="Remove signature image"
                                >
                                    <X className="h-4 w-4" aria-hidden="true" />
                                </button>
                                </div>
                            )}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div className="flex gap-2">
                            <label className="md:text-[14px] text-[10px] w-28 whitespace-nowrap">
                                Printed Name:
                            </label>
                            <div className="flex-1">
                                <input type="text" name="printed_name" value={formData.printed_name} onChange={handleInputChange} className="lux-input" />
                                {fieldError("printed_name")}
                            </div>
                            </div>
                            <div className="flex gap-2">
                            <label className="md:text-[14px] text-[10px] md:w-14 w-[31px] whitespace-nowrap">
                                Title:
                            </label>
                            <div className="flex-1">
                                <input type="text" name="sign_title" value={formData.sign_title} onChange={handleInputChange} className="lux-input" />
                                {fieldError("sign_title")}
                            </div>
                            </div>
                            <div className="flex gap-2">
                            <label className="md:text-[14px] text-[10px] md:w-14 w-[31px] whitespace-nowrap">Date:</label>
                            <div className="flex-1">
                                <input
                                name="signed_date"
                                type="date"
                                placeholder="DD/MM/YYYY"
                                value={formData.signed_date}
                                onChange={handleInputChange}
                                className="lux-input"
                                />
                                {fieldError("signed_date")}
                            </div>
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>

                    {/* Footer */}
                    <div
                    className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pt-6 border-t"
                    style={{
                        borderColor: 'rgba(201, 169, 97, 0.3)',
                    }}
                    >
                    <p className="text-xs text-gray-400 max-w-2xl leading-relaxed">
                        This agreement is intended for execution through DocuSign or other
                        electronic signature platforms and shall be deemed legally binding
                        upon electronic acceptance and signature.
                    </p>
                    <button type="submit" disabled={isSubmitting} className="flex items-center justify-between gap-2 bg-gradient-to-r from-[#d4af37] to-[#f5d76e] text-black font-semibold rounded-full px-6 py-3 transition-all duration-300 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100 group">
                        {isSubmitting ? "SUBMITTING..." : "SUBMIT APPLICATION"}
                    </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  );
}
