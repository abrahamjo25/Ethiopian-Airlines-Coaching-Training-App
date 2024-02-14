import React, { useState, useEffect, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import { BASE_COLOR, SECONDARY_COLOR } from "../../../services/Settings";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { SplitButton } from "primereact/splitbutton";
import { InputText } from "primereact/inputtext";
import { getData, deleteData, postData, putData } from "../../../services/AccessAPI";
import { read, utils } from "xlsx";
import axios from "axios";
import fileDownload from "js-file-download";
import PlHeaderURL from "../../../utilities/files/PlHeader.csv";
import PlDetailURL from "../../../utilities/files/Pldetail.csv";
import "../../../assets/css/style.css";
import { PLMapping } from "./Plmapping";
import "../../../assets/css/DataTableDemo.css";

const Plheader = () => {
    let emptyResult = {
        plCode: "",
        description: "",
        level: "",
        duration: null,
        costCenterCode: "",
        allowParallelPlanning: false,
    };
    let plTaskCount = {
        plCode: "",
        assessmentNo: null,
        maxSigning: null,
    };
    const [loading, setLoading] = useState(false);
    const [dialogLoading, setDialogLoading] = useState(false);
    const [checkDialog, setCheckDialog] = useState(false);
    const [mapDialog, setMapDialog] = useState(false);
    const [approval, setApproval] = useState([]);
    const [approveDialog, setApproveDialog] = useState(false);
    const [confirmDialog, setConfirmDialog] = useState(false);
    const [plcodes, setPlcodes] = useState(null);
    const [waiting, setWaiting] = useState(false);
    const [results, setResults] = useState(null);
    const [resultDialog, setResultDialog] = useState(false);
    const [uploadDialog, setUploadDialog] = useState(false);
    const [deleteResultDialog, setDeleteResultDialog] = useState(false);
    const [result, setResult] = useState(emptyResult);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [costcenters, setCostcenters] = useState(null);
    const [uploads, setUploads] = useState(null);
    const [uploadStatus, setUplodStatus] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [captcha, setCaptcha] = useState("");
    const [captchaResult, setCaptchaResult] = useState("");
    const [isEdit, setIsEdit] = useState(false);
    const [subResult, setSubResult] = useState(null);
    const [showDialog, setShowPlDialog] = useState(false);
    const [error, setError] = useState("");
    const [isRevise, setIsRevise] = useState(false);
    const toast = useRef(null);
    const dt = useRef(null);
    const hiddenFileInput = React.useRef(null);
    const [counts, setCounts] = useState(plTaskCount);
    const level = [
        { name: "Level1", value: 1 },
        { name: "Level2", value: 2 },
        { name: "Level3", value: 3 },
        { name: "Level4", value: 4 },
        { name: "Level5", value: 5 },
    ];
    const duration = [
        { name: "1 Month", value: 1 },
        { name: "2 Months", value: 2 },
        { name: "3 Months", value: 3 },
        { name: "4 Months", value: 4 },
        { name: "5 Months", value: 5 },
        { name: "6 Months", value: 6 },
    ];
    const history = useHistory();
    useEffect(() => {
        fetchData();
    }, []);
    const fetchData = async () => {
        setLoading(true);
        await getData(`/PlHeader/GetByCostCenter`, "Plheader-Index")
            .then((res) => {
                if (res) {
                    setResults(res.data);
                }
            })
            .catch(() => {})
            .finally(() => {
                setLoading(false);
            });
    };
    const getAllCostcenters = () => {
        setDialogLoading(true);
        getData(`/CostCenter/GetAll`, "Plheader-Index")
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
                setDialogLoading(false);
            });
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

    const uploadFile = async (e) => {
        e.preventDefault();
        setWaiting(true);
        let data = await postData(`/PlHeader/CreateList`, uploads, "Plheader-Index");
        if (data) {
            setResults((prev) => [...prev, ...data]);
        }
        setWaiting(false);
        setUplodStatus(false);
        setUploadDialog(false);
        hideUploadDialog();
    };
    const handleDownload = () => {
        let url = "";
        let fileName = "";
        if (isRevise) {
            url = PlDetailURL;
            fileName = "PlDetail.csv";
        } else {
            url = PlHeaderURL;
            fileName = "PlHeader.csv";
        }
        axios
            .get(url, {
                responseType: "blob",
            })
            .then((res) => {
                fileDownload(res.data, fileName);
            });
    };
    const openUpload = () => {
        setError("");
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
        getAllCostcenters();
        setSubmitted(false);
        setResultDialog(true);
    };

    const hideDialog = () => {
        setIsEdit(false);
        setSubmitted(false);
        setResultDialog(false);
        setResult(emptyResult);
        setMapDialog(false);
        setApproveDialog(false);
        setCheckDialog(false);
    };

    const hideDeleteResultDialog = () => {
        setDeleteResultDialog(false);
    };

    const plAproval = async () => {
        setWaiting(true);
        let data = await putData(`/PlHeader/ManagerApproval?plCode=${plcodes?.plCode}`, "", "Plheader-Index");
        if (data) {
            setResults((prev) =>
                prev?.map((item) => {
                    if (item?.plCode === data?.plCode) {
                        return data;
                    }
                    return item;
                })
            );
            hideDialog();
            setWaiting(false);
            setResult(emptyResult);
        }
    };
    const plValidation = (val) => {
        const regex = /^[A-Z0-9]{8}-[0-9]-\d{3}$/;
        const isValidInput = regex.test(val);
        return isValidInput;
    };
    const saveResult = async () => {
        setSubmitted(true);
        if (plValidation(result.plCode)) {
            if (result.plCode && result.costCenterCode && result.description && result.level && result.duration) {
                let _result = { ...result };
                if (isEdit) {
                    setWaiting(true);
                    setSubmitted(false);
                    setWaiting(true);
                    let data = await putData(`/PlHeader/Update`, _result, "Plheader-Index");
                    if (data) {
                        setResults((prev) =>
                            prev.map((item) => {
                                if (item.plCode === data?.plCode) {
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
                    let data = await postData(`/PlHeader/Create`, _result, "Plheader-Index");
                    if (data) {
                        setResults((prev) => [...prev, data]);
                        setResultDialog(false);
                        setResult(emptyResult);
                    }
                    setWaiting(false);
                }
            }
        }
    };
    const updateLiveData = (data) => {
        setResults((prev) => [...prev, data]);
    };
    const editresult = (result) => {
        setIsEdit(true);
        let _result = { ...result };
        const pllevel = level.find((i) => i.name === _result?.level);
        _result["level"] = pllevel?.value;
        setResult(_result);
        openNew();
    };
    const revisePL = (result) => {
        setIsRevise(true);
        setResult({ ...result });
        openUpload();
    };
    const confirmDeleteResult = (result) => {
        setResult(result);
        setDeleteResultDialog(true);
    };

    const deleteResult = async () => {
        setWaiting(true);
        let data = await deleteData(`/PlHeader/Delete?plCode=${result?.plCode}`, "Plheader-Index");
        if (data) {
            setResults(results.filter((item) => item.costCenterCode !== data?.costCenterCode));
            setDeleteResultDialog(false);
            setResult(emptyResult);
        }
        setWaiting(false);
    };

    const hideCheckDialog = () => {
        setCheckDialog(false);
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

    const onCheckedChange = (e, name) => {
        let _result = { ...result };
        let val = (e.target && e.target.checked) || false;
        _result[`${name}`] = val;
        setResult(_result);
    };
    const isObject = (obj) => {
        return Object.prototype.toString.call(obj) === "[object Object]";
    };
    const onAutoCompleteChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _result = { ...result };
        let ctn = val.costCenterCode;
        _result[`${name}`] = ctn;
        setResult(_result);
    };
    const confirmAproveDialog = () => {
        setApproveDialog(true);
    };
    const hideAproveDialog = () => {
        setApproveDialog(false);
    };
    const hideConfirmDialog = () => {
        setConfirmDialog(false);
    };
    const approveResultDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideAproveDialog} />
            {waiting ? <Button label="Saving" icon="pi pi-spin pi-spinner" style={{ backgroundColor: BASE_COLOR }} disabled={true} /> : <Button label="Yes" icon="pi pi-check" style={{ backgroundColor: BASE_COLOR }} className="" onClick={plAproval} />}
        </>
    );
    const confirmResultDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideConfirmDialog} />
            {waiting ? <Button label="Saving" icon="pi pi-spin pi-spinner" style={{ backgroundColor: BASE_COLOR }} disabled={true} /> : <Button label="Yes" icon="pi pi-check" style={{ backgroundColor: BASE_COLOR }} className="" onClick={saveResult} />}
        </>
    );
    const approveDialogFooter = () => {
        if (approval.hasPlDetails && approval.hasAssessmentItems && approval.hasMaxSigning && approval.hasAssessmentNo) {
            return (
                <>
                    <Button label="Approve" icon="pi pi-check" style={{ backgroundColor: BASE_COLOR }} className="btn-danger" onClick={confirmAproveDialog} />
                </>
            );
        } else {
            return (
                <>
                    <Button label="Approve" disabled={true} icon="pi pi-check" style={{ backgroundColor: BASE_COLOR }} className="btn-danger" />
                </>
            );
        }
    };
    const noDetail = <span className="text-danger">This PL has no PL detail tasks.</span>;
    const assessmentlimit = <span className="text-danger">Total amount of questions for assessment is needed.</span>;
    const dailyTasklimit = <span className="text-danger">Daily task limit needed.</span>;
    const SelectedTasks = <span className="text-danger">There is no Selected Items(Tasks) for Assessment from PL details.</span>;

    const findLevel = (val) => {
        for (let i = 0; i < level.length; i++) {
            if (level[i].value === val) {
                return true;
            }
        }
        return false;
    };
    const onLevelChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _result = { ...result };
        let ctn;
        if (isObject(val)) {
            ctn = val.value;
        } else {
            let key = findLevel(val);

            if (key) {
                ctn = val;
            } else {
                ctn = "";
            }
        }
        _result[`${name}`] = ctn;
        setResult(_result);
    };
    const onDurationChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _result = { ...result };
        _result[`${name}`] = val;
        setResult(_result);
    };
    const checkApproval = (res) => {
        setDialogLoading(true);
        setCheckDialog(true);
        setPlcodes(res);
        getData(`/PlHeader/IsReadyForApproval?plCode=${res?.plCode}`, "Plheader-Index")
            .then((res) => {
                if (res) {
                    setApproval(res.data);
                }
            })
            .catch((error) => {
                if (error.name === "AbortError") {
                    console.log("Request Cancled!");
                }
            })
            .finally(() => {
                setDialogLoading(false);
            });
    };
    const createItems = [
        {
            label: "Create New",
            icon: "pi pi-plus",
            command: () => {
                openNew();
            },
        },
        {
            label: "Map From",
            icon: "pi pi-map",
            command: () => {
                getAllCostcenters();
                setMapDialog(true);
            },
        },
    ];
    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <SplitButton label="New PL" model={createItems}></SplitButton>
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
    const viewplDetail = (e, plCode) => {
        e.preventDefault();
        history.push({
            pathname: "/pl-details",
            state: {
                plCode: plCode,
            },
        });
    };
    const items = (data) => {
        const result = [];

        if (data?.aproval === "Ready" || data?.approval === "Rejected") {
            result.push({
                label: "Approve",
                icon: "pi pi-check",
                command: () => {
                    checkApproval(data);
                },
            });
        } else if (data?.approval === "ManagerApproved") {
            result.push({
                label: "Approval Sent",
                disabled: true,
            });
        } else if (data?.approval === "HRApproved") {
            result.push({
                label: "Approved",
                disabled: true,
            });
        }

        result.push({
            label: "Edit",
            icon: "pi pi-pencil",
            command: () => {
                editresult(data);
            },
        });

        result.push({
            label: "Revise",
            icon: "pi pi-replay",
            command: () => {
                revisePL(data);
            },
        });
        data.approval !== "HRApproved"
            ? result.push({
                  label: "Delete",
                  icon: "pi pi-trash",
                  command: () => {
                      confirmDeleteResult(data);
                  },
              })
            : result.push({
                  label: "Delete",
                  disabled: true,
              });

        return result;
    };
    const actionBodyTemplate = (data) => {
        return <SplitButton label="Action" className="p-button-raised p-button-success p-button-text mr-2 mb-2" model={items(data)} onClick={(e) => items(data)}></SplitButton>;
    };
    const approvalStatus = (data) => {
        return <span className={"customer-badge " + data?.aproval}>{data?.aproval}</span>;
    };

    const getPlDetail = (data) => {
        return <Button label="View detail" className="p-button-raised p-button-success p-button-text mr-2 mb-2" onClick={(e) => viewplDetail(e, data?.plCode)} />;
    };
    const rowCount = (rowData, props) => {
        let index = parseInt(props.rowIndex + 1, 10);

        return (
            <React.Fragment>
                <span>{index}</span>
            </React.Fragment>
        );
    };
    const [originalRows, setOriginalRows] = useState(null);
    const onRowEditInit = (event) => {
        let _result = { ...results[event.index] };
        setOriginalRows(_result);
    };
    const onRowEditSave = async () => {
        let _result = { ...counts };
        await putData(`/PlHeader/AssesmentandSigning`, _result, "Plheader-Index");
    };

    const onRowEditCancel = (event) => {
        let products = [...results];
        products[event.index] = originalRows;
        setOriginalRows(null);
        setCounts(plTaskCount);
        setResults(products);
    };

    const dataTableFuncMap = {
        results: setResults,
    };

    const onEditorValueChange = (productKey, props, value, field) => {
        let index = props.rowIndex;
        let _count = { ...counts };
        _count[`plCode`] = props?.rowData?.plCode;
        _count[`assessmentNo`] = parseInt(props?.rowData?.assessmentNo);
        _count[`maxSigning`] = parseInt(props?.rowData?.maxSigning);
        _count[`${field}`] = parseInt(value);
        setCounts(_count);
        let updatedItems = [...results];
        props.rowData[field] = value;
        updatedItems[index] = { ...updatedItems[index], [field]: value };

        dataTableFuncMap[productKey](updatedItems);
    };

    const inputTextEditor = (props, field) => {
        return <InputText type="number" value={props.rowData[field]} onChange={(e) => onEditorValueChange("results", props, e.target.value, field)} />;
    };

    const liveEditor = (props, name) => {
        return inputTextEditor(props, name);
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h4 className="m-0">PL Header</h4>
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
    const plCouterDisplay = (res) => {
        setSubResult(res.pldetails);
        setShowPlDialog(true);
    };
    const hideSHowPlDialog = () => {
        setShowPlDialog(false);
        setSubResult(null);
    };
    const plDetailTamplate = (rowData) => {
        return (
            <>
                <span className="p-tag p-tag-success" onClick={() => plCouterDisplay(rowData)}>
                    <i className="pi pi-eye">{rowData.pldetails.length}</i>
                </span>
            </>
        );
    };
    return (
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
                            rows={7}
                            rowsPerPageOptions={[7, 15, 25]}
                            className="p-datatable-responsive-demo "
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} results"
                            globalFilter={globalFilter}
                            emptyMessage="No results found."
                            header={header}
                            editMode="row"
                            onRowEditInit={onRowEditInit}
                            onRowEditCancel={onRowEditCancel}
                            onRowEditSave={onRowEditSave}
                        >
                            <Column field="" header="No" body={rowCount} className="p-column-title"></Column>
                            <Column field="plCode" header="Code" sortable className="p-column-title"></Column>
                            <Column field="description" header="Description" className="p-column-title"></Column>
                            <Column field="level" header="Level" className="p-column-title"></Column>
                            <Column field="duration" header="Duration (month)" className="p-column-title"></Column>
                            <Column field="costCenterCode" header="Cost center" className="p-column-title"></Column>
                            <Column field="assessmentNo" header="Assessment No" editor={(props) => liveEditor(props, "assessmentNo")}></Column>
                            <Column field="maxSigning" header="Daily task limit" editor={(props) => liveEditor(props, "maxSigning")}></Column>
                            <Column rowEditor headerStyle={{ width: "7rem" }} bodyStyle={{ textAlign: "center" }}></Column>

                            <Column field="aproval" header="Approval Status" body={approvalStatus} className="p-column-title"></Column>
                            <Column header="Pl Details" body={getPlDetail} className="p-column-title"></Column>
                            <Column header="Action" body={actionBodyTemplate}></Column>
                        </DataTable>
                        <Dialog visible={resultDialog} style={{ width: "900px" }} header="" modal className="p-fluid" footer={resultDialogFooter} onHide={hideDialog}>
                            <div className="card p-fluid" style={{ borderColor: BASE_COLOR }}>
                                <h4 className="text-center">PL Header{isEdit ? " Edit" : " Create"}</h4>
                                <div className="formgrid grid">
                                    <div className="field col">
                                        <label htmlFor="plCode">PL Code</label>
                                        <InputText id="plCode" value={result.plCode || ""} disabled={isEdit} onChange={(e) => onInputChange(e, "plCode")} required className={classNames({ "p-invalid": submitted && !result.plCode })} placeholder="ex. ITSAPDEV-1-001" />
                                        {submitted && !result.plCode && <small className="p-invalid text-danger">PL Code is required.</small>}
                                        {submitted && result.plCode && !plValidation(result.plCode) && <small className="p-invalid text-danger">Invalid PL Format.</small>}
                                    </div>
                                    <div className="field col">
                                        <label htmlFor="description">PL Description</label>
                                        <InputText id="description" value={result.description || ""} onChange={(e) => onInputChange(e, "description")} required className={classNames({ "p-invalid": submitted && !result.description })} />
                                        {submitted && !result.description && <small className="p-invalid text-danger">PL Description is required.</small>}
                                    </div>
                                </div>
                                <div className="formgrid grid">
                                    <div className="field col">
                                        <label htmlFor="duration">Completion Duration</label>
                                        <Dropdown value={result.duration || ""} options={duration} onChange={(e) => onDurationChange(e, "duration")} optionLabel="name" placeholder={result.level || "Choose  Duration"} />
                                        {submitted && !result.duration && <small className="p-invalid text-danger">Completion Duration is required.</small>}
                                    </div>
                                    <div className="field col">
                                        <label htmlFor="level">PL Level</label>
                                        <Dropdown value={result.level || ""} options={level} onChange={(e) => onLevelChange(e, "level")} optionLabel="name" placeholder={result.level || "Choose  PL Level"} />
                                        {submitted && !result.level && <small className="p-invalid text-danger">PL Level is required.</small>}
                                    </div>
                                </div>
                                <div className="formgrid grid">
                                    <div className="field col">
                                        <label htmlFor="costCenterCode">Cost Center</label>
                                        <Dropdown value={result.costCenterCode || ""} options={costcenters} onChange={(e) => onAutoCompleteChange(e, "costCenterCode")} optionLabel="costCenterCode" filter filterBy="costCenterCode" placeholder={result.costCenterCode || "Choose Cost center"} />
                                        {submitted && !result.costCenterCode && <small className="p-invalid text-danger">Costcenter is required.</small>}
                                    </div>
                                    <div className="field col">
                                        <div className="formgrid grid py-5">
                                            <div className="field col">
                                                <div className="form-check">
                                                    <input className="form-check-input" type="checkbox" onChange={(e) => onCheckedChange(e, "allowParallelPlanning")} checked={result.allowParallelPlanning} style={{ width: "20px", height: "20px" }} id="allowParallelPlanning" />
                                                    <label className="form-check-label" htmlFor="allowParallelPlanning">
                                                        <p>
                                                            &nbsp;&nbsp;Allow Parallel Planning <Link to={{ pathname: "/Help-Center", state: { data: "allowParallelPlanning" } }}>Help</Link>
                                                        </p>
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="field col"></div>
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
                                        Are you sure you want to delete <b>{result.Plcodes}</b>?
                                    </span>
                                )}
                            </div>
                        </Dialog>
                        <Dialog visible={uploadDialog} style={{ width: "600px" }} header="" modal footer={uploadDialogFooter} onHide={hideUploadDialog}>
                            <div className="card p-fluid">
                                <header>
                                    <h4 className="text-center">{isRevise ? "Revise PL" : "Mass PlHeader Uploading"}</h4>
                                    <br />
                                    <span className="text-danger">{error}</span>
                                    <h5>
                                        <span className="text-info" onClick={() => handleDownload()}>
                                            <i className="pi pi-download" /> Download
                                        </span>
                                        this sample file to prepare your CSV formate
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
                        <Dialog visible={checkDialog} style={{ width: "800px" }} header="" modal className="p-fluid" footer={approveDialogFooter} onHide={hideCheckDialog}>
                            <div className="user-card card ">
                                <h4 className="text-center">Check all Requirments to Approve</h4>
                                <div className="col-12 lg:col-12">
                                    <div className="user-card card " style={{ borderColor: BASE_COLOR }}>
                                        {dialogLoading ? (
                                            "Loading..."
                                        ) : (
                                            <ul>
                                                <li className="clearfix">
                                                    <i className="pi pi-fw pi-list"></i>
                                                    <span className="project-title fw-bold"> PL Detail :</span>
                                                    <span>{approval?.hasPlDetails ? <span className="customer-badge Completed">Done</span> : noDetail}</span>
                                                </li>
                                                <br />
                                                <li className="clearfix">
                                                    <i className="pi pi-bolt"></i>
                                                    <span className="project-title fw-bold"> Total Assessment questions :</span>
                                                    <span>{approval?.hasAssessmentNo ? <span className="customer-badge Completed">Done</span> : assessmentlimit}</span>
                                                </li>
                                                <br />
                                                <li className="clearfix">
                                                    <i className="pi pi-fw pi-ticket"></i>
                                                    <span className="project-title fw-bold">Daily Task Limit :</span>
                                                    <span>{approval?.hasMaxSigning ? <span className="customer-badge Completed">Done</span> : dailyTasklimit}</span>
                                                </li>
                                                <br />
                                                <li className="clearfix">
                                                    <i className="pi pi-check-square"></i>
                                                    <span className="project-title fw-bold"> Tasks for Assessment :</span>
                                                    <span>{approval?.hasAssessmentItems ? <span className="customer-badge Completed">Done</span> : SelectedTasks}</span>
                                                </li>
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Dialog>
                        <Dialog visible={approveDialog} style={{ width: "450px" }} header="Confirm" modal footer={approveResultDialogFooter} onHide={hideAproveDialog}>
                            <div className="flex align-items-center justify-content-center">
                                <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                                {result && (
                                    <span>
                                        Are you sure you want to approve this <b>PL</b>?
                                    </span>
                                )}
                            </div>
                        </Dialog>
                        <Dialog visible={confirmDialog} style={{ width: "450px" }} header="Confirm" modal footer={confirmResultDialogFooter} onHide={hideConfirmDialog}>
                            <div className="flex align-items-center justify-content-center">
                                <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                                <p>This action changes PL version and needs HR apprval.</p>
                            </div>
                        </Dialog>
                        <Dialog visible={showDialog} style={{ width: "900px" }} onHide={hideSHowPlDialog}>
                            <DataTable
                                ref={dt}
                                value={subResult}
                                dataKey="Plcodes"
                                paginator
                                rows={5}
                                rowsPerPageOptions={[5, 10, 25]}
                                className="datatable-responsive"
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} results"
                                responsiveLayout="scroll"
                                header="PL details"
                                emptyMessage="No Available PL detail."
                            >
                                <Column header="No" className="p-column-title" body={rowCount}></Column>
                                <Column field="Taskcatagory" header="Task Category" className="p-column-title"></Column>
                                <Column field="Taskdescription" header="Task Description" className="p-column-title"></Column>
                            </DataTable>
                        </Dialog>
                        <Dialog visible={mapDialog} style={{ width: "500px" }} header="" modal className="p-fluid" onHide={hideDialog}>
                            <PLMapping invoked={mapDialog} myPL={results} onClose={hideDialog} updateData={updateLiveData} />
                        </Dialog>
                    </>
                </div>
            </div>
        </div>
    );
};

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(Plheader, comparisonFn);
