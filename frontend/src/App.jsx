import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
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
import { useEffect, useState } from "react";

function AppContent() {
  const location = useLocation();
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    setUser(currentUser);
  }, []);

  const hideHeaderRoutes = ["/login", "/register", "/"];
  const showHeader = !hideHeaderRoutes.includes(location.pathname);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {showHeader && <Header user={user} />}

      <div style={{ flex: 1 }}>
        <Routes>
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
        </Routes>
      </div>

      <Footer />
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