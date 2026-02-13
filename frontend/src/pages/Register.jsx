import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthService from "../services/auth.service";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    contactNumber: "",
    businessName: "",
    role: "vendor", // HARDCODED: Everyone registering here is a Vendor
  });

  const [message, setMessage] = useState("");
  const [successful, setSuccessful] = useState(false);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setMessage("");
    setSuccessful(false);

    AuthService.register(
      formData.name,
      formData.email,
      formData.password,
      formData.role, 
      formData.contactNumber,
      formData.businessName
    ).then(
      (response) => {
        setMessage("Registration successful! Please login.");
        setSuccessful(true);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      },
      (error) => {
        const resMessage =
          (error.response && error.response.data && error.response.data.message) ||
          error.message ||
          error.toString();

        setMessage(resMessage);
        setSuccessful(false);
      }
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Registration
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            For Vendors & Publishers
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          <div className="rounded-md shadow-sm -space-y-px">
            
            {/* Full Name */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  name="name"
                  type="text"
                  required
                  className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.name}
                  onChange={onChange}
                />
            </div>

            {/* Email */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <input
                  name="email"
                  type="email"
                  required
                  className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.email}
                  onChange={onChange}
                />
            </div>

            {/* Password */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  name="password"
                  type="password"
                  required
                  minLength="6"
                  className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.password}
                  onChange={onChange}
                />
            </div>

            {/* Contact Number */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                <input
                  name="contactNumber"
                  type="text"
                  required
                  className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.contactNumber}
                  onChange={onChange}
                />
            </div>

            {/* Business Name (Always Visible Now) */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Business / Publisher Name</label>
                <input
                  name="businessName"
                  type="text"
                  required
                  className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.businessName}
                  onChange={onChange}
                />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Register
            </button>
          </div>
        </form>

        {/* Message Display */}
        {message && (
          <div className={`mt-2 text-center text-sm p-2 rounded ${successful ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {message}
          </div>
        )}

        <div className="text-center">
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;