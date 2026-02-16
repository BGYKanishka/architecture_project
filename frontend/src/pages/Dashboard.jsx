
import { useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";
import StallMap from "../components/StallMap";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(AuthService.getCurrentUser());

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleLogout = () => {
    AuthService.logout();
    navigate("/login");
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">Colombo Book Fair</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-700">Hello, <b>{user.name}</b></span>
          <button onClick={handleLogout} className="text-red-500 hover:text-red-700 font-medium">Logout</button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Vendor Dashboard</h2>
          <StallMap />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;