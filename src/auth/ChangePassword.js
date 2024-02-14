import React, { useState } from "react";
import { classNames } from "primereact/utils";
import { InputText } from "primereact/inputtext";
import { Link } from "react-router-dom";
import { BASE_COLOR } from "../services/Settings";
import { postIdentityData } from "../services/AccessAPI";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Message } from "primereact/message";

function ChangePassword() {
    const [loading, setLoading] = useState(false);
    const [getResponce, setGetResponce] = useState(false);
    const [loginInput, setLoginInput] = useState({
        token: "",
        userName: "",
        password: "",
        confirmPassword: "",
        error: "",
    });
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const paramValue = searchParams.get("activation_token");
    useEffect(() => {
        let _result = { ...loginInput };
        _result["token"] = paramValue;
        setLoginInput(_result);
    }, []);
    console.log(loginInput.token);
    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _result = { ...loginInput };
        _result[`${name}`] = val;

        setLoginInput(_result);
    };
    const changePassword = (e) => {
        e.preventDefault();
        setLoading(true);
        postIdentityData(`/api/v1/Password/ForgotPassword`, loginInput)
            .then((res) => {
                if (res && res.status === 200) {
                    setGetResponce(true);
                } else {
                    let _result = { ...loginInput };
                    _result[`error`] = "Account Does not Exist!";
                    setLoginInput(_result);
                }
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setLoading(false);
            });
    };
    return (
        <>
            <div className="col-12 md:col-6 lg:col-3 p-fluid  position-absolute top-50 start-50 translate-middle">
                {getResponce ? (
                    <Message severity="info" text="Password changed successfully" />
                ) : (
                    <div className="card border ">
                        <div className="text-center mb-5">
                            <img src="assets/layout/images/et-logo.png" alt="hyper" height="100" width="250" className="mb-3" />
                            <div className="text-900 text-3xl font-medium mb-3">
                                <h3>Corporate Coaching</h3>
                            </div>
                            <span className="text-600 font-medium line-height-3">Confirm your Password to change</span>
                        </div>
                        <br />
                        <div className="text-success text-center">
                            <span className="text-danger">
                                <h6>{loginInput.error}</h6>
                            </span>
                            <div className="grid">
                                <span className="lg:col-1"></span>
                                <div className="lg:col-10">
                                    <div className="field">
                                        <span className="p-input-icon-left">
                                            <i className="pi pi-fw pi-lock" />
                                            <InputText id="old-password" type="text" placeholder=" User Name" value={loginInput.userName} onChange={(e) => onInputChange(e, "userName")} required autoFocus className={classNames({ "p-invalid": loginInput.email })} />
                                        </span>
                                    </div>
                                    <div className="field">
                                        <span className="p-input-icon-left">
                                            <i className="pi pi-fw pi-lock" />
                                            <InputText id="new-password" type="password" placeholder="New Password" value={loginInput.password} onChange={(e) => onInputChange(e, "password")} required className={classNames({ "p-invalid": loginInput.password })} />
                                        </span>
                                    </div>
                                    <div className="field">
                                        <span className="p-input-icon-left">
                                            <i className="pi pi-fw pi-lock" />
                                            <InputText id="confirm-password" type="password" placeholder="Confirm Password" value={loginInput.confirmPassword} onChange={(e) => onInputChange(e, "confirmPassword")} required className={classNames({ "p-invalid": loginInput.password })} />
                                        </span>
                                    </div>
                                    <div className="col-12 d-grid">
                                        <button className="btn text-white" disabled={loading} style={{ backgroundColor: BASE_COLOR }} onClick={changePassword}>
                                            <i className="pi pi-sign-in"></i> Submit
                                        </button>
                                    </div>
                                    <div className="flex align-items-center justify-content-between mb-6">
                                        <Link to="/user-login" className="font-medium no-underline ml-2 text-blue-500 text-right cursor-pointer">
                                            Sign In
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default ChangePassword;
