import { useEffect, useState } from "react";
import { Logo } from "../../assets/Index";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import api from "../../lib/api";
import { showToast } from "../../utils/toastUtils";
import { paths } from "../../config/path";
import { useUser } from "../context/UserContext";

type FormFields = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
};

export default function SignUp() {
  const navigate = useNavigate();
  const {authKey, login } = useUser();
  const url = new URL(window.location.href);
  const redirect = url.searchParams.get("redirect");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState<FormFields>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const payload = new FormData();
      payload.append("Appuser[first_name]", formData.firstName);
      payload.append("Appuser[last_name]", formData.lastName);
      payload.append("Appuser[email]", formData.email);
      payload.append("Appuser[password]", formData.password);
      payload.append("Appuser[postal_code]", "000000");
      payload.append("Appuser[phone_number]", "0000000000");
      payload.append("Appuser[login_type]", "Normal");
      payload.append("Appuser[devices_type]", "Web");
      payload.append("Appuser[devices_name]", "mi y1");
      payload.append("Appuser[devices_id]", "erfrrdfjjweksh123464758nbvbdshjasdwarfe");
      payload.append("Appuser[app_version]", "1");

      const res = await api.post("/beforeauth/usersignup", payload) as any;
      if (res.status === 1) {
        localStorage.setItem("authKey", res?.data?.auth_key);
        login({
          firstName: res?.data?.first_name,
          lastName: res?.data?.first_name,
          fullName: res?.data?.full_name,
          authKey: res?.data?.auth_key,
        });
        showToast(res?.message, "success"); 
        if (redirect) {
        window.location.href = redirect;
      } else {
        navigate(paths.home.path, { replace: true });
      }
      }else{
        showToast(res?.message, "error");
      }
      

    } catch (error: any) {
      console.error("Signup error", error);
      alert("Something went wrong. Please try again.");
    }
  };

  const handleRedirect = () => {
     if(redirect){
     navigate(`${paths.login.path}?redirect=${redirect}`);
    }else{
      navigate(`${paths.login.path}`);
    }
  };

    useEffect(() => {
  if (authKey) {
    if (redirect) {
      // redirect is always a relative path now
      navigate(redirect, { replace: true });
    } else {
      navigate(paths.home.path, { replace: true });
    }
  }
}, [authKey, redirect, navigate]);

  return (
    <div className="w-full lg:min-h-screen flex justify-center items-center flex-col py-4">
      <div className="w-full md:w-1/2  px-3 flex flex-col justify-center">
        <div className="w-full bg-white rounded-lg md:p-4 p-3 shadow-lg max-w-[500px] mx-auto">
          <div className="flex justify-center mb-6">
            <img className="max-h-[146px]" src={Logo} alt="Eagle Logo" />
          </div>
          <h2 className="xl:text-2xl lg:text-xl md:text-base text-base font-bold text-black mb-2 text-center">
            Create your account
          </h2>
          <p className="text-gray-600 text-sm text-center mb-6">
            Join us and start your journey with Eagle
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 grid-cols-1 gap-3">
              <div>
                <label className="block md:text-sm text-xs font-medium text-black mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="First name"
                  required
                />
              </div>
              <div>
                <label className="block md:text-sm text-xs font-medium text-black mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Last name"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block md:text-sm text-xs font-medium text-black mb-1">
                Email address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="relative">
              <label className="block md:text-sm text-xs font-medium text-black mb-1">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Create a password"
                required
              />
              <div
                className="absolute right-3 top-10 cursor-pointer text-blacks"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </div>
            </div>

            <div className="relative">
              <label className="block md:text-sm text-xs font-medium text-black mb-1">
                Confirm Password
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Confirm your password"
                required
              />
              <div
                className="absolute right-3 top-10 cursor-pointer text-blacks"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </div>
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
                className="mr-2 mt-[2px]"
                required
                id="agreeToTerms"
              />
              <label
                htmlFor="agreeToTerms"
                className="text-sm text-black leading-none accent-black"
              >
                I agree to the{" "}
                <Link to={"/terms-and-conditions"} className="text-primary hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to={"/privacy-policy"} className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-primary text-white font-semibold rounded hover:bg-transparent hover:text-primary border border-primary transition"
            >
              Create Account
            </button>
          </form>

          <div className="text-center mt-4">
            <span className="text-gray-600 text-sm">
              Already have an account?{" "}
            </span>
            <button  onClick={handleRedirect} className="text-primary text-sm hover:underline">
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
