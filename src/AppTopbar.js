import React, { useEffect, useRef, useState } from "react";
import { BASE_COLOR } from "./services/Settings";
import { classNames } from "primereact/utils";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { useHistory } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { postIdentityData } from "./services/AccessAPI";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
const AppTopbar = (props) => {
    let emptyResult = {
        oldPassword: null,
        newPassword: null,
    };
    const [username, setUsername] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(false);
    const [saving, setSaving] = useState(false);
    const [loginInput, setLoginInput] = useState(emptyResult);
    const [passwordDialog, setPasswordDialog] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState(null);
    const toast = useRef(null);
    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _result = { ...loginInput };
        _result[`${name}`] = val;
        setLoginInput(_result);
    };
    const onPasswordConfirm = (e) => {
        const val = (e.target && e.target.value) || "";
        setConfirmPassword(val);
    };
    useEffect(() => {
        let user = JSON.parse(localStorage.getItem("user"));
        if (user) {
            setUsername(user.firstName + " " + user.lastName);
        }
    }, []);
    const changePassword = (e) => {
        setSubmitted(true);
        e.preventDefault();
        if (loginInput.newPassword !== confirmPassword) {
            setError("Password not match!");
        } else if (loginInput.oldPassword && loginInput.newPassword) {
            setSaving(true);
            postIdentityData(`/api/v1/Password/ChangePassword`, loginInput, "Password-ChangePassword")
                .then((res) => {
                    if (!res.isError) {
                        toast.current.show({ severity: "success", summary: "Success", detail: "Password Changed Successfully.", life: 5000 });
                        setTimeout(() => {
                            logout();
                        }, 3000);
                    } else {
                        hidePasswordDialog();
                        toast.current.show({ severity: "error", summary: "Error", detail: "Invalid password", life: 3000 });
                    }
                })
                .catch((error) => {
                    toast.current.show({ severity: "error", summary: "Error", detail: `Invalid password`, life: 5000 });
                    hidePasswordDialog();
                });
        }
    };
    const history = useHistory();
    let topbarItemsClassName = classNames("topbar-menu fadeInDown", { "topbar-menu-visible": props.topbarMenuActive });
    const logout = () => {
        history.push("/user-session-logout");
    };
    const ChangePasswordDialog = () => {
        setStyle("change-password-modal");
        setSubmitted(false);
        setPasswordDialog(true);
    };
    // const ChangePasswordDialog = () => {
    //     debugger;
    //     const currentOrigin = window.location.origin;
    //     const idToken = localStorage.getItem("idToken");
    //     window.location.href = `https://dev-iam.ethiopianairlines.com/reset-password?origin=${encodeURIComponent(currentOrigin)}&idToken=${idToken}`;
    // };
    const hidePasswordDialog = () => {
        setStyle("");
        setPasswordDialog(false);
        setLoginInput(emptyResult);
        setConfirmPassword(null);
        setSaving(false);
    };
    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            changePassword(event);
        }
    };
    const header = (
        <React.Fragment>
            <h5>Change Password</h5>
        </React.Fragment>
    );
    const passwordHeader = <div className="font-bold mb-3">Pick a password</div>;
    const footer = (
        <>
            <Divider />
            <p className="mt-2">Suggestions</p>
            <ul className="pl-2 ml-2 mt-0 line-height-3">
                <li>At least one lowercase</li>
                <li>At least one uppercase</li>
                <li>At least one numeric</li>
                <li>Minimum 8 characters</li>
            </ul>
        </>
    );
    const [style, setStyle] = useState("");
    return (
        <>
            <div className="topbar " style={{ backgroundColor: BASE_COLOR, height: "55px" }}>
                <div className="logo-link">
                    <img className="logo d-block" style={{ marginTop: "0vh", height: "55px", width: "145px" }} alt="Ethiopian" src="assets/layout/images/apollo_logo.png" />
                </div>

                <button type="button" className="p-link menu-button" id="menu-button" onClick={props.onMenuButtonClick}>
                    <i className="pi pi-align-left"></i>
                </button>

                <button type="button" className="p-link profile" onClick={props.onTopbarMenuButtonClick}>
                    <span className="username">{username}</span>
                    <img src="assets/layout/images/avatar/avatar.png" alt="apollo-layout" className="rounded-circle" />
                    <i className="pi pi-angle-down"></i>
                </button>
                <ul className={topbarItemsClassName}>
                    <li className={classNames({ "menuitem-active": props.activeTopbarItem === "profile" })} onClick={ChangePasswordDialog}>
                        <button type="button" className="p-link" style={{ backgroundColor: BASE_COLOR }}>
                            <i className="topbar-icon pi pi-fw pi-lock"></i>
                            <span className="topbar-item-name">Change Password</span>
                        </button>
                    </li>
                    <li className={classNames({ "menuitem-active": props.activeTopbarItem === "profile" })} onClick={logout}>
                        <button type="button" className="p-link" style={{ backgroundColor: BASE_COLOR }}>
                            <i className="topbar-icon pi pi-fw pi-sign-out"></i>
                            <span className="topbar-item-name">Logout</span>
                        </button>
                    </li>
                </ul>
            </div>
            <Toast ref={toast} />
            <div className={style}>
                <Dialog visible={passwordDialog} className="dialog-modal" style={{ width: "450px" }} header={header} onHide={hidePasswordDialog}>
                    <div className="p-fluid mt-2">
                        <label htmlFor="old-password" className="text-500">
                            Enter Old Password *
                        </label>
                        <br />
                        <div className="field">
                            <InputText
                                id="old-password"
                                type="password"
                                placeholder=" Old Password"
                                value={loginInput.oldPassword}
                                onChange={(e) => onInputChange(e, "oldPassword")}
                                onKeyDown={handleKeyDown}
                                required
                                autoFocus
                                className={classNames({ "p-invalid": submitted && !loginInput.oldPassword })}
                            />
                        </div>
                        <label htmlFor="new-password" className="text-500">
                            Enter New Password *
                        </label>
                        <br />
                        <div className="field">
                            <Password
                                placeholder="New Password"
                                value={loginInput.newPassword}
                                onChange={(e) => onInputChange(e, "newPassword")}
                                onKeyDown={handleKeyDown}
                                required
                                className={classNames({ "p-invalid": submitted && !loginInput.newPassword })}
                                header={passwordHeader}
                                footer={footer}
                                autocomplete={loginInput.newPassword}
                            />
                        </div>
                        <label htmlFor="old-password" className="text-500">
                            Confirm Password *
                        </label>
                        <br />
                        <div className="field">
                            <InputText
                                id="confirm-password"
                                type="password"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => onPasswordConfirm(e)}
                                onKeyDown={handleKeyDown}
                                required
                                className={classNames({ "p-invalid": submitted && !confirmPassword })}
                                autoComplete={confirmPassword}
                            />
                        </div>
                        {submitted && loginInput.newPassword !== confirmPassword && <span className="text-danger">Password confirmation not match.</span>}
                        <div className="py-5">{saving ? <Button label="Please Wait.." icon="pi pi-spin pi-spinner" className="float-end" disabled={true} /> : <Button label="Submit" icon="pi pi-arrow-right" className="float-end" onClick={changePassword} />}</div>
                    </div>
                </Dialog>
            </div>
        </>
    );
};

export default AppTopbar;
