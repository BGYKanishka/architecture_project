import { Outlet } from "react-router-dom";
import EmployeeHeader from "../components/common/EmployeeHeader";
import Footer from "../components/common/footer";

export default function EmployeeLayout({ user }) {
    return (
        <>
            <EmployeeHeader user={user} />
            <div style={{ flex: 1 }}>
                <Outlet />
            </div>
            <Footer />
        </>
    );
}
