import React, { useEffect, useRef, useState } from "react";
import { classNames } from "primereact/utils";
import { Checkbox } from "primereact/checkbox";
import { InputText } from "primereact/inputtext";
import { useHistory } from "react-router-dom";
import { getData } from "../services/AccessAPI";
import { Button } from "primereact/button";

import { axiosLogin, refreashSystemToken } from "../utilities/axios";
import { Toast } from "primereact/toast";
function Login() {
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [loginInput, setLoginInput] = useState({
        username: "",
        password: "",
    });
    const origin = window.location.origin;
    const identityUrl = process.env.REACT_APP_IDENTITY_URL;
    const toast = useRef();
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");
    const [checked, setChecked] = useState(true);
    useEffect(() => {
        const accessToken = localStorage.getItem("access");
        if (accessToken === null || accessToken === "") {
            refreashSystemToken();
        }
        if (JSON.parse(localStorage.getItem("user")) && JSON.parse(localStorage.getItem("user")).idToken) {
            history.push("/");
        }
    }, []);

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _result = { ...loginInput };
        _result[`${name}`] = val;
        setLoginInput(_result);
    };

    const submitLogin = async (e) => {
        setError("");
        setSubmitted(true);

        e.preventDefault();

        if (loginInput.username && loginInput.password) {
            setSubmitted(false);

            setLoading(true);
            const access = localStorage.getItem("access");
            await axiosLogin
                .post("/api/v1/User/Login", loginInput, {
                    headers: {
                        accessToken: access,
                    },
                })
                .then((res) => {
                    if (res) {
                        if (res.status === 200) {
                            localStorage.setItem("user", JSON.stringify(res.data));
                            localStorage.setItem("idToken", res.data.idToken);
                            localStorage.setItem("userRefreshToken", res.data.refreshToken);
                            // checkEmployee(res.data.username);
                            setLoading(false);
                            history.push("/");
                        }
                    } else {
                        setError(res.response.data.errors[0]);
                        setLoading(false);
                    }
                })

                .catch((err) => {
                    console.log(err);
                    setLoading(false);
                    if (err.response) {
                        setError(err.response.data.errors[0]);
                    } else {
                        setError("👇️ check your internet connection please !");
                    }
                });
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            // 👇️
            submitLogin(event);
        }
    };

    return (
        <>
            <Toast ref={toast} />

            <div className="col-12 md:col-6 lg:col-3 p-fluid  position-absolute top-50 start-50 translate-middle">
                <div className="card border ">
                    <div className="text-center mb-5">
                        <img src="assets/layout/images/et-logo.png" alt="hyper" height="100" width="250" className="mb-3" />

                        <div className="text-900 text-3xl font-medium mb-3">
                            <h3 className="text-gradient">Corporate Coaching</h3>
                        </div>

                        <span className="text-600 font-medium line-height-3">Login to your account to start session</span>
                    </div>

                    <br />

                    <div className="text-success text-center">
                        <span className="text-danger">
                            <h6>{error}</h6>
                        </span>

                        <div className="grid">
                            <span className="lg:col-1"></span>

                            <div className="lg:col-10">
                                <div className="field">
                                    <span className="p-input-icon-left">
                                        <i className="pi pi-user" />

                                        <InputText id="username" placeholder=" User Name" value={loginInput.username} onChange={(e) => onInputChange(e, "username")} onKeyDown={handleKeyDown} required autoFocus className={classNames({ "p-invalid": submitted && !loginInput.username })} />
                                    </span>
                                </div>

                                <div className="field">
                                    <span className="p-input-icon-left">
                                        <i className="pi pi-fw pi-lock" />

                                        <InputText id="password" type="password" placeholder=" Password" value={loginInput.password} onChange={(e) => onInputChange(e, "password")} onKeyDown={handleKeyDown} required className={classNames({ "p-invalid": submitted && !loginInput.password })} />
                                    </span>
                                </div>

                                <div className="flex align-items-center justify-content-between mb-6">
                                    <div className="flex align-items-center">
                                        <Checkbox inputId="rememberme1" binary className="mr-2" onChange={(e) => setChecked(e.checked)} checked={checked} />

                                        <label htmlFor="rememberme1">Remember me</label>
                                    </div>

                                    <a className="text-600 cursor-pointer hover:text-primary cursor-pointer ml-auto transition-colors transition-duration-300" href={`${identityUrl}/resetpassword?origin=${encodeURIComponent(origin)}`}>
                                        Forgot password?
                                    </a>
                                </div>

                                <div className="col-12 d-grid">{loading ? <Button label="Please wait..." icon="pi pi-spin pi-spinner" disabled={true} /> : <Button label="Sign in" icon="pi pi-sign-in" onClick={submitLogin} />}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Login;
