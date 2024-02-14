import React, { useState, useEffect, useRef } from "react";
import { BASE_COLOR, SECONDARY_COLOR } from "../../../services/Settings";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { SplitButton } from "primereact/splitbutton";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { getData, deleteData, postData, putData } from "../../../services/AccessAPI";
import { read, utils } from "xlsx";
import axios from "axios";
import fileDownload from "js-file-download";
import url from "../../../utilities/files/Pldetail.csv";
import "../../../assets/css/style.css";
import { useLocation } from "react-router-dom";
import "../../../assets/css/DataTableDemo.css";

const PlDetails = () => {
    const location = useLocation();
    const pl = location?.state;

    let emptyResult = {
        plCode: pl?.plCode,
        taskCode: "",
        task: "",
        isAssessmentItem: false,
        requireTSFN: false,
        requireReference: false,
    };
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [waiting, setWaiting] = useState(false);
    const [resultDialog, setResultDialog] = useState(false);
    const [deleteResultDialog, setDeleteResultDialog] = useState(false);
    const [uploadDialog, setUploadDialog] = useState(false);
    const [result, setResult] = useState(emptyResult);
    const [submitted, setSubmitted] = useState(false);
    const [dialogLoading, setDialogLoading] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [uploads, setUploads] = useState(null);
    const [uploadStatus, setUplodStatus] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [isEdit, setisEdit] = useState(false);
    const [captcha, setCaptcha] = useState("");
    const [captchaResult, setCaptchaResult] = useState("");
    const toast = useRef(null);
    const dt = useRef(null);
    const hiddenFileInput = React.useRef(null);
    const [taskCategory, setTaskCategory] = useState([]);

    useEffect(() => {
        const fetchData = () => {
            setLoading(true);
            getData(`/PlDetail/GetByPlCode?plCode=${pl?.plCode}`, "Pldetails-Index")
                .then((res) => {
                    if (res.data) {
                        setResults(res.data);
                    }
                })
                .catch(() => {})
                .finally(() => {
                    setLoading(false);
                });
        };
        fetchData();
    }, []);

    const getPLAndTask = () => {
        getData(`/TaskCategory/GetAll`, "TaskCategory-Index")
            .then((result) => {
                if (result) {
                    setTaskCategory(result.data);
                }
            })
            .catch((error) => {});
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
    const uploadFile = async () => {
        setWaiting(true);
        let data = await postData(`/PlDetail/CreateList`, uploads, "Pldetails-Index");
        if (data) {
            if (data) {
                // setResults((prev) => (prev ? [...prev, ...data] : data));
            }
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
                fileDownload(res.data, "PlDetail.csv");
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

    //Add new
    const openNew = () => {
        getPLAndTask();
        setResultDialog(true);
    };
    const hideDialog = () => {
        setSubmitted(false);
        setResultDialog(false);
        setResult(emptyResult);
        setisEdit(false);
    };

    const hideDeleteResultDialog = () => {
        setDeleteResultDialog(false);
    };

    const saveResult = async () => {
        debugger;
        setSubmitted(true);
        if (result.plCode && result.taskCode && result.task) {
            let _result = { ...result };
            if (isEdit) {
                setWaiting(true);
                setSubmitted(false);
                setWaiting(true);
                let data = await putData(`/PlDetail/Update`, _result, "Pldetails-Index");
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
                let data = await postData(`/PlDetail/Create`, _result, "Pldetails-Index");
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
        getPLAndTask();
        setisEdit(true);
        setResult({ ...result });
        setResultDialog(true);
    };
    const confirmDeleteResult = (result) => {
        setResult(result);
        setDeleteResultDialog(true);
    };

    const deleteResult = async () => {
        setWaiting(true);
        let data = await deleteData(`/PlDetail/Delete?id=${result?.id}`, "Pldetails-Index");
        if (data) {
            setResults(results.filter((item) => item.id !== data?.id));
            setDeleteResultDialog(false);
            setResult(emptyResult);
        }
        setWaiting(false);
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _result = { ...result };
        _result[`${name}`] = val;
        setResult(_result);
    };
    const onAutoComplteChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _result = { ...result };
        _result[`${name}`] = val?.plCode;
        setResult(_result);
    };
    const onAutoComplteChangeTask = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _result = { ...result };
        _result[`${name}`] = val.taskCode;
        setResult(_result);
    };
    const onCheckedChange = (e, name) => {
        let _result = { ...result };
        let val = (e.target && e.target.checked) || false;
        _result[`${name}`] = val;
        setResult(_result);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Assign Task" icon="pi pi-plus" onClick={openNew} />
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button icon="pi pi-upload" className="mr-2 inline-block" label="Import" onClick={openUpload} style={{ backgroundColor: SECONDARY_COLOR, color: "#FFFFF" }} />
                <Button label="Export" icon="pi pi-download" style={{ backgroundColor: BASE_COLOR }} className="p-button-help" onClick={exportCSV} />
            </React.Fragment>
        );
    };
    const items = (data) => [
        {
            label: "Edit",
            icon: "pi pi-pencil",
            command: () => {
                editresult(data);
            },
        },
        {
            label: "Delete",
            icon: "pi pi-trash",
            command: () => {
                confirmDeleteResult(data);
            },
        },
    ];
    const actionBodyTemplate = (data) => {
        return <SplitButton label="Action" className="p-button-raised p-button-success p-button-text mr-2 mb-2" model={items(data)} onClick={(e) => items(data)}></SplitButton>;
    };
    const rowCount = (rowData, props) => {
        let index = parseInt(props.rowIndex + 1, 10);

        return (
            <React.Fragment>
                <span>{index}</span>
            </React.Fragment>
        );
    };
    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h4 className="m-0">[{pl?.plCode}] Details</h4>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." style={{ borderRadius: "2rem" }} className="w-full" />
            </span>
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

    return (
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
                        rowsPerPageOptions={[7, 15, 25]}
                        className="p-datatable-responsive-demo"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} results"
                        globalFilter={globalFilter}
                        emptyMessage="No results found."
                        header={header}
                    >
                        <Column field="" header="No" body={rowCount} className="p-column-title"></Column>
                        <Column field="taskCode" header="Category" className="p-column-title"></Column>
                        <Column field="task" header="Task" body="" className="p-column-title"></Column>
                        <Column field="Approvals" header="Action" body={actionBodyTemplate}></Column>
                    </DataTable>
                    <Dialog visible={resultDialog} style={{ width: "800px" }} header="" modal className="p-fluid" footer={resultDialogFooter} onHide={hideDialog}>
                        <div className="card p-fluid" style={{ borderColor: BASE_COLOR }}>
                            <h4 className="text-center">PL Detail {isEdit ? " Edit " : " Create"}</h4>

                            <div className=" col-sm-12 row">
                                <div className="field col">
                                    <label htmlFor="plCode">PL Code</label>
                                    <InputText value={result?.plCode} readOnly />
                                </div>
                                <div className="field col">
                                    <label htmlFor="taskCode">Task Catagory</label>
                                    <Dropdown value={result?.taskCode} options={taskCategory} onChange={(e) => onAutoComplteChangeTask(e, "taskCode")} optionLabel="taskCode" filter filterBy="taskCode" placeholder={dialogLoading ? "Loading..." : result.taskCode || "Select task catagory"} />
                                    {submitted && !result.taskCode && <small className="p-invalid text-danger ">Task catagory is required.</small>}
                                </div>
                            </div>

                            <div className=" col-sm-12 row">
                                <div className="field col">
                                    <label htmlFor="task">Task Description</label>
                                    <InputTextarea id="task" value={result.task || ""} onChange={(e) => onInputChange(e, "task")} required className={classNames({ "p-invalid": submitted && !result.task })} />
                                    {submitted && !result.task && <small className="p-invalid text-danger ">Task Description is required.</small>}
                                </div>
                            </div>
                            <div className=" col-sm-12 row">
                                <div className="field col-5">
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" onChange={(e) => onCheckedChange(e, "requireReference")} checked={result.requireReference} style={{ width: "20px", height: "20px" }} id="requireReference" />
                                        <label className="form-check-label" htmlFor="requireReference">
                                            <p>&nbsp;&nbsp; Is require reference</p>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className=" col-sm-12 row">
                                <div className="field col-5">
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" onChange={(e) => onCheckedChange(e, "requireTSFN")} checked={result.requireTSFN} style={{ width: "20px", height: "20px" }} id="requireTSFN" />
                                        <label className="form-check-label" htmlFor="requireTSFN">
                                            <p>&nbsp;&nbsp; Use TSF Number</p>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className=" col-sm-12 row">
                                <div className="field col-5">
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" onChange={(e) => onCheckedChange(e, "isAssessmentItem")} checked={result.isAssessmentItem} style={{ width: "20px", height: "20px" }} id="isAssessmentItem" />
                                        <label className="form-check-label" htmlFor="isAssessmentItem">
                                            <p>&nbsp;&nbsp; Is assessment Item</p>
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
                                    Are you sure you want to delete <b>{result.plCode}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>
                    <Dialog visible={uploadDialog} style={{ width: "600px" }} header="" modal footer={uploadDialogFooter} onHide={hideUploadDialog}>
                        <div className="card p-fluid">
                            <header>
                                <h4 className="text-center">Mass PL Detail Uploading</h4>
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
                </div>
            </div>
        </div>
    );
};

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(PlDetails, comparisonFn);
