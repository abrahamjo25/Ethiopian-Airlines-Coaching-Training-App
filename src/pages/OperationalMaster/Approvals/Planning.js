import React, { useState, useEffect, useRef } from "react";
import { BASE_COLOR } from "../../../services/Settings";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { putData, getData, deleteData } from "../../../services/AccessAPI";
import { Tooltip } from "primereact/tooltip";
import moment from "moment/moment";
import { SplitButton } from "primereact/splitbutton";
import { InputTextarea } from "primereact/inputtextarea";
import { classNames } from "primereact/utils";
import { today } from "../../Planning/AnnualPlan/minDate";
import "../../../assets/css/DataTableDemo.css";

const Planning = () => {
    let emptyResult = {
        id: null,
        coachingStartDate: "",
        coachingEndDate: "",
        assessmentStartDate: "",
        assessmentEndDate: "",
        plCode: null,
    };
    const [loading, setLoading] = useState(false);
    const [waiting, setWaiting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [result, setResult] = useState(emptyResult);
    const [results, setResults] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [rejectResultDialog, setRejectResultDialog] = useState(false);
    const [editResultDialog, setEditResultDialog] = useState(false);
    const [terminateResultDialog, setTerminateResultDialog] = useState(false);

    const [approveResultDialog, setapproveResultDialog] = useState(false);
    const [message, setMessage] = useState("");

    const coachingEnd = useRef(null);
    const assessmentStart = useRef(null);
    const assessmentEnd = useRef(null);

    const dt = useRef(null);
    useEffect(() => {
        const fetchData = () => {
            setLoading(true);
            getData(`/AnnualPlan/GetByDivision`, "AnnualPlan-Approval")
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
        fetchData();
    }, []);

    //Create new

    const hideDialog = () => {
        setResult(emptyResult);
        setapproveResultDialog(false);
        setRejectResultDialog(false);
        setEditResultDialog(false);
        setTerminateResultDialog(false);
    };
    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _result = { ...result };
        _result[`${name}`] = val;
        setResult(_result);
    };
    const onDateChange = (e, name) => {
        const val = e.target.value;
        let _result = { ...result };
        _result[`${name}`] = val;
        setResult(_result);
    };

    const onAssessmentDateChange = (e, name) => {
        const val = e.target.value;
        setResult((prevResult) => ({
            ...prevResult,
            [name]: val,
        }));
    };
    const confirmapprove = async () => {
        setWaiting(true);
        let data = await putData(`/AnnualPlan/HRApproval?id=${result?.id}`, "", "AnnualPlan-Approval");
        if (data) {
            setResults((prev) =>
                prev?.map((item) => {
                    if (item?.id === data?.id) {
                        return { ...item, aproval: "HRApproved" };
                    }
                    return item;
                })
            );
            setapproveResultDialog(false);
            setResult(emptyResult);
        }
        setWaiting(false);
    };
    const confirmReject = async () => {
        setSubmitted(true);
        if (result?.id && result?.remark) {
            setWaiting(true);
            let data = await putData(`/AnnualPlan/HRReject`, result, "AnnualPlan-Approval");
            if (data) {
                setResults((prev) =>
                    prev?.map((item) => {
                        if (item?.id === data?.id) {
                            return { ...item, aproval: "Rejected" };
                        }
                        return item;
                    })
                );
                setapproveResultDialog(false);
                setResult(emptyResult);
            }
            setWaiting(false);
            setSubmitted(false);
        }
    };
    const editPlan = async () => {
        setSubmitted(true);
        if (result?.employeeId && result?.plCode && result?.coachingStartDate && result?.coachingEndDate && result?.assessmentStartDate && result?.assessmentEndDate) {
            const isValidDate = isDateValid();
            if (isValidDate) {
                setWaiting(true);
                let data = await putData(`/AnnualPlan/Update`, result, "AnnualPlan-Approval");
                if (data) {
                    setResults((prev) =>
                        prev?.map((item) => {
                            if (item?.id === result?.id) {
                                return result;
                            }
                            return item;
                        })
                    );
                    setEditResultDialog(false);
                    setResult(emptyResult);
                }
                setWaiting(false);
                setSubmitted(false);
            }
        }
    };
    const saveTermination = async () => {
        setSubmitted(true);
        if (result?.id) {
            setWaiting(true);
            let data = await deleteData(`/AnnualPlan/Delete?id=${result?.id}`, "AnnualPlan-Approval");
            if (data) {
                setResults(results.filter((key) => key.id !== data?.id));
                setTerminateResultDialog(false);
                setResult(emptyResult);
            }
            setWaiting(false);
            setSubmitted(false);
        }
    };
    const isDateValid = () => {
        const coachStartDate = new Date(result?.coachingStartDate);
        const coachEndDate = new Date(result?.coachingEndDate);
        const assessmentStartDate = new Date(result?.assessmentStartDate);
        const assessmentEndDate = new Date(result?.assessmentEndDate);

        const twoMonthsLater = new Date(coachStartDate);
        twoMonthsLater.setMonth(coachStartDate.getMonth() + result?.duration);
        if (coachEndDate < twoMonthsLater) {
            setMessage("Invalid Coaching dates. Select Coach start date again");
            return false;
        }

        // Check if Assessment Start Date is after Coaching End Date
        if (assessmentStartDate < coachEndDate) {
            setMessage("Assessment must start after coaching end date.");
            return false;
        }

        // Check if Assessment Start Date is after Coaching End Date
        if (assessmentEndDate < assessmentStartDate) {
            setMessage("Assessment end date must after assessment start date.");
            return false;
        }

        // All conditions are satisfied
        return true;
    };

    const approveResult = (data) => {
        setResult(data);
        setapproveResultDialog(true);
    };

    const items1 = (data) => [
        {
            label: "Approve",
            icon: "pi pi-check",
            command: (e) => {
                approveResult(data);
            },
        },
        {
            label: "Reject",
            icon: "pi pi-times",
            command: (e) => {
                setResult(data);
                setRejectResultDialog(true);
            },
        },
    ];
    const items2 = (data) => [
        {
            label: "Edit",
            icon: "pi pi-pencil",
            command: () => {
                setResult(data);
                setEditResultDialog(true);
            },
        },
        {
            template: () => terminate(data),
        },
    ];
    const terminate = (data) => {
        return (
            <>
                <Button label="Terminate" icon="pi pi-trash" className="p-button-danger p-button-text" onClick={() => terminatePlan(data)} />
            </>
        );
    };
    const terminatePlan = (data) => {
        setResult(data);
        setTerminateResultDialog(true);
    };
    const actionBodyTemplate = (data) => {
        if (data?.aproval !== "HRApproved") {
            return <SplitButton label="Manage" className="p-button-raised p-button-success p-button-text mr-2 mb-2" model={items1(data)} onClick={() => items1(data)}></SplitButton>;
        }
        //  else {
        //     return <SplitButton label="Manage" className="p-button-raised p-button-success p-button-text mr-2 mb-2" model={items2(data)} onClick={() => items2(data)}></SplitButton>;
        // }
    };
    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h4 className="m-0">Annual plan List</h4>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const approveResultDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            {waiting ? <Button label="Saving" icon="pi pi-spin pi-spinner" style={{ backgroundColor: BASE_COLOR }} disabled={true} /> : <Button label="Yes" icon="pi pi-check" style={{ backgroundColor: BASE_COLOR }} className="" onClick={confirmapprove} />}
        </>
    );
    const rejectResultDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            {waiting ? <Button label="Saving" icon="pi pi-spin pi-spinner" style={{ backgroundColor: BASE_COLOR }} disabled={true} /> : <Button label="Yes" icon="pi pi-check" style={{ backgroundColor: BASE_COLOR }} className="" onClick={confirmReject} />}
        </>
    );
    const editResultDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            {waiting ? <Button label="Saving" icon="pi pi-spin pi-spinner" style={{ backgroundColor: BASE_COLOR }} disabled={true} /> : <Button label="Update" icon="pi pi-save" style={{ backgroundColor: BASE_COLOR }} className="" onClick={editPlan} />}
        </>
    );
    const terminateResultDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            {waiting ? <Button label="Deleting" icon="pi pi-spin pi-spinner" className="p-button-danger" disabled={true} /> : <Button label="Terminate" icon="pi pi-trash" className="p-button-danger" onClick={saveTermination} />}
        </>
    );
    const statusBody = (data) => {
        return (
            <>
                <Tooltip target=".customer-badge" position="top" />
                <span className={"customer-badge " + data?.aproval} data-pr-tooltip={data?.remark}>
                    {data?.aproval}
                </span>
            </>
        );
    };
    const coachingBody = (data) => {
        return (
            <span>
                {moment(data?.coachingStartDate).format("MMM Do YY")} - {moment(data?.coachingEndDate).format("MMM Do YY")}
            </span>
        );
    };
    const assessmentBody = (data) => {
        return (
            <span>
                {moment(data?.assessmentStartDate).format("MMM Do YY")} - {moment(data?.assessmentEndDate).format("MMM Do YY")}
            </span>
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
    return (
        <div className="datatable-responsive-demo">
            <DataTable
                ref={dt}
                value={results}
                dataKey="id"
                paginator
                loading={loading}
                rows={6}
                rowsPerPageOptions={[5, 15, 25]}
                className="datatable-responsive p-datatable-responsive-demo"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} results"
                globalFilter={globalFilter}
                emptyMessage="No results found."
                header={header}
            >
                <Column header="No" body={rowCount}></Column>
                <Column field="employeeId" header="Id" filter sortable></Column>
                <Column field="fullName" header="Name"></Column>
                <Column field="plCode" header="PL"></Column>
                <Column field="coachingStartDate" header="Coaching" body={coachingBody}></Column>
                <Column field="assessmentStartDate" header="Assessment" body={assessmentBody}></Column>
                <Column field="aproval" header="Status" body={statusBody}></Column>
                <Column header="Action" body={actionBodyTemplate}></Column>
            </DataTable>
            <Dialog visible={approveResultDialog} style={{ width: "450px" }} header="Confirm" modal footer={approveResultDialogFooter} onHide={hideDialog}>
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                    {result && <span>Are you sure you want to approve?</span>}
                </div>
            </Dialog>
            <Dialog visible={rejectResultDialog} style={{ width: "450px" }} header="Confirm" modal footer={rejectResultDialogFooter} onHide={hideDialog}>
                <div className="flex align-items-center justify-content-center">
                    <div className="formgrid grid">
                        <div className="field col">
                            <InputTextarea id="remark" cols={50} rows={3} value={result.remark} placeholder="Write a remark here." onChange={(e) => onInputChange(e, "remark")} autoResize required className={classNames({ "p-invalid": submitted && !result.remark })} />
                            {submitted && !result.remark && <small className="p-invalid text-danger">Remark is required.</small>}
                        </div>
                    </div>
                </div>
            </Dialog>
            <Dialog visible={editResultDialog} style={{ width: "500px" }} header="Edit Planning" modal footer={editResultDialogFooter} onHide={hideDialog}>
                <div className="">
                    <h6>{result?.fullName}</h6>
                    <hr />
                    <span className="text-danger">{message}</span>
                    <div className="grid formgrid">
                        <div className="col-12 mb-2 lg:col-6 lg:mb-0">
                            <label>Coaching Start </label>
                            <input id="minmax" value={result?.coachingEndDate || ""} disabled={true} readOnly className={"datePicker " + classNames({ "p-invalid": submitted && !result.coachingEndDate })} />
                            {submitted && !result.coachingEndDate && <span className="text-danger">Required</span>}
                        </div>
                        <div className="col-12 mb-2 lg:col-6 lg:mb-0">
                            <label>Coaching End </label>
                            <input
                                type="text"
                                ref={coachingEnd}
                                value={result?.coachingEndDate}
                                onFocus={() => (coachingEnd.current.type = "date")}
                                onBlur={() => (coachingEnd.current.type = "text")}
                                onChange={(e) => onDateChange(e, "coachingEndDate")}
                                className={"datePicker " + classNames({ "p-invalid": submitted && !result.coachingEndDate })}
                                min={today}
                            />
                            {submitted && !result.coachingEndDate && <span className="text-danger">Required</span>}
                        </div>
                    </div>
                    <div className="grid formgrid">
                        <div className="col-12 mb-2 lg:col-6 lg:mb-0">
                            <label>Assessment Start </label>
                            <input
                                type="text"
                                ref={assessmentStart}
                                value={result?.assessmentStartDate}
                                placeholder={result.assessmentStartDate ? new Date(result.assessmentStartDate).toLocaleString().split(",")[0] : ""}
                                onFocus={() => (assessmentStart.current.type = "date")}
                                onBlur={() => (assessmentStart.current.type = "text")}
                                onChange={(e) => onAssessmentDateChange(e, "assessmentStartDate")}
                                className={"datePicker " + classNames({ "p-invalid": submitted && !result.assessmentStartDate })}
                                min={result?.coachingEndDate}
                            />
                            {submitted && !result.assessmentStartDate && <span className="text-danger">Required</span>}
                        </div>
                        <div className="col-12 mb-2 lg:col-6 lg:mb-0">
                            <label>Assessment End </label>
                            <input
                                type="text"
                                ref={assessmentEnd}
                                value={result?.assessmentEndDate}
                                placeholder={result.assessmentEndDate ? new Date(result.assessmentEndDate).toLocaleString().split(",")[0] : ""}
                                onFocus={() => (assessmentEnd.current.type = "date")}
                                onBlur={() => (assessmentEnd.current.type = "text")}
                                onChange={(e) => onAssessmentDateChange(e, "assessmentEndDate")}
                                className={"datePicker " + classNames({ "p-invalid": submitted && !result.assessmentEndDate })}
                                min={result?.assessmentStartDate}
                            />
                            {submitted && !result.assessmentEndDate && <span className="text-danger">Required</span>}
                        </div>
                    </div>
                </div>
            </Dialog>
            <Dialog visible={terminateResultDialog} style={{ width: "450px" }} header="Are you sure!" modal footer={terminateResultDialogFooter} onHide={hideDialog}>
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3 text-warning" style={{ fontSize: "2rem" }} />
                    <span className="text-lg">This plan will no longer available.</span>
                </div>
            </Dialog>
        </div>
    );
};

export default Planning;
