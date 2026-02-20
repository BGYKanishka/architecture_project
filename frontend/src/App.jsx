import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Map from "./pages/Map";
import Footer from "./components/footer";
import EmployeePanel from "./pages/EmployeePanel";
import Header from "./components/Header";
import AuthService from "./services/auth.service";
import Profile from "./pages/Profile";
import Reservations from "./pages/Reservations";
import BookingSummary from "./pages/BookingSummary";
import PaymentSelection from "./pages/PaymentSelection";
import BookingConfirmation from "./pages/BookingConfirmation";
import HelpCenter from "./pages/HelpCenter";
import GenreSelection from "./pages/GenreSelection";
import EmployeeLogin from "./pages/EmployeeLogin";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import EmployeeFloorPlan from "./pages/EmployeeFloorPlan";
import EmployeeRoute from "./components/EmployeeRoute";
import AdminDutyManagement from "./pages/AdminDutyManagement";
import AdminDashboard from "./pages/AdminDashboard";
import AdminStalls from "./pages/AdminStalls";
import AdminReservations from "./pages/AdminReservations";
import AdminUsers from "./pages/AdminUsers";
import AdminProtectedRoute from "./components/AdminProtectedRoute.jsx";
import { useEffect, useState } from "react";

function AppContent() {
  const location = useLocation();
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const fetchUser = () => {
      const currentUser = AuthService.getCurrentUser();
      setUser(currentUser);
    };

    fetchUser();

    window.addEventListener("user-updated", fetchUser);
    return () => window.removeEventListener("user-updated", fetchUser);
  }, []);

  const isEmployeePage = location.pathname.startsWith("/employee");
  const isAdminPage = location.pathname.startsWith("/admin");
  const hideHeaderRoutes = ["/login", "/register", "/"];

  const showHeader = !hideHeaderRoutes.includes(location.pathname) && !isEmployeePage && !isAdminPage;
  const showFooter = !isEmployeePage && !isAdminPage;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {showHeader && <Header user={user} />}

      <div style={{ flex: 1 }}>
        <Routes>
          {/* ── Public / Vendor routes ── */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/reservations" element={<Reservations />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/map" element={<Map />} />
          <Route path="/map/:hallName" element={<Map />} />
          <Route path="/booking-summary" element={<BookingSummary />} />
          <Route path="/payment-selection" element={<PaymentSelection />} />
          <Route path="/booking-confirmation" element={<BookingConfirmation />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/employee" element={<EmployeePanel />} />

          {/* ── Admin routes (from main) ── */}
          <Route element={<AdminProtectedRoute />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/stalls" element={<AdminStalls />} />
            <Route path="/admin/reservations" element={<AdminReservations />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/duties" element={<AdminDutyManagement />} />
          </Route>

          <Route path="/genres" element={<GenreSelection />} />

          {/* ── Employee routes (from bandara) ── */}
          <Route path="/employee/login" element={<EmployeeLogin />} />

          <Route
            path="/employee/floor-plan"
            element={
              <EmployeeRoute>
                <EmployeeFloorPlan />
              </EmployeeRoute>
            }
          />
          <Route
            path="/employee/floor-plan/:hallName"
            element={
              <EmployeeRoute>
                <EmployeeDashboard />
              </EmployeeRoute>
            }
          />

          {/* Legacy /employee/dashboard → redirect to floor plan */}
          <Route
            path="/employee/dashboard"
            element={<Navigate to="/employee/floor-plan" replace />}
          />
        </Routes>
      </div>

      {showFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;