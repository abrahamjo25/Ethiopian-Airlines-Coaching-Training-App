import React, { useState, useEffect, useRef } from "react";
import { BASE_COLOR, SECONDARY_COLOR } from "../../../services/Settings";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { SplitButton } from "primereact/splitbutton";
import { InputText } from "primereact/inputtext";
import { getData, deleteData, postData, putData } from "../../../services/AccessAPI";
import { read, utils } from "xlsx";
import axios from "axios";
import fileDownload from "js-file-download";
import url from "../../../utilities/files/costcenters.csv";
import "../../../assets/css/style.css";
import "../../../assets/css/DataTableDemo.css";

const Costcenter = () => {
    let emptyResult = {
        costCenterCode: "",
        description: "",
        reportsTo: "",
        divisionCode: "",
    };
    const [loading, setLoading] = useState(true);
    const [waiting, setWaiting] = useState(false);
    const [results, setResults] = useState(null);
    const [resultDialog, setResultDialog] = useState(false);
    const [uploadDialog, setUploadDialog] = useState(false);
    const [deleteResultDialog, setDeleteResultDialog] = useState(false);
    const [result, setResult] = useState(emptyResult);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const [uploads, setUploads] = useState(null);
    const [uploadStatus, setUplodStatus] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [captcha, setCaptcha] = useState("");
    const [captchaResult, setCaptchaResult] = useState("");
    const [isEdit, setIsEdit] = useState(false);
    const [division, setDivision] = useState(null);
    const hiddenFileInput = React.useRef(null);
    let filterData = {
        costCenterCode: "",
    };
    const [filter, setFilter] = useState(filterData);
    useEffect(() => {
        fetchCostcenter();
    }, []);
    const fetchCostcenter = async () => {
        setLoading(true);
        await getData(`/CostCenter/GetAll`, "Costcenters-Index")
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
    // Mass Uploading
    const handleClick = () => {
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
    const uploadFile = async () => {
        setWaiting(true);
        let data = await postData(`/CostCenter/CreateList`, uploads, "Costcenters-Index");
        if (data) {
            setResults((prev) => [...prev, ...data]);
        }
        setWaiting(false);
        setUplodStatus(false);
        setUploadDialog(false);
        hideUploadDialog();
    };
    const handleDownload = (url) => {
        axios
            .get(url, {
                responseType: "blob",
            })
            .then((res) => {
                fileDownload(res.data, "Costcenter.csv");
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
        setUplodStatus(false);
    };

    //Create new
    const openNew = () => {
        getDivision();
        setIsEdit(false);
        setResult(emptyResult);
        setSubmitted(false);
        setResultDialog(true);
    };
    const hideDialog = () => {
        setSubmitted(false);
        setResultDialog(false);
    };

    const hideDeleteResultDialog = () => {
        setDeleteResultDialog(false);
    };
    const getDivision = () => {
        getData(`/Division/GetAll`, "Costcenters-Index").then((res) => {
            if (res) {
                setDivision(res.data);
            }
        });
    };
    const saveResult = async () => {
        setSubmitted(true);
        if (result.costCenterCode && result.description && result.divisionCode) {
            let _result = { ...result };
            if (isEdit) {
                setWaiting(true);
                setSubmitted(false);
                let data = await putData(`/CostCenter/Update`, _result, "Costcenters-Index");
                if (data) {
                    setResults((prev) =>
                        prev.map((item) => {
                            if (item.costCenterCode === data?.costCenterCode) {
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
                let data = await postData(`/CostCenter/Create`, _result, "Costcenters-Index");
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
        getDivision();
        setIsEdit(true);
        setResult({ ...result });
        setResultDialog(true);
    };
    const confirmDeleteResult = (result) => {
        setResult(result);
        setDeleteResultDialog(true);
    };

    const deleteResult = async () => {
        setWaiting(true);
        let data = await deleteData(`/CostCenter/Delete?costCenterCode=${result?.costCenterCode}`, "Costcenters-Index");
        if (data) {
            setResults(results.filter((item) => item.costCenterCode !== data?.costCenterCode));
            setDeleteResultDialog(false);
            setResult(emptyResult);
        }
        setWaiting(false);
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _result = { ...result };
        _result[`${name}`] = val;
        setResult(_result);
    };
    const onDivChange = (e, name) => {
        debugger;
        const val = (e.target && e.target.value) || "";
        let _result = { ...result };
        _result[`${name}`] = val?.divisionCode;
        setResult(_result);
    };
    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Create New" icon="pi pi-plus" style={{ backgroundColor: BASE_COLOR }} onClick={openNew} />
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

    const items = (data) => [
        {
            label: "Edit",
            icon: "pi pi-pencil",
            command: (e) => {
                editresult(data);
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
        return <SplitButton label="Manage" className="p-button-raised p-button-success p-button-text mr-2 mb-2" model={items(data)} onClick={(e) => items(data)}></SplitButton>;
    };

    const rowCount = (rowData, props) => {
        let index = parseInt(props.rowIndex + 1, 10);
        return (
            <React.Fragment>
                <span>{index}</span>
            </React.Fragment>
        );
    };
    const exportCSV = () => {
        dt.current.exportCSV();
    };
    const onSearchChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _result = { ...filter };
        _result[`${name}`] = val;
        setFilter(_result);
    };
    const clearSearch = () => {
        setFilter(filterData);
        fetchCostcenter();
    };
    const filterTemplate = () => {
        return (
            <>
                <div className="card p-fluid">
                    <div className="formgrid grid">
                        <p>Search by </p>
                        <InputText value={filter.costCenterCode} onChange={(e) => onSearchChange(e, "costCenterCode")} placeholder="Cost center" className="mt-3" />
                    </div>
                </div>
            </>
        );
    };
    const buttonTemplate = () => {
        return (
            <div className="d-flex justify-content-between">
                <Button icon="pi pi-times" label="Clear" onClick={clearSearch} className="p-button-outlined p-button-danger" />
                <Button icon="pi pi-search" label="Search" onClick={fetchCostcenter} className="p-button-rounded p-button-success" />
            </div>
        );
    };
    const searchItems = [
        {
            template: filterTemplate,
        },
        {
            template: buttonTemplate,
        },
    ];
    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h4 className="m-0">Cost Center Details</h4>
            <div>
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
                </span>
                <span className="p-input-icon-left">
                    <SplitButton label="Advance Search" icon="pi pi-search" model={searchItems} className="p-mr-2"></SplitButton>
                </span>
            </div>
        </div>
    );

    const resultDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text btn-success" onClick={hideDialog} />
            {waiting ? <Button label="Saving" icon="pi pi-spin pi-spinner" style={{ backgroundColor: BASE_COLOR }} disabled={true} /> : <Button label="Save" icon="pi pi-save" style={{ backgroundColor: BASE_COLOR }} className="btn-danger" onClick={saveResult} />}
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
            {waiting ? <Button label="Uploading.." icon="pi pi-spin pi-spinner" style={{ backgroundColor: BASE_COLOR }} disabled={true} /> : <Button label="Save" icon="pi pi-check" disabled={!uploadStatus} style={{ backgroundColor: BASE_COLOR }} className="" onClick={uploadFile} />}
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
                        <DataTable
                            ref={dt}
                            value={results}
                            dataKey="id"
                            paginator
                            loading={loading}
                            rows={7}
                            className="p-datatable-responsive-demo"
                            rowsPerPageOptions={[7, 15, 25]}
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} results"
                            globalFilter={globalFilter}
                            emptyMessage="No results found."
                            header={header}
                        >
                            <Column header="No" className="p-column-title" body={rowCount}></Column>
                            <Column field="costCenterCode" header="Code" filter className="p-column-title"></Column>
                            <Column field="description" header="Description" className="p-column-title"></Column>
                            <Column field="reportsTo" header="Reports To" className="p-column-title"></Column>
                            <Column field="divisionCode" header="Division" className="p-column-title"></Column>
                            <Column field="recordStatus" header="Status" body={statusBody} headerStyle={{ width: "14%", minWidth: "10rem" }} className="p-column-title"></Column>
                            <Column header="Action" headerStyle={{ width: "7%", minWidth: "0.5rem" }} body={actionBodyTemplate}></Column>
                        </DataTable>
                        <Dialog visible={resultDialog} style={{ width: "450px" }} header="" modal className="p-fluid" footer={resultDialogFooter} onHide={hideDialog}>
                            <div className="card p-fluid" style={{ borderColor: BASE_COLOR }}>
                                <h4 className="text-center">Cost Center {isEdit ? " Edit" : " Create"}</h4>
                                <br />
                                <div className="formgrid grid">
                                    <div className="field col">
                                        <label htmlFor="costCenterCode">Code</label>
                                        <InputText id="costCenterCode" value={result.costCenterCode || ""} disabled={isEdit} onChange={(e) => onInputChange(e, "costCenterCode")} required autoFocus className={classNames({ "p-invalid": submitted && !result.costCenterCode })} />
                                        {submitted && !result.costCenterCode && <small className="p-invalid text-danger">Costcenter Code is required.</small>}
                                        <br />
                                        <label htmlFor="description">Description</label>
                                        <InputText id="description" value={result.description || ""} onChange={(e) => onInputChange(e, "description")} required className={classNames({ "p-invalid": submitted && !result.description })} />
                                        {submitted && !result.description && <small className="p-invalid text-danger">Costcenter Name is required.</small>}
                                        <br />
                                        <label htmlFor="divisionCode">Division</label>
                                        <Dropdown value={result?.divisionCode} onChange={(e) => onDivChange(e, "divisionCode")} required options={division} optionLabel="divisionCode" filter filterBy="divisionCode" className={classNames({ "p-invalid": submitted && !result.divisionCode })} placeholder={result?.divisionCode} />
                                        {submitted && !result.divisionCode && <small className="p-invalid text-danger">Division is required.</small>}
                                        <br />
                                        <label htmlFor="reportsTo">Reports To</label>
                                        <InputText id="reportsTo" value={result.reportsTo || ""} onChange={(e) => onInputChange(e, "reportsTo")} required />
                                    </div>
                                </div>
                            </div>
                        </Dialog>
                        <Dialog visible={deleteResultDialog} style={{ width: "450px" }} header="Confirm" modal footer={deleteResultDialogFooter} onHide={hideDeleteResultDialog}>
                            <div className="flex align-items-center justify-content-center">
                                <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                                {result && (
                                    <span>
                                        Are you sure you want to delete <b>{result.description}</b>?
                                    </span>
                                )}
                            </div>
                        </Dialog>
                        <Dialog visible={uploadDialog} style={{ width: "600px" }} header="" modal footer={uploadDialogFooter} onHide={hideUploadDialog}>
                            <div className="card p-fluid">
                                <header>
                                    <h4 className="text-center">Cost Center Mass Upload</h4>
                                    <br />
                                    <h5>
                                        <span className="text-info" onClick={() => handleDownload(url)}>
                                            <i className="pi pi-download" /> Download
                                        </span>
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
                    </div>
                </div>
            </div>
        </>
    );
};

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(Costcenter, comparisonFn);
