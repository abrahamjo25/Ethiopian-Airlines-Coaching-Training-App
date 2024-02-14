import React, { useState, useEffect, useRef } from "react";
import { BASE_COLOR } from "../../services/Settings";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import "../../assets/css/style.css";
import { getData, putData } from "../../services/AccessAPI";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { useHistory, useLocation } from "react-router-dom";
import "../../assets/css/DataTableDemo.css";
import { InputText } from "primereact/inputtext";

const Coachingdtl = () => {
    let emptyResult = {
        id: null,
        ratting: null,
        remark: null,
    };

    const [result, setResult] = useState(emptyResult);
    const [waiting, setWaiting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [dialogLoading, setDialogLoading] = useState(false);
    const [coachingStatus, setCoachingStatus] = useState(false);
    const [acceptDialog, setAcceptDialog] = useState(false);
    const [rejectDialog, setRejectDialog] = useState(false);
    const [selectitem, setSelectitem] = useState(null);
    const [task, setTask] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [signPlanValue, setSignPlanValue] = useState(null);
    const [submitFinalDialog, setSubmitFinalDialog] = useState(false);
    const toast = useRef(null);
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
            history.push("/coach-action");
        }
    }, []);

    const hideDialog = () => {
        setAcceptDialog(false);
        setRejectDialog(false);
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
    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _result = { ...result };
        _result[`${name}`] = val;
        setResult(_result);
    };
    const onPlanSelect = (e) => {
        const selectedIds = e.value.map((selectedTask) => selectedTask.id);
        setResult({ ...result, ids: selectedIds });
        setSelectitem(e.value);
    };
    const openNew = async (data) => {
        setDialogLoading(true);
        await getTask(data?.id);
        await getCoachingStatus(data?.id);
    };
    const getTask = async (id) => {
        await getData(`/Coaching/GetForCoach?annualPlanId=${id}`, "Coaching-Sign")
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
    const getCoachingStatus = async (id) => {
        await getData(`/Coaching/GetStatusById?annualPlanId=${id}`, "Coaching-Sign").then((res) => {
            setCoachingStatus(res?.data?.coachingStatus);
        });
    };
    const saveResult = async () => {
        setSubmitted(true);
        if (result.id && result.ratting) {
            let _result = { ...result };
            setWaiting(true);
            try {
                let data = await putData(`/Coaching/CoachApprove`, _result, "Coaching-Sign");
                if (data) {
                    setTask((prev) =>
                        prev.map((item) => {
                            if (item.id === data.id) {
                                return { ...item, coachApproval: data.coachApproval };
                            }
                            return item;
                        })
                    );
                    getCoachingStatus(signPlanValue?.id);
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
    const rejectResult = async () => {
        setSubmitted(true);
        if (result.id && result.remark) {
            let _result = { ...result };
            setWaiting(true);
            try {
                let data = await putData(`/Coaching/CoachReject`, _result, "Coaching-Sign");
                if (data) {
                    setTask((prev) =>
                        prev.map((item) => {
                            if (item.id === data.id) {
                                return { ...item, coachApproval: data.coachApproval };
                            }
                            return item;
                        })
                    );
                    setRejectDialog(false);
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
        setWaiting(true);
        try {
            let data = await putData(`/Coaching/ProcessCoaching?annualPlanId=${signPlanValue?.id}`, "", "Coaching-Sign");
            if (data) {
                history.push("/coach-action");
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
        _result["id"] = data?.id;
        setResult(_result);
        setAcceptDialog(true);
    };
    const rejectSign = (data) => {
        let _result = { ...result };
        _result["id"] = data?.id;
        setResult(_result);
        setRejectDialog(true);
    };
    const resultDialogFooter = (rowData) => {
        return (
            <div className="text-right">
                <React.Fragment>
                    <Button label="Submit Result" icon="pi pi-sign-in" disabled={!coachingStatus} style={{ backgroundColor: BASE_COLOR }} className="btn-danger" onClick={() => setSubmitFinalDialog(true)} />
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
    const rejectResultDialogFooter = (rowData) => {
        return (
            <div className="text-right">
                <React.Fragment>
                    {waiting ? <Button label="Saving.." icon="pi pi-spin pi-spinner" style={{ backgroundColor: BASE_COLOR }} disabled={true} /> : <Button label="Reject" icon="pi pi-sign-in" style={{ backgroundColor: BASE_COLOR }} className="btn-danger" onClick={() => rejectResult(rowData)} />}
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
        if (rowData?.coachApproval === "CoachAction" || rowData.coachApproval === "Rejected") {
            return (
                <>
                    <Button icon="pi pi-pencil" onClick={() => acceptSign(rowData)} className="p-button-rounded mr-2 p-button-info" tooltip="Edit" tooltipOptions={{ position: "top" }} />
                </>
            );
        } else {
            return (
                <>
                    <Button icon="pi pi-check" onClick={() => acceptSign(rowData)} className="p-button-rounded mr-2" tooltip="Accept" tooltipOptions={{ position: "top" }} />
                    <Button icon="pi pi-times" onClick={() => rejectSign(rowData)} className="p-button-rounded p-button-danger" tooltip="Reject" tooltipOptions={{ position: "top" }} />
                </>
            );
        }
    };
    const ataTemplate = (rowData) => {
        if (rowData?.ataChapter) {
            return <span className="customer-badge">{rowData?.ataChapter}</span>;
        } else {
            return <span className="customer-badge">None</span>;
        }
    };
    const tsfnTemplate = (rowData) => {
        if (rowData?.tsfn) {
            return <span className="customer-badge">{rowData?.tsfn}</span>;
        } else {
            return <span className="customer-badge">None</span>;
        }
    };
    const statusBody = (rowData) => {
        if (rowData?.coachApproval === "CoachAction") {
            return <span className={"customer-badge " + rowData?.coachApproval}>Signed</span>;
        } else {
            return <span className={"customer-badge " + rowData?.coachApproval}>{rowData?.coachApproval}</span>;
        }
    };
    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h4 className="m-0">Sign for tasks</h4>
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
                        <Toast ref={toast} />
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
                                selection={selectitem}
                                onSelectionChange={(e) => onPlanSelect(e)}
                                dataKey="id"
                                paginator
                                rows={10}
                                rowsPerPageOptions={[5, 10, 25]}
                                className="p-datatable-responsive-demo"
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} results"
                                globalFilter={globalFilter}
                                emptyMessage="No results found."
                                footer={resultDialogFooter}
                                header={header}
                            >
                                <Column field="" header="No" body={rowCount} className="p-column-title"></Column>
                                <Column field="taskCode" header="Category" className="p-column-title"></Column>
                                <Column field="task" header="Task" className="p-column-title"></Column>
                                <Column field="coachingAction" header="Coaching" className="p-column-title"></Column>
                                <Column field="ataChapter" header="ATA" body={ataTemplate} className="p-column-title"></Column>
                                <Column field="tsfn" header="TSFN" body={tsfnTemplate} className="p-column-title"></Column>
                                <Column field="coachApproval" header="Status" body={statusBody} className="p-column-title"></Column>
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
                        <Dialog visible={rejectDialog} style={{ width: "450px" }} header="Confirm Reject" modal footer={rejectResultDialogFooter} onHide={hideDialog}>
                            <div className="p-fluid">
                                <div className="formgrid grid">
                                    <div className="field col">
                                        <InputTextarea id="remark" cols={25} rows={5} placeholder="Write your remark" value={result.remark} onChange={(e) => onInputChange(e, "remark")} autoResize required className={classNames({ "p-invalid": submitted && !result.remark })} />
                                        {submitted && !result.remark && <span className="text-danger">This field is required!</span>}
                                    </div>
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

export default React.memo(Coachingdtl, comparisonFn);
