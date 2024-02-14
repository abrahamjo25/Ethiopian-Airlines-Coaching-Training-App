import React, { useState } from "react";
import { classNames } from "primereact/utils";
import { InputText } from "primereact/inputtext";
import { BASE_COLOR } from "../services/Settings";
import { Link} from "react-router-dom";
import { GetDataPassword } from "../services/AccessAPI";
import { Message } from "primereact/message";

function ForgotePassword() {
    const [loading, setLoading] = useState(false);
    const [getResponce, setGetResponce] = useState(false);
    const [resetInput, setResetInput] = useState({
        email: "",
        error: "",
    });
    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _result = { ...resetInput };
        _result[`${name}`] = val;

        setResetInput(_result);
    };
    const submitReset = (e) => {
        e.preventDefault();
        setLoading(true);
        GetDataPassword(`/api/v1/Password/ForgotPassword?userName=${resetInput.email}`)
            .then((res) => {
                if (res && res.status === 200) {
                    setGetResponce(true);
                } else {
                    let _result = { ...resetInput };
                    _result[`error`] = "Account Does not Exist!";
                    setResetInput(_result);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };
    return (
        <>
            <div className="col-12 md:col-6 lg:col-3 p-fluid  position-absolute top-50 start-50 translate-middle">
                {getResponce ? (
                    <Message severity="info" text="Message sent check your Outlook" />
                ) : (
                    <div className="card border ">
                        <div className="text-center mb-5">
                            <img src="assets/layout/images/et-logo.png" alt="hyper" height="100" width="250" className="mb-3" />
                            <div className="text-900 text-3xl font-medium mb-3">
                                <h3>Corporate Coaching</h3>
                            </div>
                            <span className="text-600 font-medium line-height-3">Enter your User Id to Reset your Password</span>
                        </div>
                        <br />
                        <div className="text-success text-center">
                            <span className="text-danger">
                                <h6>{resetInput.error}</h6>
                            </span>
                            <div className="grid">
                                <span className="lg:col-1"></span>
                                <div className="lg:col-10">
                                    <div className="field">
                                        <span className="p-input-icon-left">
                                            <i className="pi pi-user" />
                                            <InputText id="email" placeholder=" User Id" value={resetInput.email} onChange={(e) => onInputChange(e, "email")} required autoFocus className={classNames({ "p-invalid": resetInput.email })} />
                                        </span>
                                    </div>
                                    <div className="col-12 d-grid">
                                        <button className="btn text-white" disabled={loading} style={{ backgroundColor: BASE_COLOR }} onClick={submitReset}>
                                            <i className="pi pi-sign-in"></i> {loading ? "Please wait..." : "Submit"}
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

export default ForgotePassword;
