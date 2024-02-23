import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

const AuthContext = createContext(null);
export const AuthProvider = ({ children }) => {
    // useEffect(() => {
    //     if (isTokenActive()) {
    //         updateTokenExpiration();
    //     } else {
    //         clearAllCookies();
    //         localStorage.clear();
    //     }
    // }, []);
    const isTokenActive = () => {
        const token = Cookies.get("token");
        if (!token) {
            return false;
        }

        const expirationTime = new Date(Cookies.get("token_expiration"));
        const currentTime = new Date();

        return currentTime < expirationTime;
    };
    const clearAllCookies = () => {
        document.cookie.split(";").forEach((cookie) => {
            document.cookie = cookie.replace(/^ +/, "").replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
        });
    };
    const [idToken, setIdToken] = useState(Cookies.get("token"));
    const [accessToken, setAccessToken] = useState(null);
    const setTokenWithExpiry = (token, expiresInSeconds) => {
        setIdToken(token);
        Cookies.set("idToken", token, { expires: expiresInSeconds / (60 * 60 * 24) });
    };

    const updateTokenExpiration = () => {
        const token = Cookies.get("idToken");
        if (token) {
            setIdToken(token);
            Cookies.set("idToken", token, { expires: 1 / 96 });
        }
    };

    return <AuthContext.Provider value={{ accessToken, setAccessToken, idToken, setTokenWithExpiry, updateTokenExpiration }}>{children}</AuthContext.Provider>;
};
export const useAuth = () => {
    return useContext(AuthContext);
};
