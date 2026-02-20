import { Outlet } from "react-router-dom";
import Header from "../components/common/Header";
import Footer from "../components/common/footer";

export default function MainLayout({ user }) {
    return (
        <>
            <Header user={user} />
            <div style={{ flex: 1 }}>
                <Outlet />
            </div>
            <Footer />
        </>
    );
}
