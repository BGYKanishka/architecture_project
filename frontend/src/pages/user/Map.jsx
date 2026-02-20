import { useNavigate } from "react-router-dom";
import AuthService from "../../services/auth.service";
import StallMap from "../../components/StallMap";
import { useEffect, useState } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

const Map = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(AuthService.getCurrentUser());

    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [user, navigate]);

    if (!user) return (
        <div className="flex h-screen w-screen items-center justify-center bg-slate-50">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50">
            <main className="py-6 sm:py-10 px-4 sm:px-8">
                <div className="max-w-[1600px] mx-auto">
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="px-8 py-3 bg-blue-600 text-white rounded-3xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
                    >
                        Back to Dashboard
                    </button>

                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                        <StallMap />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Map;
