import { createContext, useState, useEffect } from "react";
import AuthService from "../api/authApi";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(undefined);

    useEffect(() => {
        const currentUser = AuthService.getCurrentUser();
        setUser(currentUser);
    }, []);

    const login = async (email, password) => {
        try {
            const data = await AuthService.login(email, password);
            setUser(data);
            return data;
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        AuthService.logout();
        setUser(null);
    };

    const register = async (name, email, password, role, contactNumber, businessName) => {
        return AuthService.register(name, email, password, role, contactNumber, businessName);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};
