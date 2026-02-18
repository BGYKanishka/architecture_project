import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom"; // Added Link
import { AuthContext } from "../../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Added loading state for better UX
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      // Extract specific message if available
      const resMessage =
        (err.response && err.response.data && err.response.data.message) ||
        "Login failed. Invalid credentials.";
      setError(resMessage);
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">

        {/*  HEADER */}
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
              type="email" // Changed to email type for browser validation
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
  );
};

export default Login;