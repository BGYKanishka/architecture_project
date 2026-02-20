import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, Outlet } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Map from "./pages/Map";
import Footer from "./components/common/footer";
import EmployeePanel from "./pages/EmployeePanel";
import Header from "./components/common/Header";
import MainLayout from "./layouts/MainLayout";
import EmployeeLayout from "./layouts/EmployeeLayout";
import AdminLayout from "./layouts/AdminLayout";
import AuthService from "./services/auth.service";
import Profile from "./pages/Profile";
import Reservations from "./pages/Reservations";
import BookingSummary from "./pages/BookingSummary";
import PaymentSelection from "./pages/PaymentSelection";
import BookingConfirmation from "./pages/BookingConfirmation";
import HelpCenter from "./pages/HelpCenter";
import GenreSelection from "./pages/GenreSelection";
import About from "./pages/About";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import EmployeeFloorPlan from "./pages/EmployeeFloorPlan";
import EmployeeRoute from "./components/routing/EmployeeRoute";
import AdminDutyManagement from "./pages/AdminDutyManagement";
import AdminDashboard from "./pages/AdminDashboard";
import AdminStalls from "./pages/AdminStalls";
import AdminReservations from "./pages/AdminReservations";
import AdminUsers from "./pages/AdminUsers";
import AdminProtectedRoute from "./components/routing/AdminProtectedRoute.jsx";
import EmployeeHeader from "./components/common/EmployeeHeader";
import { useEffect, useState } from "react";

function AppContent() {
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Routes>
        {/* ── Public / Blank Layout routes ── */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ── Main Layout routes (User/Public with Header & Footer) ── */}
        <Route element={<MainLayout user={user} />}>
          <Route path="/about" element={<About />} />
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
          <Route path="/genres" element={<GenreSelection />} />
        </Route>

        {/* ── Admin routes ── */}
        <Route element={<AdminProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/stalls" element={<AdminStalls />} />
            <Route path="/admin/reservations" element={<AdminReservations />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/duties" element={<AdminDutyManagement />} />
          </Route>
        </Route>

        {/* ── Employee routes ── */}
        <Route element={<EmployeeLayout user={user} />}>
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
        </Route>
      </Routes>
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