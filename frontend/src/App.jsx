import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/public/Landing";
import Login from "./pages/public/login";
import Register from "./pages/public/Register";
import Dashboard from "./pages/user/Dashboard";
import Map from "./pages/user/Map";
import MainLayout from "./layouts/MainLayout";
import EmployeeLayout from "./layouts/EmployeeLayout";
import AdminLayout from "./layouts/AdminLayout";
import AuthService from "./services/auth.service";
import Profile from "./pages/user/Profile";
import Reservations from "./pages/user/Reservations";
import BookingSummary from "./pages/user/BookingSummary";
import PaymentSelection from "./pages/user/PaymentSelection";
import BookingConfirmation from "./pages/user/BookingConfirmation";
import HelpCenter from "./pages/public/HelpCenter";
import GenreSelection from "./pages/user/GenreSelection";
import About from "./pages/public/About";
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import EmployeeFloorPlan from "./pages/employee/EmployeeFloorPlan";
import EmployeeRoute from "./components/routing/EmployeeRoute";
import AdminDutyManagement from "./pages/admin/AdminDutyManagement";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminStalls from "./pages/admin/AdminStalls";
import AdminReservations from "./pages/admin/AdminReservations";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminProtectedRoute from "./components/routing/AdminProtectedRoute.jsx";
import CognitoCallback from "./pages/public/CognitoCallback.jsx";
import { useEffect, useState } from "react";

function AppContent() {
  const [user, setUser] = useState(() => AuthService.getCurrentUser());
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const fetchUser = () => {
      const currentUser = AuthService.getCurrentUser();
      setUser(currentUser);
    };

    window.addEventListener("user-updated", fetchUser);
    AuthService.fetchCurrentUser()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setAuthLoading(false));
    return () => {
      window.removeEventListener("user-updated", fetchUser);
    };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Routes>
        {/* ── Public / Blank Layout routes ── */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auth/callback" element={<CognitoCallback />} />

        {/* ── Main Layout routes (User/Public with Header & Footer) ── */}
        <Route element={<MainLayout user={user} />}>
          <Route path="/" element={<Landing />} />
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
          <Route path="/genres" element={<GenreSelection />} />
        </Route>

        <Route path="/employee" element={<Navigate to="/employee/floor-plan" replace />} />

        {/* ── Admin routes ── */}
        <Route element={<AdminProtectedRoute user={user} authLoading={authLoading} />}>
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
                <EmployeeRoute user={user} authLoading={authLoading}>
                <EmployeeFloorPlan />
              </EmployeeRoute>
            }
          />
          <Route
            path="/employee/floor-plan/:hallName"
            element={
                <EmployeeRoute user={user} authLoading={authLoading}>
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
