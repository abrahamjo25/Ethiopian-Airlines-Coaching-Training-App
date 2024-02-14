import React, { createContext, useContext } from "react";
// import { useLocation } from "react-router-dom";
// import { NotFound } from "./NotFound";

const AuthContext = createContext(null);
export const AuthProvider = ({ children }) => {
    // const location = useLocation();
    // const url = location.pathname;
    // const claim = url.split("/").pop();
    // const claims = [];
    const user = "someUser"
    // Uncommect this section to Role Base Access and comment full access
    // if (HasRoles(claim)) {
    //     return <AuthContext.Provider>{children}</AuthContext.Provider>;
    // } else {
    //     return <Unauthorized />;
    // }

    //full access
    return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};
export const useAuth = () => {
    return useContext(AuthContext);
};
