import { Outlet } from "react-router-dom";
import Footer from "../components/common/footer";

export default function AdminLayout() {
    return (
        <>
            <div style={{ flex: 1 }}>
                <Outlet />
            </div>
            <Footer />
        </>
    );
}
