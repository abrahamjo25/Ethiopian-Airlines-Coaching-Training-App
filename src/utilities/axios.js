import axios from "axios";
import { useEffect } from "react";

// const baseURL = "https://localhost:7105/api/v1";
const baseURL = process.env.REACT_APP_BASE_URL;
const authURL = process.env.REACT_APP_AUTH_URL;
const clientCredential = {
    clientId: process.env.REACT_APP_CLIENT_ID,
    clientSecret: process.env.REACT_APP_CLIENT_SECRET,
};
export const SystemToken = () => {
    useEffect(() => {
        clientLogin();
    }, []);
    const clientLogin = () => {
        let accessToken = localStorage.getItem("access");
        if (accessToken === null || accessToken === "") {
            axios
                .post(`${authURL}/api/v1/Client/Login`, clientCredential)
                .then((res) => {
                    if (res) {
                        localStorage.setItem("access", res.data.accessToken);
                        localStorage.setItem("refresh", res.data.refreshToken);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    };
};

export const refreashSystemToken = () => {
    axios
        .post(`${authURL}/api/v1/Client/login`, clientCredential)
        .then(function (response) {
            localStorage.setItem("access", response.data.accessToken);
            localStorage.setItem("refresh", response.data.refreshToken);
        })
        .catch(function (error) {
            logoutUser();
        });
};
export const refreshToken = () => {
    const refreshUserToken = localStorage.getItem("refreshUserToken");
    if (refreshUserToken === false) {
        return;
    }
    localStorage.setItem("refreshUserToken", false);
    axios.post(`${authURL}/api/v1/User/RefreshToken`, { token: localStorage.getItem("userRefreshToken") }, { headers: { accessToken: localStorage.getItem("access") } }).then((response) => {
        localStorage.setItem("userRefreshToken", response.data.payload.refreshToken);
        localStorage.setItem("idToken", response.data.payload.idToken);
        window.location.reload();
    });
};
const logoutUser = () => {
    localStorage.clear();
};

export const axiosInstance = axios.create({
    baseURL: baseURL,
    headers: {
        "Access-Control-Allow-Credentials": true,
        "Access-control-Allow-Origin": "*",
        serviceKey: "",
    },
});
export const axiosLogin = axios.create({
    baseURL: authURL,
    headers: {
        "Access-Control-Allow-Credentials": true,
        "Access-control-Allow-Origin": "*",
        serviceKey: "",
        clientClaim: "User-Login",
    },
});
export const changePassword = axios.create({
    baseURL: authURL,
    headers: {
        "Access-Control-Allow-Credentials": true,
        "Access-control-Allow-Origin": "*",
    },
});

axiosLogin.interceptors.response.use(
    (response) =>
        new Promise((resolve, reject) => {
            resolve(response);
        }),
    (error) => {
        if (!error.response) {
            return new Promise((resolve, reject) => {
                reject(error);
            });
        }

        if (error.response.data.message === null) {
            logoutUser();
        }

        if (error.response.data.message === "101") {
            refreashSystemToken();
        } else if (error.response.data.message === "103") {
            refreshToken();
        } else if (error.response.data.message === "102" || error.response.data.message === "104") {
            // window.location.hash = "#/access"
        }
        return new Promise((resolve, reject) => {
            reject(error);
        });
    }
);
