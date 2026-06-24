import { Logo } from "../assets/Index";


export default function TradePro() {

  return (
    <div
      className="min-h-screen bg-[#101113]  text-white lg:pb-8 md:pb-6 pb-4">
      <div className="container">
        <div className="border-2 border-primary rounded-[20px] p-4">
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
                <div className="flex items-center gap-2">
                    <label className="md:text-[14px] text-[10px] lg:w-[120px] md:w-[175px] w-[140px] flex-none whitespace-nowrap">
                    Business Name:
                    </label>
                    <input type="text" className="lux-input" />
                </div>
                <div className="flex items-center gap-2">
                    <label className="md:text-[14px] text-[10px] md:w-[175px] w-[140px] flex-none whitespace-nowrap">
                    Primary Contact Name:
                    </label>
                    <input type="text" className="lux-input" />
                </div>
                <div className="flex items-center gap-2">
                    <label className="md:text-[14px] text-[10px] lg:w-[120px] md:w-[175px] w-[140px] flex-none whitespace-nowrap">
                    Title/Position:
                    </label>
                    <input type="text" className="lux-input" />
                </div>
                <div className="flex items-center gap-2">
                    <label className="md:text-[14px] text-[10px] md:w-[175px] w-[140px] flex-none whitespace-nowrap">
                    Business Address:
                    </label>
                    <input type="text" className="lux-input" />
                </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-5 md:gap-4 gap-3 lg:mt-5 md:mt-4 mt-3">
                <div className="flex items-center gap-2">
                    <label className="md:text-[14px] text-[10px] lg:w-[120px] md:w-[175px] w-[140px] flex-none whitespace-nowrap">City:</label>
                    <input type="text" className="lux-input" />
                </div>
                <div className="flex items-center gap-2">
                    <label className="md:text-[14px] text-[10px] lg:w-[120px] md:w-[175px] w-[140px] flex-none lg:text-center whitespace-nowrap">State:</label>
                    <input type="text" className="lux-input" />
                </div>
                <div className="flex items-center gap-2">
                    <label className="md:text-[14px] text-[10px] lg:w-[120px] md:w-[175px] w-[140px] flex-none lg:text-center whitespace-nowrap">Zip:</label>
                    <input type="text" className="lux-input" />
                </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-6 lg:gap-y-5 md:gap-y-4 gap-y-3 lg:mt-5 md:mt-4 mt-3">
                <div className="flex items-center gap-2">
                    <label className="md:text-[14px] text-[10px] lg:w-[120px] md:w-[175px] w-[140px] flex-none whitespace-nowrap">Phone:</label>
                    <input type="tel" className="lux-input" />
                </div>
                <div className="flex items-center gap-2">
                    <label className="md:text-[14px] text-[10px] lg:text-center lg:w-[120px] md:w-[175px] w-[140px] flex-none whitespace-nowrap">
                    Mobile:
                    </label>
                    <input type="tel" className="lux-input" />
                </div>
                <div className="flex items-center gap-2">
                    <label className="md:text-[14px] text-[10px] lg:w-[120px] md:w-[175px] w-[140px] flex-none lg:text-center whitespace-nowrap">Email:</label>
                    <input type="email" className="lux-input" />
                </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 lg:gap-y-5 md:gap-y-4 gap-y-3 lg:mt-5 md:mt-4 mt-3">
                <div className="flex items-center lg:gap-4 md:gap-3 gap-2">
                    <label className="md:text-[14px] text-[10px] md:w-auto w-[140px] flex-none whitespace-nowrap">
                    Website (Optional):
                    </label>
                    <input type="url" className="lux-input" />
                </div>
                <div className="flex items-center lg:gap-4 md:gap-3 gap-2">
                    <label className="md:text-[14px] text-[10px] md:w-auto w-[140px] flex-none whitespace-nowrap">
                    Federal EIN / Tax ID:
                    </label>
                    <input type="text" className="lux-input" />
                </div>
                </div>

                {/* Business Type */}
                <h2 className="section-title lg:mt-8 md:mt-6 mt-4 mb-4">BUSINESS TYPE</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 space-y-1">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="lux-check" />{' '}
                    <span className="md:text-[14px] text-[10px]">Flooring Contractor</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="lux-check" />{' '}
                    <span className="md:text-[14px] text-[10px]">Property Management</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="lux-check" />{' '}
                    <span className="md:text-[14px] text-[10px]">Commercial End User</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="lux-check" />{' '}
                    <span className="md:text-[14px] text-[10px]">General Contractor</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="lux-check" />{' '}
                    <span className="md:text-[14px] text-[10px]">Retail Showroom</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer flex-wrap">
                    <input type="checkbox" className="lux-check" />
                    <span className="md:text-[14px] text-[10px]">Other:</span>
                    <input type="text" className="lux-input flex-1 min-w-[120px]" />
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="lux-check" />{' '}
                    <span className="md:text-[14px] text-[10px]">Builder / Developer</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="lux-check" />{' '}
                    <span className="md:text-[14px] text-[10px]">Distributor / Supplier</span>
                </label>
                </div>
            </div>

            {/* Tax Status + Required Docs */}
            <div>
                <h2 className="section-title lg:mb-5 md:mb-4 mb-3">TAX STATUS</h2>
                <div className="space-y-3 lg:mb-8 md:mb-6 mb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="lux-check" />{' '}
                    <span className="md:text-[14px] text-[10px]">Taxable Account</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="lux-check" />{' '}
                    <span className="md:text-[14px] text-[10px]">Resale Account (ST-3 Required)</span>
                </label>
                <label className="flex items-start gap-2 cursor-pointer">
                    <input type="checkbox" className="lux-check mt-1" />
                    <span className="md:text-[14px] text-[10px]">
                    Tax Exempt Organization
                    <br />
                    <span className="text-xs text-gray-400">
                        (Tax Exemption Certificate Required)
                    </span>
                    </span>
                </label>
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
                    <div className="flex items-center gap-2">
                    <label className="md:text-[14px] text-[10px] lg:w-36 md:w-[120px] w-[104px] flex-none whitespace-nowrap">
                        Insurance Carrier:
                    </label>
                    <input type="text" className="lux-input" />
                    </div>
                    <div className="flex items-center gap-2">
                    <label className="md:text-[14px] text-[10px] lg:w-36 md:w-[120px] w-[104px] flex-none whitespace-nowrap">
                        Policy Number:
                    </label>
                    <input type="text" className="lux-input" />
                    </div>
                    <div className="flex items-center gap-2">
                    <label className="md:text-[14px] text-[10px] lg:w-36 md:w-[120px] w-[104px] flex-none whitespace-nowrap">
                        Coverage Amount:
                    </label>
                    <input type="text" className="lux-input" />
                    </div>
                </div>
                </div>

                <div className="lg:w-2/3 md:w-1/2">
                <h2 className="section-title lg:mb-5 md:mb-4 mb-3">PRODUCT / SERVICE INTEREST</h2>
                <div className="flex gap-y-2 sm:gap-y-0 gap-x-6 flex-wrap 2xl:flex-nowrap">
                    <div className="flex-none lg:space-y-0 space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="lux-check" />{' '}
                        <span className="md:text-[14px] text-[10px]">SPC Flooring</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="lux-check" />{' '}
                        <span className="md:text-[14px] text-[10px]">Private Label Programs</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="lux-check" />{' '}
                        <span className="md:text-[14px] text-[10px]">Commercial Glue-Down LVT</span>
                    </label>
                    </div>
                    <div className="flex-none lg:space-y-0 space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="lux-check" />{' '}
                        <span className="md:text-[14px] text-[10px]">National / Bulk Supply</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="lux-check" />{' '}
                        <span className="md:text-[14px] text-[10px]">
                        Project Supply &amp; Logistics
                        </span>
                    </label>
                    <label className="flex items-start gap-2 cursor-pointer">
                        <input type="checkbox" className="lux-check mt-1" />{' '}
                        <span className="md:text-[14px] text-[10px]">
                        Government /<br />
                        Institutional Projects
                        </span>
                    </label>
                    </div>
                    <div className="w-full">
                    <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                        <input type="checkbox" className="lux-check" />
                        <span className="md:text-[14px] text-[10px]">Other (Please Specify)</span>
                    </label>
                    <input type="text" className="lux-input mt-1" />
                    </div>
                </div>
                </div>
            </div>
            </div>

            {/* Bottom Section */}
            <div className="flex lg:flex-row flex-col lg:gap-10 gap-6 mb-8">
            <div className="lg:w-[36%]">
                <h2 className="section-title mb-4">
                PRO ACCOUNT TERMS &amp; NON-CIRCUMVENT AGREEMENT
                </h2>
                <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" className="lux-check mt-1" />
                <span className="md:text-[14px] text-[10px] leading-relaxed">
                    I have read, understand, and agree to the Pro Account Terms and
                    Non-Circumvent Agreement.
                </span>
                </label>
            </div>

            <div>
                <h2 className="section-title lg:mb-5 md:mb-4 mb-3">
                AUTHORIZATION &amp; ELECTRONIC SIGNATURE
                </h2>
                <div className="space-y-5">
                <div className="flex items-center gap-2">
                    <label className="md:text-[14px] text-[10px] lg:w-[176px] md:w-[137px] whitespace-nowrap">
                    Authorized Signature:
                    </label>
                    <div className="relative flex-1">
                    <input type="text" className="lux-input" />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 gold text-xs">
                        ✎
                    </span>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="flex items-center gap-2">
                    <label className="md:text-[14px] text-[10px] w-28 whitespace-nowrap">
                        Printed Name:
                    </label>
                    <input type="text" className="lux-input" />
                    </div>
                    <div className="flex items-center gap-2">
                    <label className="md:text-[14px] text-[10px] md:w-14 w-[31px] whitespace-nowrap">
                        Title:
                    </label>
                    <input type="text" className="lux-input" />
                    </div>
                    <div className="flex items-center gap-2">
                    <label className="md:text-[14px] text-[10px] md:w-14 w-[31px] whitespace-nowrap">Date:</label>
                    <input
                        type="date"
                        placeholder="DD/MM/YYYY"
                        className="lux-input"
                    />
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
            <button type="button" className="flex items-center justify-between gap-2 bg-gradient-to-r from-[#d4af37] to-[#f5d76e] text-black font-semibold rounded-full px-6 py-3 transition-all duration-300 hover:scale-105 group">
                SUBMIT APPLICATION
            </button>
            </div>
        </div>
      </div>
    </div>
  );
}
