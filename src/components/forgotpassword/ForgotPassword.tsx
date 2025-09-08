import { useState } from "react";
import { Logo } from "../../assets/Index";
import { FiMail, FiArrowLeft } from "react-icons/fi";
import api from "../../lib/api";
import { showToast } from "../../utils/toastUtils";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    formData.append("Appuser[email]", email);
      try {
        const response = await api.post("/beforeauth/forgotpassword", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response?.data?.auth_key) {
          localStorage.setItem("authKey", response?.data?.auth_key);
          
          showToast("Logged in successfully!", "success");
        }

      } catch (error: any) {
        console.error("Login error:", error);
        showToast(error?.response?.data?.message || "Login failed");
      }
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitted(true);
      setIsLoading(false);
    }, 2000);
  };

  const handleBackToLogin = () => {
    // Navigate back to login page
    window.history.back();
  };

  return (
    <div className="w-full lg:min-h-screen flex justify-center items-center flex-col py-4">
      <div className="w-full md:w-1/2  px-3 flex flex-col justify-center">
        <div className="w-full bg-white rounded-lg md:p-4 p-3 shadow-lg max-w-[500px] mx-auto">
          {/* Back to Login Button */}
          <button
            onClick={handleBackToLogin}
            className="flex items-center text-black hover:text-primary mb-4 md:text-sm text-xs transition-colors"
          >
            <FiArrowLeft className="mr-2" />
            Back to Login
          </button>

          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img className="max-h-[146px]" src={Logo} alt="Eagle Logo" />
          </div>

          {!isSubmitted ? (
            <>
              <h2 className="xl:text-2xl lg:text-xl md:text-base text-base font-bold text-black mb-2 text-center">
                Forgot your password?
              </h2>
              <p className="text-gray-600 text-center mb-6">
                No worries, we'll send you reset instructions.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block md:text-sm text-xs font-medium text-black mb-1">
                    Email address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 pl-10 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Enter your email"
                      required
                    />
                    <FiMail className="absolute left-3 top-3 text-gray-400" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !email}
                  className="w-full py-2 bg-primary text-white font-semibold rounded hover:bg-transparent hover:text-primary border border-primary transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending...
                    </div>
                  ) : (
                    "Reset password"
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-black mb-2">
                Check your email
              </h2>
              <p className="text-gray-600 mb-6">
                We sent a password reset link to{" "}
                <span className="font-semibold">{email}</span>
              </p>
              <button
                onClick={handleBackToLogin}
                className="w-full py-2 bg-primary text-white font-semibold rounded hover:bg-transparent hover:text-primary border border-primary transition"
              >
                Back to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}