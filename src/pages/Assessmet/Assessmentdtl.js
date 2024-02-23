import React, { useState, useEffect, useRef } from "react";
import { BASE_COLOR } from "../../services/Settings";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import "../../assets/css/style.css";
import { getData, postData, putData } from "../../services/AccessAPI";
import { Dropdown } from "primereact/dropdown";
import { useHistory, useLocation } from "react-router-dom";
import "../../assets/css/DataTableDemo.css";
import { InputText } from "primereact/inputtext";

const Assessmentdtl = () => {
    let emptyResult = {
        id: null,
        annualPlanId: null,
        ratting: null,
        plDetailId: null,
    };

    const [result, setResult] = useState(emptyResult);
    const [waiting, setWaiting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [dialogLoading, setDialogLoading] = useState(false);
    const [acceptDialog, setAcceptDialog] = useState(false);
    const [updateDialog, setUpdateDialog] = useState(false);
    const [task, setTask] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [signPlanValue, setSignPlanValue] = useState(null);
    const [assessmentStatus, setAssessmentStatus] = useState(false);
    const [submitFinalDialog, setSubmitFinalDialog] = useState(false);
    const dt = useRef(null);

    let rating = [
        { name: "Excellent", value: 5 },
        { name: "V_Good", value: 4 },
        { name: "Good", value: 3 },
        { name: "Not_Bad", value: 2 },
        { name: "Poor", value: 1 },
    ];

    const history = useHistory();
    const location = useLocation();
    useEffect(() => {
        if (location.state) {
            const { data } = location?.state;
            setSignPlanValue(data);
            openNew(data);
        } else {
            history.push("/assessing-trainee");
        }
    }, []);

    const hideDialog = () => {
        setAcceptDialog(false);
        setUpdateDialog(false);
        setResult(emptyResult);
        setSubmitted(false);
        setSubmitFinalDialog(false);
    };
    const onRateChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _result = { ...result };
        _result[`${name}`] = val;
        setResult(_result);
    };
    const openNew = async (data) => {
        setDialogLoading(true);
        await getTask(data?.id);
        await getAssessmentStatus(data?.id);
    };

    const getTask = async (id) => {
        await getData(`/Assessment/GetForAssessment?annualPlanId=${id}`, "Assessment-Sign")
            .then((res) => {
                if (res) {
                    setTask(res.data);
                }
            })
            .catch(() => {})
            .finally(() => {
                setDialogLoading(false);
            });
    };
    const getAssessmentStatus = async (id) => {
        setDialogLoading(true);
        await getData(`/Assessment/GetAssessmentStatusById?annualPlanId=${id}`, "Assessment-Sign")
            .then((res) => {
                if (res) {
                    setAssessmentStatus(res?.data?.signLimit);
                }
            })
            .catch(() => {})
            .finally(() => {
                setDialogLoading(false);
            });
    };
    const saveResult = async () => {
        setSubmitted(true);
        if (result.annualPlanId && result.plDetailId && result.ratting) {
            let _result = { ...result };
            setWaiting(true);
            try {
                let data = await postData(`/Assessment/Create`, _result, "Assessment-Sign");
                if (data) {
                    setTask((prev) =>
                        prev.map((item) => {
                            if (item?.plDetailId === data?.plDetailId) {
                                return { ...item, isSigned: true, assessmentId: data?.id };
                            }
                            return item;
                        })
                    );
                    getAssessmentStatus(signPlanValue?.id);
                    setAcceptDialog(false);
                    setResult(emptyResult);
                }
            } catch {
            } finally {
                setWaiting(false);
                setSubmitted(false);
            }
        }
    };
    const updateResult = async () => {
        setSubmitted(true);
        if (result.id && result.ratting) {
            let _result = { ...result };
            setWaiting(true);
            try {
                let data = await putData(`/Assessment/Update`, _result, "Assessment-Sign");
                if (data) {
                    setTask((prev) =>
                        prev.map((item) => {
                            if (item.id === data.id) {
                                return { ...item, coachApproval: data.coachApproval };
                            }
                            return item;
                        })
                    );
                    setUpdateDialog(false);
                    setResult(emptyResult);
                }
            } catch {
            } finally {
                setWaiting(false);
                setSubmitted(false);
            }
        }
    };
    const submitResult = async () => {
        setSubmitted(true);
        let _result = { ...result };
        setWaiting(true);
        try {
            let data = await putData(`/Assessment/ProcessAssessment?annualPlanId=${signPlanValue?.id}`, _result, "Assessment-Sign");
            if (data) {
                history.push("/assessing-trainee");
                setAcceptDialog(false);
                setResult(emptyResult);
            }
        } catch {
        } finally {
            setWaiting(false);
            setSubmitted(false);
        }
    };
    const acceptSign = (data) => {
        let _result = { ...result };
        _result["annualPlanId"] = signPlanValue?.id;
        _result["plDetailId"] = data?.plDetailId;
        setResult(_result);
        setAcceptDialog(true);
    };
    const updateSign = (data) => {
        let _result = { ...result };
        _result["id"] = data?.id;
        setResult(_result);
        setUpdateDialog(true);
    };

    const resultDialogFooter = (rowData) => {
        return (
            <div className="text-right">
                <React.Fragment>
                    {!assessmentStatus && <b>You can't submit the result until the number of tasks set by the manager signed.</b>}
                    <Button label="Submit Result" icon="pi pi-sign-in" disabled={!assessmentStatus} style={{ backgroundColor: BASE_COLOR }} className="btn-danger" onClick={() => setSubmitFinalDialog(true)} />
                </React.Fragment>
            </div>
        );
    };
    const acceptResultDialogFooter = (rowData) => {
        return (
            <div className="text-right">
                <React.Fragment>
                    {waiting ? <Button label="Saving.." icon="pi pi-spin pi-spinner" style={{ backgroundColor: BASE_COLOR }} disabled={true} /> : <Button label="Save" icon="pi pi-save" style={{ backgroundColor: BASE_COLOR }} className="btn-danger" onClick={() => saveResult(rowData)} />}
                </React.Fragment>
            </div>
        );
    };
    const updateResultDialogFooter = (rowData) => {
        return (
            <div className="text-right">
                <React.Fragment>
                    {waiting ? <Button label="Saving.." icon="pi pi-spin pi-spinner" style={{ backgroundColor: BASE_COLOR }} disabled={true} /> : <Button label="Update" icon="pi pi-sign-in" style={{ backgroundColor: BASE_COLOR }} className="btn-danger" onClick={() => updateResult(rowData)} />}
                </React.Fragment>
            </div>
        );
    };
    const submitResultDialogFooter = (rowData) => {
        return (
            <div className="text-right">
                <React.Fragment>
                    <Button label="Cancel" icon="pi pi-times" className="p-button-text btn-success" onClick={hideDialog} />
                    {waiting ? <Button label="Saving.." icon="pi pi-spin pi-spinner" style={{ backgroundColor: BASE_COLOR }} disabled={true} /> : <Button label="Yes" icon="pi pi-check" style={{ backgroundColor: BASE_COLOR }} className="btn-danger" onClick={() => submitResult(rowData)} />}
                </React.Fragment>
            </div>
        );
    };
    const rowCount = (rowData, props) => {
        let index = parseInt(props.rowIndex + 1, 10);

        return (
            <React.Fragment>
                <span>{index}</span>
            </React.Fragment>
        );
    };
    const signBody = (rowData) => {
        if (rowData?.isSigned) {
            return (
                <>
                    <Button icon="pi pi-pencil" onClick={() => updateSign(rowData)} className="p-button-rounded mr-2 p-button-info" tooltip="Edit" tooltipOptions={{ position: "top" }} />
                </>
            );
        } else {
            return (
                <>
                    <Button icon="pi pi-check" onClick={() => acceptSign(rowData)} className="p-button-rounded mr-2" tooltip="Accept" tooltipOptions={{ position: "top" }} />
                </>
            );
        }
    };
    const statusBody = (rowData) => {
        if (rowData?.isSigned) {
            return <span className="customer-badge CoachAction">Signed</span>;
        } else {
            return <span className="customer-badge Ready">Ready</span>;
        }
    };
    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h4 className="m-0">Assessment</h4>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );
    return (
        <>
            <div className="datatable-responsive-demo grid crud-demo">
                <div className="col-12">
                    <div className="card">
                        <h4 className="">Assessment</h4>
                        <hr />
                        <div className="formgrid grid fs-5">
                            <div className="field col-6 text-lg"> {"ID: " + " " + signPlanValue?.employeeId}</div>
                            <div className="text-lg">{signPlanValue?.fullName}</div>
                        </div>
                        <div className="col-12 lg:col-12">
                            <DataTable
                                ref={dt}
                                value={task}
                                loading={dialogLoading}
                                dataKey="id"
                                paginator
                                rows={10}
                                rowsPerPageOptions={[5, 10, 25]}
                                className="p-datatable-responsive-demo"
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} results"
                                globalFilter={globalFilter}
                                emptyMessage="No task found for assessment."
                                footer={resultDialogFooter}
                                header={header}
                            >
                                <Column field="" header="No" body={rowCount} className="p-column-title"></Column>
                                <Column field="taskCode" header="Category" className="p-column-title"></Column>
                                <Column field="task" header="Task" className="p-column-title"></Column>
                                <Column field="isSigned" header="Status" body={statusBody} className="p-column-title"></Column>
                                <Column body={signBody} className="p-column-title"></Column>
                            </DataTable>
                        </div>
                        <Dialog visible={acceptDialog} style={{ width: "500px" }} header="Confirm" modal footer={acceptResultDialogFooter} onHide={hideDialog}>
                            <div className="dropdown-demo">
                                <div className="card">
                                    <h5>Rate the task based on the give criteria</h5>
                                    <Dropdown placeholder="Choose value" id="Rating" value={result.ratting || ""} onChange={(e) => onRateChange(e, "ratting")} options={rating} optionLabel="name" />
                                    {submitted && !result.ratting && <small className="p-invalid text-danger">Rate this task to continue</small>}
                                </div>
                            </div>
                        </Dialog>
                        <Dialog visible={updateDialog} style={{ width: "500px" }} header="Confirm Update" modal footer={updateResultDialogFooter} onHide={hideDialog}>
                            <div className="dropdown-demo">
                                <div className="card">
                                    <h5>Rate the task based on the give criteria</h5>
                                    <Dropdown placeholder="Choose value" id="Rating" value={result.ratting || ""} onChange={(e) => onRateChange(e, "ratting")} options={rating} optionLabel="name" />
                                    {submitted && !result.ratting && <small className="p-invalid text-danger">Rate this task to continue</small>}
                                </div>
                            </div>
                        </Dialog>
                        <Dialog visible={submitFinalDialog} style={{ width: "450px" }} header="Submit Result" modal footer={submitResultDialogFooter} onHide={hideDialog}>
                            <div className="p-fluid">
                                <div className="formgrid grid">
                                    <div className="field col">
                                        <h5>Are you sure you want to submit?</h5>
                                    </div>
                                </div>
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

export default React.memo(Assessmentdtl, comparisonFn);
