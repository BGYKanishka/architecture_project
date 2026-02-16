import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/Register"; // Import this
import Dashboard from "./pages/Dashboard";
import Footer from "./components/footer";
import EmployeePanel from "./pages/EmployeePanel";


function App() {
  return (
    <Router>

      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

        <div style={{ flex: 1 }}>

          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} /> {/* Add this route */}
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>

        </div>

        <Footer />

      </div>
    </Router>
  );
}

export default App;