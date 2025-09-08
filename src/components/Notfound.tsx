import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to home page immediately
    navigate("/", { replace: true });
  }, [navigate]);

  return null; // No UI because we are redirecting instantly
};

export default NotFound;
