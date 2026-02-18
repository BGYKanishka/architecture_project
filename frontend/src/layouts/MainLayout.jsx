import { useContext } from "react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { AuthContext } from "../context/AuthContext";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
    const { user } = useContext(AuthContext);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar user={user} />
            <div style={{ flex: 1 }}>
                <Outlet />
            </div>
            <Footer />
        </div>
    );
};

export default MainLayout;
