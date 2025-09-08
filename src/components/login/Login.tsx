import { useEffect, useState } from "react";
import { Logo } from "../../assets/Index";
import { FiArrowLeft, FiEye, FiEyeOff } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import api from "../../lib/api";
import { showToast } from "../../utils/toastUtils";
import { paths } from "../../config/path";
import { useUser } from "../context/UserContext";

// Utility to generate UUID-like device token
const generateDeviceToken = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// Retrieve or create a device token
const getDeviceToken = () => {
  let token = localStorage.getItem("deviceToken");
  if (!token) {
    token = generateDeviceToken();
    localStorage.setItem("deviceToken", token);
  }
  return token;
};

export default function Login() {
  const { authKey, login } = useUser(); // <-- Get current user
  const url = new URL(window.location.href);
  const redirect = url.searchParams.get("redirect");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // 🚀 Redirect if already logged in
  useEffect(() => {
  if (authKey) {
    if (redirect) {
      // redirect is relative path now (e.g. /products/xxx)
      navigate(redirect, { replace: true });
    } else {
      navigate(paths.home.path, { replace: true });
    }
  }
}, [authKey, redirect, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("Appuser[email]", email);
    formData.append("Appuser[password]", password);
    formData.append("Appuser[devices_type]", "Web");
    formData.append("Appuser[devices_name]", "mi y1");
    formData.append("Appuser[app_version]", "1");

    const deviceToken = getDeviceToken();
    formData.append("Appuser[devices_id]", deviceToken);

    try {
      const response = await api.post("/beforeauth/login", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }) as any;

      if (response?.data?.auth_key) {
        localStorage.setItem("authKey", response?.data?.auth_key);
        login({
          firstName: response?.data?.first_name,
          lastName: response?.data?.first_name,
          fullName: response?.data?.full_name,
          authKey: response?.data?.auth_key,
        });
        showToast(response?.message, "success");
        if (redirect) {
          window.location.href = redirect;
        } else {
          navigate(paths.home.path, { replace: true });
        }
      } else {
        showToast(response?.message, "error");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      showToast(error?.response?.data?.message || "Login failed");
    }
  };

  const handleSignup = () => {
    if (redirect) {
      navigate(`${paths.signup.path}?redirect=${redirect}`);
    } else {
      navigate(paths.signup.path);
    }
  };

  return (
    <div className="w-full lg:min-h-screen flex justify-center items-center flex-col py-4">
      <div className="w-full md:w-1/2 px-3 flex flex-col justify-center">
        <div className="w-full bg-white rounded-lg md:p-4 p-3 shadow-lg max-w-[500px] mx-auto">
          <Link
            to={"/"}
            className="flex items-center text-black hover:text-primary mb-4 md:text-sm text-xs transition-colors"
          >
            <FiArrowLeft className="mr-2" />
            Back
          </Link>
          <div className="flex justify-center mb-6">
            <img className="max-h-[146px]" src={Logo} alt="Eagle Logo" />
          </div>
          <h2 className="xl:text-2xl lg:text-xl md:text-base text-base font-bold text-black mb-2 text-center">
            Sign in to your account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block md:text-sm text-xs font-medium text-black mb-1">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter your password"
                required
              />
              <div
                className="absolute right-3 top-10 cursor-pointer text-blacks"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center text-sm accent-black">
                <input type="checkbox" className="mr-2" />
                Remember me
              </label>
              <Link
                to={"/forgot-password"}
                className="text-primary text-sm hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-primary text-white font-semibold rounded hover:bg-transparent hover:text-primary border border-primary transition"
            >
              Sign in
            </button>
          </form>
          <div className="text-center mt-4">
            <button
              onClick={handleSignup}
              className="text-black font-bold text-sm hover:underline"
            >
              Create an Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
