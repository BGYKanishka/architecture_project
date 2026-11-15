import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const error = params.get("error");
    if (error) {
      console.error("Sign-in failed with error code:", error);
      alert("Sign-in failed: " + error + ". Please try signing in again.");
    }
    navigate("/", { replace: true });
  }, [location.search, navigate]);

  return null;
}
