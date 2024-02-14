import React, { useState, useEffect, useRef } from "react";
import { BASE_COLOR } from "../../../services/Settings";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { SplitButton } from "primereact/splitbutton";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { getData, postData } from "../../../services/AccessAPI";
import { classNames } from "primereact/utils";
import { Checkbox } from "primereact/checkbox";
import { today } from "./minDate";

const AnnualPlans = () => {
    const emptyResult = {
        employeeId: "",
        coachingstrdat: "",
        coachingenddat: "",
        assessmentstrdat: "",
        assessmentenddat: "",
        plcodes: "",
        history: false,
    };
    const pl = {
        Pldescription: "",
        Pllevel: "",
        Compduration: "",
    };
    const queryResult = {
        EmployeeId: "",
        Costcntcode: "",
        Plcodes: "",
    };
    const [error, setError] = useState("");
    const [values, setValues] = useState(null);
    const [plValue, setPlValue] = useState(pl);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [dialogLoading, setDialogLoading] = useState(false);
    const [waiting, setWaiting] = useState(false);
    const [querires, setQueries] = useState(queryResult);
    const [result, setResult] = useState(emptyResult);
    const [resultDialog, setResultDialog] = useState(false);
    const [autoValue, setAutoValue] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [requestDialog, setRequestDialog] = useState(false);
    const [confirmDialog, setConfirmDialog] = useState(false);
    const toast = useRef(null);
    const dt = useRef(null);
    const coachingStart = useRef(null);
    const assessmentStart = useRef(null);
    const assessmentEnd = useRef(null);
    useEffect(() => {
        fetchData();
    }, []);
    const fetchData = () => {
        setLoading(true);
        getData(`/Planning/Coachingreplans/Getplannedemployees`, "Coachingreplans-Getplannedemployees")
            .then((data) => {
                if (data) {
                    setAutoValue(data.data);
                }
            })
            .catch(() => {
                toast.current.show({ severity: "error", summary: "Error", detail: "Some error on fetching data", life: 5000 });
            })
            .finally(() => {
                setLoading(false);
            });
    };
    const confirmReplan = () => {
        let strMonth = new Date(result.coachingstrdat).getMonth();
        let endMonth = new Date(result.coachingenddat).getMonth();
        let strYear = new Date(result.coachingstrdat).getFullYear();
        let endYear = new Date(result.coachingenddat).getFullYear();
        endMonth = endMonth + 12 * (endYear - strYear);
        let diff = Math.abs(endMonth - strMonth);
        setSubmitted(true);
        if (!result.coachingstrdat || !result.coachingenddat || !result.coachingenddat || !result.assessmentstrdat) {
            setError("Error in Employee Information");
        } else if (diff > plValue.Compduration) {
            setError("This PL maximum duration is " + plValue.Compduration + " Months. Please edit coaching end date.");
        } else if (result.coachingenddat > result.assessmentstrdat) {
            setError("Assessment date should after Coaching end date ");
        } else if (result.assessmentenddat < result.assessmentstrdat) {
            setError("Assessment end Date must greater than Assessment start Date.");
        } else {
            setConfirmDialog(true);
        }
    };
    const saveChanges = () => {
        let strMonth = new Date(result.coachingstrdat).getMonth();
        let endMonth = new Date(result.coachingenddat).getMonth();
        let strYear = new Date(result.coachingstrdat).getFullYear();
        let endYear = new Date(result.coachingenddat).getFullYear();
        endMonth = endMonth + 12 * (endYear - strYear);
        let diff = Math.abs(endMonth - strMonth);
        setSubmitted(true);
        if (!result.coachingstrdat || !result.coachingenddat || !result.coachingenddat || !result.assessmentstrdat) {
            setError("Error in Employee Information");
        } else if (diff > plValue.Compduration) {
            setError("This PL maximum duration is " + plValue.Compduration + " Months. Please edit coaching end date.");
        } else if (result.coachingenddat > result.assessmentstrdat) {
            setError("Assessment date should after Coaching end date ");
        } else if (result.assessmentenddat < result.assessmentstrdat) {
            setError("Assessment end Date must greater than Assessment start Date.");
        } else {
            if (result) {
                setWaiting(true);
                postData(`/Planning/Coachingreplans/Replanningplans?history=${result.history}&Remarks=replanAction`, result, "Coachingreplans-Replanningplans")
                    .then((res) => {
                        if (res.data.Status === 3) {
                            setMessage(res.Message);
                            setResultDialog(false);
                            toast.current.show({ severity: "success", summary: "Successful", detail: "Result Saved!", life: 3000 });
                            fetchData();
                        } else {
                            setMessage(res.data.Message);
                            toast.current.show({ severity: "error", summary: "Oops! ", detail: `${res.data.Message}`, life: 5000 });
                        }
                    })
                    .catch(() => {})
                    .finally(() => {
                        setWaiting(false);
                        hideRequestDialog();
                    });
            }
        }
    };

    const hideDialog = () => {
        setError("");
        setMessage("");
        setPlValue([]);
        setResult(emptyResult);
        setResultDialog(false);
    };
    const hideRequestDialog = () => {
        setSubmitted(false);
        setRequestDialog(false);
        setConfirmDialog(false);
        setQueries(queryResult);
    };
    const requestResult = async () => {
        setWaiting(true);
        await postData(`/GeneralMasters/PlanningRequests/RequestforPlanning?EmployeeId=${querires.EmployeeId}&Costcenters=${querires.Costcntcode}&Plcodes=${querires.Plcodes}`, "", "PlanningRequests-RequestforPlanningr")
            .then((res) => {
                if (res.data.Status === 3) {
                    toast.current.show({ severity: "success", summary: "Successulful", detail: "Request Sent!", life: 3000 });
                    fetchData();
                } else {
                    toast.current.show({ severity: "error", summary: "Unsuccessulful", detail: `${res.data.Message}`, life: 5000 });
                }
            })
            .finally(() => {
                hideRequestDialog();
                setWaiting(false);
            });
    };
    const planresult = (rowData) => {
        setResultDialog(true);
        result["employeeId"] = rowData.EmployeeId;
        result["plcodes"] = rowData.Plcodes;
        setDialogLoading(true);
        getData(`GeneralMasters/Plheader/GetbyPlCode?Plcodes=${rowData.Plcodes}`, `Plheader-GetbyPlCode`)
            .then((res) => {
                setPlValue(res.data);
            })
            .catch(() => {})
            .finally(() => {
                setDialogLoading(false);
            });
        setValues(rowData.Firstname + " " + rowData.Middlename);
    };
    const openRequestDialog = (rowData) => {
        setQueries(rowData);
        setRequestDialog(true);
    };
    const onInputChange = (e, name) => {
        setMessage("");
        let _result = { ...result };
        _result[`${name}`] = e.checked;
        setResult(_result);
    };
    const onDateChange = (e, name) => {
        setMessage("");
        const val = (e.target && e.target.value) || "";
        let _result = { ...result };
        let date = new Date(val);
        _result[`${name}`] = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        let newMonth = date.getMonth();
        let updatedMonth = newMonth + plValue.Compduration;
        date.setMonth(updatedMonth);
        _result["coachingenddat"] = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        let assDate = date.getDate();
        let updatedDate = assDate + 1;
        let updatedAssDate = assDate + 2;
        date.setDate(updatedDate);
        _result["assessmentstrdat"] = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        date.setDate(updatedAssDate);
        _result["assessmentenddat"] = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        setResult(_result);
    };
    const onAssessmentDateChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _result = { ...result };
        _result[`${name}`] = new Date(Date.UTC(val.getFullYear(), val.getMonth(), val.getDate()));
        setResult(_result);
    };

    const resultDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text btn-success" onClick={hideDialog} />
            <Button label="Save Changes" icon="pi pi-save" style={{ backgroundColor: BASE_COLOR }} className="btn-danger" onClick={confirmReplan} />
        </>
    );
    const requestDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text btn-success" onClick={hideRequestDialog} />
            {waiting ? <Button label="Sending" icon="pi pi-spin pi-spinner" style={{ backgroundColor: BASE_COLOR }} disabled={true} /> : <Button label="Proceed" icon="pi pi-check" style={{ backgroundColor: BASE_COLOR }} className="btn-danger" onClick={requestResult} />}
        </>
    );
    const confirmDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text btn-success" onClick={hideRequestDialog} />
            {waiting ? <Button label="Sending" icon="pi pi-spin pi-spinner" style={{ backgroundColor: BASE_COLOR }} disabled={true} /> : <Button label="Proceed" icon="pi pi-check" style={{ backgroundColor: BASE_COLOR }} className="btn-danger" onClick={saveChanges} />}
        </>
    );
    const items = (data) => {
        const result = [];
        if (data.Checkrequest === 2) {
            result.push({
                label: "Add",
                icon: "pi pi-plus",
                command: () => {
                    planresult(data);
                },
            });
        } else if (data.Checkrequest === 3) {
            result.push({
                label: "Replan Request",
                command: () => {
                    openRequestDialog(data);
                },
            });
        } else {
            result.push({
                label: "Waiting",
                disabled: true,
            });
        }
        return result;
    };
    const planBodyTemplate = (rowData) => {
        return <SplitButton label="Action" className="p-button-raised p-button-success p-button-text mr-2 mb-2" model={items(rowData)} onClick={(e) => items(rowData)}></SplitButton>;
    };
    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <div className="my-2">
                <h4 className="m-0">Coaching Replan</h4>
            </div>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    return (
        <>
            <div className="grid crud-demo">
                <div className="col-12">
                    <div className="card">
                        <Toast ref={toast} />
                        <DataTable
                            ref={dt}
                            value={autoValue}
                            loading={loading}
                            dataKey="id"
                            paginator
                            rows={10}
                            rowsPerPageOptions={[5, 10, 25]}
                            className="datatable-responsive"
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} results"
                            globalFilter={globalFilter}
                            emptyMessage="No results found."
                            header={header}
                            responsiveLayout="scroll"
                        >
                            <Column field="EmployeeId" header="Employee Id" filter sortable body="" headerStyle={{ width: "13%", minWidth: "10rem" }} className="p-column-title"></Column>
                            <Column field="Firstname" header="First Name" filter sortable body="" headerStyle={{ width: "13%", minWidth: "10rem" }} className="p-column-title"></Column>
                            <Column field="Middlename" header="Middle Name" filter body="" headerStyle={{ width: "13%", minWidth: "8rem" }} className="p-column-title"></Column>
                            <Column field="Lastname" header="Last Name" filter body="" headerStyle={{ width: "13%", minWidth: "8rem" }} className="p-column-title"></Column>
                            <Column field="Costcntname" header="Cost center" body="" headerStyle={{ width: "15%", minWidth: "8rem" }} className="p-column-title"></Column>
                            <Column field="Plcodes" header="PL Code" body="" headerStyle={{ width: "15%", minWidth: "8rem" }} className="p-column-title"></Column>
                            <Column header="Action" headerStyle={{ width: "37%", minWidth: "0.5rem" }} body={planBodyTemplate}></Column>
                        </DataTable>
                        <Dialog visible={resultDialog} style={{ width: "1000px" }} header="" modal className="p-fluid" footer={resultDialogFooter} onHide={hideDialog}>
                            <div className="text-danger text-center">
                                <p> {message}</p>
                            </div>
                            <div className="card">
                                <h5 className="text-center">Annual Replan</h5>
                                <span className="text-danger">{error}</span>
                                <p>{values}</p>
                                <div className="grid formgrid">
                                    <div className="col-12 mb-2 lg:col-4 lg:mb-0">
                                        <br />
                                        <label>PL </label>
                                        <InputText value={result.plcodes || ""} readOnly />
                                        {submitted && !result.plcodes && <small className="p-invalid text-danger">PL is required.</small>}
                                    </div>
                                    <div className="col-12 mb-2 lg:col-4 lg:mb-0">
                                        <br />
                                        <label>PL Name</label>
                                        <InputText type="text" value={plValue.Pldescription || ""} readOnly placeholder={dialogLoading ? "Loading.." : ""} />
                                    </div>
                                    <div className="col-12 mb-2 lg:col-4 lg:mb-0">
                                        <br />
                                        <label>PL Level </label>
                                        <InputText type="text" value={plValue.Pllevel || ""} readOnly placeholder={dialogLoading ? "Loading.." : ""} />
                                    </div>
                                </div>
                                <div className="grid formgrid">
                                    <div className="col-12 mb-2 lg:col-4 lg:mb-0">
                                        <br />
                                        <label>Coaching start date </label>
                                        <input
                                            type="text"
                                            ref={coachingStart}
                                            onFocus={() => (coachingStart.current.type = "date")}
                                            onBlur={() => (coachingStart.current.type = "text")}
                                            onChange={(e) => onDateChange(e, "coachingstrdat")}
                                            className={"datePicker " + classNames({ "p-invalid": submitted && !result.coachingstrdat })}
                                            min={today}
                                        />
                                        {submitted && !result.coachingstrdat && <span className="text-danger">Required</span>}
                                    </div>
                                    <div className="col-12 mb-2 lg:col-4 lg:mb-0">
                                        <br />
                                        <label>Coaching end date </label>
                                        <Calendar id="minmax" value={result.coachingenddat || ""} disabled={true} readOnlyInput />
                                        {submitted && !result.coachingenddat && <span className="text-danger">Required</span>}
                                    </div>
                                    <div className="col-12 mb-2 lg:col-4 lg:mb-0">
                                        <br />
                                        <label>PL Duration (in month)</label>
                                        <InputText type="text" value={plValue.Compduration || ""} readOnly placeholder={dialogLoading ? "Loading.." : ""} />
                                    </div>
                                    <div className="col-12 mb-2 lg:col-4 lg:mb-0">
                                        <br />

                                        <label>Assessment start date </label>
                                        <input
                                            type="text"
                                            ref={assessmentStart}
                                            placeholder={result.assessmentstrdat ? new Date(result.assessmentstrdat).toLocaleString().split(",")[0] : ""}
                                            onFocus={() => (assessmentStart.current.type = "date")}
                                            onBlur={() => (assessmentStart.current.type = "text")}
                                            onChange={(e) => onAssessmentDateChange(e, "assessmentstrdat")}
                                            className={"datePicker " + classNames({ "p-invalid": submitted && !result.assessmentstrdat })}
                                            min={result.coachingenddat}
                                        />
                                        {submitted && !result.assessmentstrdat && <span className="text-danger">Required</span>}
                                    </div>
                                    <div className="col-12 mb-2 lg:col-4 lg:mb-0">
                                        <br />
                                        <label>Assessment end date </label>
                                        <input
                                            type="text"
                                            ref={assessmentEnd}
                                            placeholder={result.assessmentenddat ? new Date(result.assessmentenddat).toLocaleString().split(",")[0] : ""}
                                            onFocus={() => (assessmentEnd.current.type = "date")}
                                            onBlur={() => (assessmentEnd.current.type = "text")}
                                            onChange={(e) => onAssessmentDateChange(e, "assessmentenddat")}
                                            className={"datePicker " + classNames({ "p-invalid": submitted && !result.assessmentenddat })}
                                            min={result.coachingenddat}
                                        />
                                        {submitted && !result.assessmentenddat && <span className="text-danger">Required</span>}
                                    </div>
                                    <div className="col-12 mb-2 lg:col-4 lg:mb-0">
                                        <br />
                                        <br />
                                        <Checkbox
                                            id="history"
                                            value={result.history}
                                            onChange={(e) => {
                                                onInputChange(e, "history");
                                            }}
                                            checked={result.history}
                                        />
                                        <label htmlFor="history"> &nbsp; Inherit History</label>
                                    </div>
                                </div>
                            </div>
                        </Dialog>
                        <Dialog visible={requestDialog} style={{ width: "450px" }} header="Are you Sure!" modal className="p-fluid" footer={requestDialogFooter} onHide={hideRequestDialog}>
                            <h5 className="text">Request Annual Re Planning for {querires.EmployeeId}</h5>
                        </Dialog>
                        <Dialog visible={confirmDialog} style={{ width: "450px" }} header="Are you Sure!" modal className="p-fluid" footer={confirmDialogFooter} onHide={hideRequestDialog}>
                            <h5 className="text">
                                Re Planning for {result.employeeId}. {result.history ? "" : <p className="text-danger">This action resets all previous works.</p>}
                            </h5>
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

export default React.memo(AnnualPlans, comparisonFn);
