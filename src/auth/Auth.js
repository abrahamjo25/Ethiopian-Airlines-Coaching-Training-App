import React, { createContext, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

const AuthContext = createContext(null);
export const AuthProvider = ({ children }) => {
    const [lastVisit, setLastVisit] = useState(localStorage.getItem("lastVisit"));
    const history = useHistory();
    useEffect(() => {
        if (lastVisit) {
            const lastVisitTime = new Date(lastVisit).getTime();
            const currentTime = new Date().getTime();
            const timeDifferenceMinutes = (currentTime - lastVisitTime) / (1000 * 60);

            if (timeDifferenceMinutes >= 30) {
                // Reset local storage data or perform your desired action
                localStorage.clear();
                history.push("/user-login");
                console.log("Local storage data reset!");
            }
        }

        // Update last visit time in local storage
        const newLastVisit = new Date().toISOString();
        localStorage.setItem("lastVisit", newLastVisit);
        setLastVisit(newLastVisit);

        // Set up interval for periodic checks (optional)
        const interval = setInterval(() => {
            // Implement the same logic here
        }, 60000); // 1 minute interval (adjust as needed)

        // Cleanup interval on component unmount (optional)
        return () => clearInterval(interval);
    }, [lastVisit]);

    return <AuthContext.Provider value={{ lastVisit }}>{children}</AuthContext.Provider>;
};
export const useAuth = () => {
    return useContext(AuthContext);
};
