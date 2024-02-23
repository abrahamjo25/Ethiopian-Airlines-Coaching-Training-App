import axios from "axios";
import { axiosInstance, axiosLogin } from "../utilities/axios";
import { createBrowserHistory } from "history";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Get request
export const getData = async (url, claim) => {
    return await axiosInstance
        .get(url, {
            headers: {
                accessToken: localStorage.getItem("access"),
                idToken: localStorage.getItem("idToken"),
                clientClaim: claim,
            },
        })
        .then((response) => {
            return response;
        })
        .catch((error) => {
            if (error.response?.status === 401) {
                toast.error(`Access Denied`);
            } else if (error.response) {
                // toast.error(`Error: ${error?.response?.data?.errors[0]}`);
            } else if (error.request) {
                toast.error("Error: No response received from the server");
            } else {
                toast.error("Error: " + error.message);
            }
        });
};
// Post request
export const postData = async (url, data, claim) => {
    return await axiosInstance
        .post(url, data, {
            headers: {
                accessToken: localStorage.getItem("access"),
                idToken: localStorage.getItem("idToken"),
                clientClaim: claim,
            },
        })
        .then((response) => {
            toast.success("Created successfully");
            return response?.data;
        })
        .catch((error) => {
            if (error.response?.status === 401) {
                toast.error(`Access Denied`);
            } else if (error.response) {
                toast.error(`Error: ${error?.response?.data?.errors[0]}`);
            } else if (error.request) {
                toast.error("Error: No response received from the server");
            } else {
                toast.error("Error: " + error.message);
            }
        });
};

// Put request
export const putData = async (url, data, claim) => {
    return await axiosInstance
        .put(url, data, {
            headers: {
                accessToken: localStorage.getItem("access"),
                idToken: localStorage.getItem("idToken"),
                clientClaim: claim,
            },
        })
        .then((response) => {
            toast.success("Updated successfully");
            return response?.data;
        })
        .catch((error) => {
            if (error.response?.status === 401) {
                toast.error(`Access Denied`);
            } else if (error.response) {
                toast.error(`Error: ${error?.response?.data?.errors[0]}`);
            } else if (error.request) {
                toast.error("Error: No response received from the server");
            } else {
                toast.error("Error: " + error.message);
            }
            return false;
        });
};

// Delete request
export const deleteData = async (url, claim) => {
    return await axiosInstance
        .delete(url, {
            headers: {
                accessToken: localStorage.getItem("access"),
                idToken: localStorage.getItem("idToken"),
                clientClaim: claim,
            },
        })
        .then((response) => {
            toast.success("Deleted successfully");
            return response?.data;
        })
        .catch((error) => {
            if (error.response?.status === 401) {
                toast.error(`Access Denied`);
            } else if (error.response) {
                toast.error(`Error: ${error?.response?.data?.errors[0]}`);
            } else if (error.request) {
                toast.error("Error: No response received from the server");
            } else {
                toast.error("Error: " + error.message);
            }
        });
};
export const userLogin = async (path, data) => {
    const accessToken = localStorage.getItem("access");
    let url = `https://localhost:7204${path}`;
    try {
        return await axios.post(`https://localhost:7204${path}`, data, {
            headers: {
                accessToken: accessToken,
            },
        });
    } catch (err) {
        return err;
    }
};
export const forgotPassword = async (path, data, claim) => {
    try {
        return await axiosLogin.post(
            path + "",
            data,

            {
                headers: {
                    clientClaim: claim,
                    accessToken: localStorage.getItem("access"),
                    idToken: localStorage.getItem("idToken"),
                },
            }
        );
    } catch (err) {
        console.log(err);
    }
};
export const GetDataPassword = async (path, data, accessToken) => {
    try {
        return await axiosLogin.get(path, data, {
            headers: {
                accessToken: localStorage.getItem("access"),
            },
        });
    } catch (err) {
        console.log(err);
    }
};
export const postIdentityData = async (path, data, claim) => {
    try {
        return await axiosLogin.post(path + "", data, {
            headers: {
                clientClaim: claim,
                accessToken: localStorage.getItem("access"),
                idToken: localStorage.getItem("idToken"),
            },
        });
    } catch (err) {
        if (err.response) {
            const { status } = err.response;
            if (status === 500) {
                createBrowserHistory().push("/Network-Error");
                window.location.reload();
            }
            return Promise.reject(err);
        } else if (err.request) {
            console.log("Error", err.request);
        } else {
            console.log("Error", err);
        }
    }
};
