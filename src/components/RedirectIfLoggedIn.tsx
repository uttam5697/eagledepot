// RedirectIfLoggedIn.js
import { Navigate } from "react-router-dom";

export const isAuthenticated = () => {
    return !!localStorage.getItem("authKey"); // Example token check
};

export default function RedirectIfLoggedIn({ children }: { children: React.ReactNode }) {
    if (isAuthenticated()) {
        return <Navigate to="/" replace />; // Home page
    }
    return children;
}
