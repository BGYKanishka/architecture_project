import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "./components/common/ProtectedRoute";
import { ROLES } from "./utils/constants";

// Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import StallSelection from "./pages/vendor/StallSelection"; // Was Dashboard.jsx (Map/Booking)
import Dashboard from "./pages/vendor/Dashboard"; // Was Reservations.jsx (My Reservations)
import Profile from "./pages/vendor/Profile";
import BookingSummary from "./pages/vendor/BookingSummary";
import BookingConfirmation from "./pages/vendor/BookingConfirmation";
import PaymentSelection from "./pages/vendor/PaymentSelection";
import HelpCenter from "./pages/vendor/HelpCenter";
import GenreSelection from "./pages/vendor/GenreSelection";
import AdminDashboard from "./pages/employee/AdminDashboard";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Vendor Routes (Protected) */}
          <Route element={<MainLayout />}>
            <Route element={<ProtectedRoute allowedRoles={[ROLES.VENDOR, ROLES.EMPLOYEE, ROLES.ADMIN]} />}>
              <Route path="/dashboard" element={<StallSelection />} />
              <Route path="/dashboard/:hallName" element={<StallSelection />} />
              <Route path="/reservations" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/booking-summary" element={<BookingSummary />} />
              <Route path="/payment-selection" element={<PaymentSelection />} />
              <Route path="/booking-confirmation" element={<BookingConfirmation />} />
              <Route path="/help" element={<HelpCenter />} />
              <Route path="/genres" element={<GenreSelection />} />
            </Route>
          </Route>

          {/* Employee Routes (Protected) */}
          <Route element={<AdminLayout />}>
            <Route element={<ProtectedRoute allowedRoles={[ROLES.EMPLOYEE, ROLES.ADMIN]} />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;