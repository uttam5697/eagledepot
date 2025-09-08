import { PiUserLight } from "react-icons/pi";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { useState, useRef, useEffect } from "react";

const AuthDropdown: React.FC = () => {
  const { isLoggedIn, firstName, logout } = useUser();
  const [open, setOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/login");
    window.location.reload();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isLoggedIn) {
    return (
      <Link
        to="/login"
        className="flex white-btn group lg:gap-6 md:gap-5 gap-4 lg:px-5 md:px-4 px-3 mr-4 md:mr-0 lg:py-[18px] md:py-3 py-2"
      >
        <span className="leading-none">Login</span>
        <PiUserLight className="text-2sm font-bold duration-300 transition-all" />
      </Link>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex white-btn group lg:gap-6 md:gap-5 gap-4 lg:px-5 md:px-4 px-3 mr-4 md:mr-0 lg:py-[18px] md:py-3 py-2"
      >
        <span className="leading-none">{firstName}</span>
        <PiUserLight className="text-2sm font-bold duration-300 transition-all" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-md z-50">
          {/* <Link
            to="/profile"
            className="block px-4 py-2 text-sm hover:bg-gray-100 cursor-not-allowed"
            onClick={() => setOpen(false)}
            
          >
            Profile
          </Link> */}
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default AuthDropdown;
