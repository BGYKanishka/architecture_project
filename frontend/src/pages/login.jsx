import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthService from "../services/auth.service";
import backgroundImg from "../assets/background.jpg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await AuthService.login(email, password);

      const roles = data.roles || [];

      if (roles.includes("ROLE_ADMIN")) {
        navigate("/admin/dashboard");
      } else if (roles.includes("ROLE_EMPLOYEE")) {
        navigate("/employee");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      const resMessage =
        (err.response && err.response.data && err.response.data.message) ||
        "Login failed. Invalid credentials.";
      setError(resMessage);
      setLoading(false);
    }
  };

  return (
    <div
      className="relative flex items-center justify-center min-h-screen p-4 overflow-hidden"
      style={{
        background:
          "linear-gradient(to right, #0f1d45 0%, #0f1d45 50%, #eff6ff 50%, #eff6ff 100%)",
      }}
    >
      {/* Decorative Background Shapes */}
      <div className="absolute top-[-80px] right-[-80px] w-[300px] h-[300px] rounded-full border-[40px] border-blue-300/40"></div>
      <div className="absolute top-[15%] right-[5%] w-[180px] h-[180px] rounded-full bg-blue-300/30"></div>
      <div className="absolute bottom-[-60px] left-[-60px] w-[250px] h-[250px] rounded-full border-[35px] border-indigo-300/30"></div>
      <div className="absolute bottom-[10%] right-[15%] w-[80px] h-[80px] rounded-full bg-blue-400/20"></div>
      <div className="absolute top-[40%] left-[3%] w-[100px] h-[100px] rounded-full bg-indigo-300/25"></div>

      {/* Combined Card Container */}
      <div className="relative z-10 flex w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden">

        {/* Left Side - Background Image Panel */}
        <div className="relative w-1/2 min-h-[600px] hidden md:block">
          <img
            src={backgroundImg}
            alt="Book Fair Background"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Gradient Overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at center, rgba(29,78,216,0.45) 40%, rgba(30,64,175,0.15) 70%, transparent 100%)",
            }}
          ></div>

          {/* Overlay Content */}
          <div className="relative z-10 flex flex-col justify-center h-full p-10 text-white">
            <h2 className="text-4xl font-extrabold leading-tight mb-12 drop-shadow-lg">
              Welcome to the
              <br />
              Book Fair 2026
            </h2>
            <p className="text-base font-bold text-blue-100 max-w-xs leading-relaxed">
              One platform for publishers! <br />Book stalls, manage payments, and secure your presence at CIBF 2026.
            </p>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex items-center justify-center w-full md:w-1/2 p-8">
          <div className="w-full max-w-sm space-y-6">

            {/* HEADER */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-extrabold text-blue-800 tracking-tight">
                Colombo International
                <br />
                <span className="text-blue-600">Book Fair 2026</span>
              </h1>
              <div className="mt-4 w-16 h-1 bg-blue-500 mx-auto rounded-full"></div>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-4">

              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 text-sm text-red-700 bg-red-100 rounded border border-red-200">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                {loading ? "Signing in..." : "Login"}
              </button>
            </form>

            {/* Divider */}
            <div className="relative flex items-center justify-center w-full mt-6 border-t border-gray-200">
              <span className="absolute px-3 bg-white text-gray-500 text-sm">
                OR
              </span>
            </div>

            {/* Signup Link Section */}
            <div className="text-center pt-4">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-medium text-blue-600 hover:text-blue-500 hover:underline"
                >
                  Create a new account
                </Link>
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;