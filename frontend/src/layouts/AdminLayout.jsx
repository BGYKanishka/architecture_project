import { Outlet } from "react-router-dom";

const AdminLayout = () => {
    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            {/* Admin Sidebar would go here */}
            <div style={{ flex: 1, padding: '20px' }}>
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;
