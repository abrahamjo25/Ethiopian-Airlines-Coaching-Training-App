import React, { useState, useEffect, useRef } from "react";
import { BASE_COLOR, SECONDARY_COLOR } from "../../../services/Settings";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { getData, deleteData, postData, putData } from "../../../services/AccessAPI";
import { read, utils } from "xlsx";
import axios from "axios";
import fileDownload from "js-file-download";
import url from "../../../utilities/files/employees.csv";
import { SplitButton } from "primereact/splitbutton";
import { Checkbox } from "primereact/checkbox";
import "../../../assets/css/DataTableDemo.css";

const Employee = () => {
    let emptyResult = {
        employeeId: null,
        firstName: "",
        middleName: "",
        lastName: "",
        gender: "",
        email: "",
        fsupervisor: null,
        ssupervisor: null,
        tsupervisor: null,
        mgmtStatus: "",
        empgroup: "",
        isAssessor: false,
        iscoach: false,
        costCenterCode: "",
    };
    const [loading, setLoading] = useState(true);
    const [results, setResults] = useState(null);
    const [resultDialog, setResultDialog] = useState(false);
    const [deleteResultDialog, setDeleteResultDialog] = useState(false);
    const [uploadDialog, setUploadDialog] = useState(false);
    const [result, setResult] = useState(emptyResult);
    const [submitted, setSubmitted] = useState(false);
    const [waiting, setWaiting] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const toast = useRef(null);
    const dt = useRef(null);
    const [costcenters, setCostcenters] = useState(null);
    const [uploads, setUploads] = useState(null);
    const [uploadStatus, setUplodStatus] = useState(false);
    const [emailValidation, setEmailValidation] = useState("");
    const [isVerified, setIsVerified] = useState(false);
    const [captcha, setCaptcha] = useState("");
    const [captchaResult, setCaptchaResult] = useState("");
    const [globalFilter, setGlobalFilter] = useState("");
    const [changeStatusDialog, showChangeStatusDialog] = useState(false);
    const hiddenFileInput = React.useRef(null);
    let gender = [
        { label: "Male", val: "Male" },
        { label: "Female", val: "Female" },
    ];
    let mangementStatus = [
        { label: "Management", value: 1 },
        { label: "Non-Management", value: 2 },
    ];
    let employeeType = [
        { label: "EA(Permanent)", value: 'P' },
        { label: "EA(Contract)", value: 'C' },
        { label: "Retiree", value: 'R' },
        { label: "Board", value: 'B' },
    ];
    useEffect(() => {
        fetchEmployee();
    }, []);
    const fetchEmployee = async () => {
        setLoading(true);
        await getData(`/Employees/GetByCostCenter`, "Employee-Index")
            .then((res) => {
                if (res) {
                    setResults(res.data);
                }
            })
            .catch((error) => {
                if (error.name === "AbortError") {
                    console.log("Request Cancled!");
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };
    const getAllCostcenters = () => {
        setLoading(true);
        getData(`/CostCenter/GetAll`, "Employee-Index")
            .then((res) => {
                if (res) {
                    setCostcenters(res.data);
                }
            })
            .catch((error) => {
                if (error.name === "AbortError") {
                    console.log("Request Cancled!");
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };
    const isValidEmail = (email) => {
        let testEmail = /\S+@\S+\.\S+/.test(email);
        if (!testEmail) {
            setSubmitted(false);
            setEmailValidation("Invalid Email formate.");
        } else {
            setEmailValidation("");
        }
    };

    // Mass Uploading
    const handleClick = (event) => {
        hiddenFileInput.current.click();
    };
    const handleImport = ($event) => {
        const files = $event.target.files;
        if (files.length) {
            const file = files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                const wb = read(event.target.result);
                const sheets = wb.SheetNames;
                if (sheets.length) {
                    const rows = utils.sheet_to_json(wb.Sheets[sheets[0]]);
                    if (rows.length) {
                        setUploads(rows);
                        setUplodStatus(true);
                    }
                }
            };
            reader.readAsArrayBuffer(file);
        }
    };

    // Mass Employees upload
    const uploadFile = async () => {
        debugger;
        try {
            setWaiting(true);
            let data = await postData(`/Employees/CreateList`, uploads, "Employee-Index");
            if (data) {
                setResults((prev) => [...prev, ...data]);
            }
            setWaiting(false);
            setUplodStatus(false);
            setUploadDialog(false);
            hideUploadDialog();
        } catch (err) {
            console.log(err);
        }
    };
    const handleDownload = (url) => {
        axios
            .get(url, {
                responseType: "blob",
            })
            .then((res) => {
                fileDownload(res.data, "Employees_Sample.csv");
            });
    };
    const openUpload = () => {
        setResult(emptyResult);
        setSubmitted(false);
        setUploadDialog(true);
        getCaptcha();
    };
    const getCaptcha = () => {
        let captcha = "";
        let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < 6; i++) {
            captcha += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setCaptcha(captcha);
    };
    const handleCaptcha = (e) => {
        const val = (e.target && e.target.value) || "";
        setCaptchaResult(val);
        if (captcha === val) {
            setIsVerified(true);
        } else {
            setIsVerified(false);
        }
    };
    const hideUploadDialog = () => {
        setUploadDialog(false);
        getCaptcha();
        setIsVerified(false);
        setCaptchaResult("");
    };

    // Add new Employees

    const openNew = () => {
        getAllCostcenters();
        setSubmitted(false);
        setResultDialog(true);
        setIsEdit(false);
    };
    const hideDialog = () => {
        setSubmitted(false);
        setResultDialog(false);
        setIsEdit(false);
        setResult(emptyResult);
    };

    const hideDeleteResultDialog = () => {
        setDeleteResultDialog(false);
    };
    const saveResult = async () => {
        setSubmitted(true);
        if (result?.employeeId && result?.firstName && result?.lastName && result?.middleName && result?.email && result?.costCenterCode && result?.gender && result?.fsupervisor && result?.ssupervisor && result?.tsupervisor && result?.mgmtStatus && result?.empgroup) {
            let _result = { ...result };
            if (isEdit) {
                setWaiting(true);
                setSubmitted(false);
                setWaiting(true);
                let data = await putData(`/Employees/Update`, _result, "Employees-Index");
                if (data) {
                    setResults((prev) =>
                        prev.map((item) => {
                            if (item.id === data?.id) {
                                return data;
                            }
                            return item;
                        })
                    );
                    setResultDialog(false);
                    setResult(emptyResult);
                }
                setWaiting(false);
            } else {
                setSubmitted(false);
                setWaiting(true);
                let data = await postData(`/Employees/Create`, _result, "Employees-Index");
                if (data) {
                    setResults((prev) => [...prev, data]);
                    setResultDialog(false);
                    setResult(emptyResult);
                }
                setWaiting(false);
            }
        }
    };

    const editresult = (result) => {
        setIsEdit(true);
        let _result = { ...result };
        if (_result?.mgmtStatus === "Management") {
            _result["mgmtStatus"] = 1;
        } else {
            _result["mgmtStatus"] = 2;
        }
        setResult(_result);

        setResultDialog(true);
    };

    const deleteResult = async () => {
        setWaiting(true);
        let data = await deleteData(`/Employees/Delete?EmployeeId=${result?.employeeId}`, "Employees-Index");
        if (data) {
            setResults(results.filter((item) => item.id !== data?.id));
            setDeleteResultDialog(false);
            setResult(emptyResult);
        }
        setWaiting(false);
    };
    const changeStatus = async () => {
        let _result = {
            employeeId: result?.employeeId,
            recordStatus: result?.recordStatus === "Active" ? 1 : 2,
        };
        setWaiting(true);
        let data = await putData(`/Employees/UpdateStatus`, _result, "Employees-Index");
        if (data) {
            setResults((prev) =>
                prev.map((item) => {
                    if (item.id === data?.id) {
                        return data;
                    }
                    return item;
                })
            );
            showChangeStatusDialog(false);
            setResult(emptyResult);
        }
        setWaiting(false);
    };
    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        if (name === "email") {
            isValidEmail(val);
        }
        let _result = { ...result };
        _result[`${name}`] = val;
        setResult(_result);
    };
    const onGenderChange = (e, name) => {
        const data = (e.target && e.target.value) || "";
        let _result = { ...result };
        _result[`${name}`] = data?.val;
        setResult(_result);
    };
    const onManagementChange = (e, name) => {
        const data = (e.target && e.target.value) || "";
        let _result = { ...result };
        _result[`${name}`] = data;
        setResult(_result);
    };
    const onDropdownChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _result = { ...result };
        _result[`${name}`] = val?.costCenterCode;
        setResult(_result);
    };
    const onCheckboxChange = (e, name) => {
        let _result = { ...result };
        _result[`${name}`] = e.checked;
        setResult(_result);
    };
    const onAutoComplateChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _result = { ...result };
        _result[`${name}`] = val;
        setResult(_result);
    };
    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Create New" disabled={loading} icon="pi pi-plus" style={{ backgroundColor: BASE_COLOR }} onClick={openNew} />
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button icon="pi pi-upload" className="mr-2 inline-block" label="Import" onClick={openUpload} style={{ backgroundColor: SECONDARY_COLOR, color: "#FFFFF" }} />
                <Button label="Export CSV" icon="pi pi-download" style={{ backgroundColor: BASE_COLOR }} className="p-button-help" onClick={exportCSV} />
            </React.Fragment>
        );
    };
    const confirmDeleteResult = (result) => {
        setResult(result);
        setDeleteResultDialog(true);
    };
    const pages = (data) => [
        {
            label: "View",
            icon: "pi pi-eye",
            command: (e) => {
                editresult(data);
            },
        },
        {
            label: data?.recordStatus === "Active" ? "Inactivate" : "Activate",
            icon: data?.recordStatus === "Active" ? "pi pi-unlock" : "pi pi-lock",
            command: () => {
                showChangeStatusDialog(data);
                setResult(data);
            },
        },

        {
            label: "Delete",
            icon: "pi pi-trash",
            command: (e) => {
                confirmDeleteResult(data);
            },
        },
    ];
    const actionBodyTemplate = (data) => {
        return <SplitButton label="Manage" className="p-button-raised p-button-success p-button-text mr-2 mb-2" model={pages(data)} onClick={(e) => pages(data)}></SplitButton>;
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            getData(`/Employees/GetByEmployeeId?employeeId=${globalFilter}`, "Employee-Index")
                .then((res) => {
                    if (res) {
                        setResults([res.data]);
                        setGlobalFilter(null);
                    }
                })
                .catch((error) => {
                    if (error.name === "AbortError") {
                        console.log("Request Cancled!");
                    }
                });
        }
    };
    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h4 className="m-0">Employees</h4>
            <div>
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} onKeyDown={handleKeyDown} placeholder="Employee Id" />
                </span>
            </div>
        </div>
    );
    const resultDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text btn-success" onClick={hideDialog} />
            {waiting ? <Button label="Saving" icon="pi pi-spin pi-spinner" style={{ backgroundColor: BASE_COLOR }} disabled={true} /> : <Button label={isEdit ? "Update" : "Save"} icon="pi pi-save" style={{ backgroundColor: BASE_COLOR }} className="btn-danger" onClick={saveResult} />}
        </>
    );
    const deleteResultDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteResultDialog} />
            {waiting ? <Button label="Deleting" icon="pi pi-spin pi-spinner" style={{ backgroundColor: BASE_COLOR }} disabled={true} /> : <Button label="Yes" icon="pi pi-check" style={{ backgroundColor: BASE_COLOR }} className="" onClick={deleteResult} />}
        </>
    );
    const uploadDialogFooter = (
        <>
            <Button label="Cancle" icon="pi pi-times" className="p-button-text" onClick={hideUploadDialog} />
            {waiting ? <Button label="Saving" icon="pi pi-spin pi-spinner" style={{ backgroundColor: BASE_COLOR }} disabled={true} /> : <Button label="Save" icon="pi pi-check" disabled={!uploadStatus} style={{ backgroundColor: BASE_COLOR }} className="" onClick={uploadFile} />}
        </>
    );
    const changeStatusRoleDialogFooter = (
        <>
            <Button label="Cancle" icon="pi pi-times" className="p-button-text" onClick={() => showChangeStatusDialog(false)} />
            {waiting ? <Button label="Saving" icon="pi pi-spin pi-spinner" style={{ backgroundColor: BASE_COLOR }} disabled={true} /> : <Button label="Yes" icon="pi pi-check" style={{ backgroundColor: BASE_COLOR }} className="" onClick={changeStatus} />}
        </>
    );
    const statusBody = (rowData) => {
        return <span className={"record-status-" + rowData?.recordStatus}>{rowData?.recordStatus}</span>;
    };
    return (
        <>
            <div className="datatable-responsive-demo grid crud-demo">
                <div className="col-12">
                    <div className="card">
                        <Toast ref={toast} />
                        <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
                        <>
                            <DataTable
                                ref={dt}
                                value={results}
                                dataKey="id"
                                paginator
                                loading={loading}
                                rows={8}
                                rowsPerPageOptions={[8, 15, 25]}
                                className="p-datatable-responsive-demo"
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} results"
                                emptyMessage="No results found."
                                globalFilter={globalFilter}
                                header={header}
                            >
                                <Column field="employeeId" header="Employee Id" filter sortable className="p-column-title"></Column>
                                <Column field="fullName" header="Name" className="p-column-title"></Column>
                                <Column field="email" header="Email" className="p-column-title"></Column>
                                <Column field="costCenterCode" header="Cost center" filter className="p-column-title"></Column>
                                <Column field="mgmtStatus" header="Management Status" className="p-column-title"></Column>
                                <Column field="recordStatus" header="Status" body={statusBody} className="p-column-title"></Column>
                                <Column body={actionBodyTemplate}></Column>
                            </DataTable>
                            <Dialog visible={resultDialog} style={{ width: "1200px" }} header="" modal className="p-fluid" footer={resultDialogFooter} onHide={hideDialog}>
                                <div className="card p-fluid" style={{ borderColor: BASE_COLOR }}>
                                    <h2 className="text-center">Employees {isEdit ? "Edit" : "Create"}</h2>
                                    <br />
                                    <div className="formgrid grid">
                                        <div className="field col">
                                            <label htmlFor="employeeId">EmployeeId</label>
                                            <InputText id="employeeId" type="number" value={result.employeeId || ""} onChange={(e) => onInputChange(e, "employeeId")} required autoFocus className={classNames({ "p-invalid": submitted && !result.employeeId })} />
                                            {submitted && !result.employeeId && <small className="p-invalid text-danger">EmployeeId is required.</small>}
                                        </div>
                                        <div className="field col">
                                            <label htmlFor="firstName">First Name</label>
                                            <InputText id="firstName" value={result.firstName || ""} onChange={(e) => onInputChange(e, "firstName")} required className={classNames({ "p-invalid": submitted && !result.firstName })} />
                                            {submitted && !result.firstName && <small className="p-invalid text-danger">First name is required.</small>}
                                        </div>
                                        <div className="field col">
                                            <label htmlFor="middleName">Middle name</label>
                                            <InputText id="middleName" value={result.middleName || ""} onChange={(e) => onInputChange(e, "middleName")} required className={classNames({ "p-invalid": submitted && !result.middleName })} />
                                            {submitted && !result.middleName && <small className="p-invalid text-danger">Middle name is required.</small>}
                                        </div>
                                        <div className="field col">
                                            <label htmlFor="lastName">Last Name</label>
                                            <InputText id="lastName" value={result.lastName || ""} onChange={(e) => onInputChange(e, "lastName")} required className={classNames({ "p-invalid": submitted && !result.lastName })} />
                                            {submitted && !result.lastName && <small className="p-invalid text-danger">Last name is required.</small>}
                                        </div>
                                    </div>
                                    <div className="formgrid grid">
                                        <div className="field col">
                                            <label htmlFor="gender">Gender</label>
                                            <Dropdown id="gender" value={result.gender || ""} options={gender} placeholder={result.gender ? result.gender : "Select Gender"} onChange={(e) => onGenderChange(e, "gender")} />
                                            {submitted && !result.gender && <small className="p-invalid text-danger">Gender is required.</small>}
                                        </div>
                                        <div className="field col">
                                            <label htmlFor="email">Email</label>
                                            <InputText id="email" value={result.email || ""} onChange={(e) => onInputChange(e, "email")} required className={classNames({ "p-invalid": submitted && !result.email })} />
                                            {result.email && <span className="text-danger">{emailValidation}</span>}
                                            {submitted && !result.email && <small className="p-invalid text-danger">Email is required.</small>}
                                        </div>
                                        <div className="field col">
                                            <label htmlFor="fsupervisor">First Supervisor</label>
                                            <InputText id="fsupervisor" value={result.fsupervisor || ""} onChange={(e) => onInputChange(e, "fsupervisor")} />
                                            {submitted && !result.fsupervisor && <small className="p-invalid text-danger">Required.</small>}
                                        </div>
                                        <div className="field col">
                                            <label htmlFor="ssupervisor">Second Supervisor</label>
                                            <InputText id="ssupervisor" value={result.ssupervisor || ""} onChange={(e) => onInputChange(e, "ssupervisor")} />
                                            {submitted && !result.ssupervisor && <small className="p-invalid text-danger">Required.</small>}
                                        </div>
                                    </div>
                                    <div className="formgrid grid">
                                        <div className="field col">
                                            <label htmlFor="tsupervisor">Third Supervisor</label>
                                            <InputText id="tsupervisor" value={result.tsupervisor || ""} onChange={(e) => onInputChange(e, "tsupervisor")} />
                                            {submitted && !result.tsupervisor && <small className="p-invalid text-danger">Required.</small>}
                                        </div>
                                        <div className="field col">
                                            <label htmlFor="mgmtStatus">Management status</label>
                                            <Dropdown id="mgmtStatus" value={result.mgmtStatus || ""} options={mangementStatus} placeholder={result.mgmtStatus ? result.mgmtStatus : "Select Management Status"} onChange={(e) => onManagementChange(e, "mgmtStatus")} />
                                            {submitted && !result.mgmtStatus && <small className="p-invalid text-danger">Management status is required.</small>}
                                        </div>
                                        <div className="field col">
                                            <label htmlFor="empgroup">Employee group</label>
                                            <Dropdown placeholder="Employee Group" id="empgroup" value={result.empgroup || ""} onChange={(e) => onAutoComplateChange(e, "empgroup")} options={employeeType} />
                                            {submitted && !result.empgroup && <small className="p-invalid text-danger">Required.</small>}
                                        </div>
                                        <div className="field col">
                                            <label htmlFor="costCenterCode"> Cost center</label>
                                            <InputText
                                                id="costCenterCode"
                                                value={result.costCenterCode || ""}
                                                onChange={(e) => {
                                                    onInputChange(e, "costCenterCode");
                                                }}
                                                required
                                                className={classNames({ "p-invalid": submitted && !result.costCenterCode })}
                                            />
                                            {submitted && !result.costCenterCode && <small className="p-invalid text-danger">Cost Center is required.</small>}
                                        </div>
                                    </div>
                                    <div className="formgrid grid">
                                        <div className="field col-3">
                                            <div className="p-field-checkbox">
                                                <Checkbox inputId="isAssessor" name="isAssessor" value="isAssessor" checked={result.isAssessor} onChange={(e) => onCheckboxChange(e, "isAssessor")} />
                                                <label htmlFor="isAssessor" className="px-2">
                                                    Is Assessor
                                                </label>
                                            </div>
                                        </div>
                                        <div className="field col-3">
                                            <div className="p-field-checkbox">
                                                <Checkbox inputId="iscoach" name="iscoach" value="iscoach" checked={result.iscoach} onChange={(e) => onCheckboxChange(e, "iscoach")} />
                                                <label htmlFor="iscoach" className="px-2">
                                                    Is Coach
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Dialog>
                            <Dialog visible={deleteResultDialog} style={{ width: "450px" }} header="Confirm" modal footer={deleteResultDialogFooter} onHide={hideDeleteResultDialog}>
                                <div className="flex align-items-center justify-content-center">
                                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                                    {result && (
                                        <span>
                                            Are you sure you want to delete <b>{result.Costcntname}</b>?
                                        </span>
                                    )}
                                </div>
                            </Dialog>
                            <Dialog visible={uploadDialog} style={{ width: "600px" }} header="" modal footer={uploadDialogFooter} onHide={hideUploadDialog}>
                                <div className="card p-fluid">
                                    <header>
                                        <h4 className="text-center">Mass Employee Uploading</h4>
                                        <br />
                                        <h5>
                                            <a className="text-info" onClick={() => handleDownload(url)}>
                                                <i className="pi pi-download" /> Download
                                            </a>
                                            this sample file to prepare your CSV formate{" "}
                                        </h5>

                                        <div className="head-text">
                                            <div className="head-image">
                                                <img src="assets/layout/images/captcha1.png" alt="Captcha" />
                                            </div>
                                            <div className="text-on-image">
                                                <p>{captcha} </p>
                                            </div>
                                        </div>
                                        <div className="col-12 md:col-6">
                                            <div className="p-inputgroup">
                                                <InputText placeholder="Enter Captcha" value={captchaResult} onChange={handleCaptcha} />
                                                <Button icon="pi pi-refresh" style={{ backgroundColor: BASE_COLOR }} onClick={getCaptcha} />
                                            </div>
                                        </div>

                                        {!isVerified ? (
                                            <p className="text-danger">match Captcha to enable Upload </p>
                                        ) : (
                                            <p className="text-success">
                                                <i className="pi pi-check"> Verified</i>
                                            </p>
                                        )}
                                        <input type="file" name="file" ref={hiddenFileInput} style={{ display: "none" }} id="inputGroupFile" required onChange={handleImport} accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
                                        <Button disabled={!isVerified} id="filebtn" style={{ backgroundColor: BASE_COLOR, width: "250px" }} onClick={handleClick}>
                                            {uploadStatus ? " File Selected" : <i className="pi pi-upload"> Choose CSV file</i>}
                                        </Button>
                                    </header>
                                </div>
                            </Dialog>
                            <Dialog visible={changeStatusDialog} style={{ width: "450px" }} header="Confirm" modal footer={changeStatusRoleDialogFooter} onHide={() => showChangeStatusDialog(false)}>
                                <div className="flex align-items-center justify-content-center">
                                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                                    <span>
                                        Are you sure you want to
                                        <b>
                                            {result?.recordStatus === "Active" ? " Deactivate " : " Activate "} {result?.firstName} {result?.lastName}
                                        </b>
                                        ?
                                    </span>
                                </div>
                            </Dialog>
                        </>
                    </div>
                </div>
            </div>
        </>
    );
};
const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(Employee, comparisonFn);
