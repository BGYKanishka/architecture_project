import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
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
import { useEffect, useState } from "react";

function AppContent() {
  const location = useLocation();
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    setUser(currentUser);
  }, []);

  // Hide global Header & Footer on all employee pages (they have their own)
  const isEmployeePage = location.pathname.startsWith("/employee");
  const hideHeaderRoutes = ["/login", "/register", "/"];
  const showHeader = !hideHeaderRoutes.includes(location.pathname) && !isEmployeePage;
  const showFooter = !isEmployeePage;

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
          <Route path="/dashboard/:hallName" element={<Dashboard />} />
          <Route path="/booking-summary" element={<BookingSummary />} />
          <Route path="/payment-selection" element={<PaymentSelection />} />
          <Route path="/booking-confirmation" element={<BookingConfirmation />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/genres" element={<GenreSelection />} />

          {/* ── Employee routes (protected) ── */}
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