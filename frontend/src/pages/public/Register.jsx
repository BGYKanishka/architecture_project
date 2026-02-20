import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthService from "../../services/auth.service";
import backgroundImg from "../../assets/background.jpg";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    contactNumber: "",
    businessName: "",
    role: "vendor",
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
      () => {
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
              Join the
              <br />
              Book Fair 2026
            </h2>
            <p className="text-base font-bold text-blue-100 max-w-xs leading-relaxed">
              Register as a publisher or vendor and secure your stall at CIBF 2026.
            </p>
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="flex items-center justify-center w-full md:w-1/2 p-8">
          <div className="w-full max-w-sm space-y-6">

            {/* HEADER */}
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900">
                Registration
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                For Vendors & Publishers
              </p>
              <div className="mt-4 w-16 h-1 bg-blue-500 mx-auto rounded-full"></div>
            </div>

            <form className="mt-6 space-y-4" onSubmit={handleRegister}>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  name="name"
                  type="text"
                  required
                  className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
                  value={formData.name}
                  onChange={onChange}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
                  value={formData.email}
                  onChange={onChange}
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  name="password"
                  type="password"
                  required
                  minLength="6"
                  className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
                  value={formData.password}
                  onChange={onChange}
                />
              </div>

              {/* Contact Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                <input
                  name="contactNumber"
                  type="text"
                  required
                  className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
                  value={formData.contactNumber}
                  onChange={onChange}
                />
              </div>

              {/* Business Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Business / Publisher Name</label>
                <input
                  name="businessName"
                  type="text"
                  required
                  className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
                  value={formData.businessName}
                  onChange={onChange}
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 px-4 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors font-medium"
              >
                Register
              </button>
            </form>

            {/* Message Display */}
            {message && (
              <div className={`text-center text-sm p-2 rounded ${successful ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                {message}
              </div>
            )}

            <div className="text-center">
              <Link to="/login" className="font-medium text-sm text-blue-600 hover:text-blue-500 hover:underline">
                Already have an account? Sign in
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;