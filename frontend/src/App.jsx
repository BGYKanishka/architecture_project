import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/Register"; // Import this
import Dashboard from "./pages/Dashboard";
import Footer from "./components/footer";
import Header from "./components/Header";
import Profile from "./pages/Profile";

function App() {
  return (
    <Router>

      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <div style={{ flex: 1 }}>

          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} /> {/* Add this route */}
            <Route path="/profile" element={<Profile />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>

        </div>

        <Footer />

      </div>
    </Router>
  );
}

export default App;