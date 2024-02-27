import React, { useState, useEffect, useRef } from "react";
import { BASE_COLOR } from "../../../services/Settings";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { SplitButton } from "primereact/splitbutton";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { deleteData, getData, postData, putData } from "../../../services/AccessAPI";
import { classNames } from "primereact/utils";
import PlanAlert from "./PlanAlert";
import { today } from "./minDate";
import { Toolbar } from "primereact/toolbar";
import { Tooltip } from "primereact/tooltip";
import { InputTextarea } from "primereact/inputtextarea";
import moment from "moment";
import Coaches from "./Coaches";
import Assessors from "./Assessors";
import "../../../assets/css/DataTableDemo.css";
import { useHistory } from "react-router";

const AnnualPlans = () => {
    const emptyResult = {
        id: null, //Database employee Id
        employeeId: "", // Normale employee Id
        coachingStartDate: "",
        coachingEndDate: "",
        assessmentStartDate: "",
        assessmentEndDate: "",
        plCode: "",
        duration: null,
        fullName: "",
    };
    let replanData = {
        id: null, //annualPlan Id
        requestReason: "",
    };
    const [approveDialog, setApproveDialog] = useState(false);
    const [plValue, setPlValue] = useState(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [dialogLoading, setDialogLoading] = useState(false);
    const [taskResultDialog, setTaskResultDialog] = useState(false);
    const [waiting, setWaiting] = useState(false);
    const [result, setResult] = useState(emptyResult);
    const [coachingTasks, setCoachingTasks] = useState(null);
    const [results, setResults] = useState([]);
    const [assessorDialog, setAssessorDialog] = useState(false);
    const [coachDialog, setCoachDialog] = useState(false);
    const [replanDialog, setReplanDialog] = useState(false);
    const [resultDialog, setResultDialog] = useState(false);
    const [deleteResultDialog, setDeleteResultDialog] = useState(false);
    const [employee, setEmployee] = useState(null);
    const [planningDuration, setPlanningDuration] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [selected, setSelected] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const [replan, setReplan] = useState(replanData);
    const toast = useRef(null);
    const dt = useRef(null);
    const coachingStart = useRef(null);
    const assessmentStart = useRef(null);
    const assessmentEnd = useRef(null);
    useEffect(() => {
        fetchData();
    }, []);
    const history = useHistory();
    const fetchData = () => {
        setLoading(true);
        getData(`/AnnualPlan/GetByCostCenter`, "AnnualPlan-Index")
            .then((res) => {
                if (res) {
                    setResults(res.data);
                }
            })
            .catch(() => {
                toast.current.show({ severity: "error", summary: "Error", detail: "Some error on fetching data", life: 5000 });
            });
        getData(`/PlanDuration/GetByCostcenter`, "AnnualPlan-Index")
            .then((res) => {
                if (res) {
                    setPlanningDuration(res.data);
                }
            })
            .catch(() => {
                toast.current.show({ severity: "error", summary: "Error", detail: "Some error on fetching data", life: 5000 });
            })
            .finally(() => {
                setLoading(false);
            });
    };
    const saveResult = async () => {
        setSubmitted(true);
        if (result?.employeeId && result?.plCode && result?.coachingStartDate && result?.coachingEndDate && result?.assessmentStartDate && result?.assessmentEndDate) {
            const isValidDate = isDateValid();
            if (isValidDate) {
                let _result = { ...result };
                if (isEdit) {
                    setWaiting(true);
                    setSubmitted(false);
                    let data = await putData(`/AnnualPlan/Update`, _result, "AnnualPlan-Index");
                    let newData = { ...data };
                    newData["fullName"] = result?.fullName;
                    if (data) {
                        setResults((prev) =>
                            prev.map((item) => {
                                if (item.id === data?.id) {
                                    return newData;
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
                    let data = await postData(`/AnnualPlan/Create`, _result, "AnnualPlan-Index");
                    if (data) {
                        let newData = { ...data };
                        newData["fullName"] = result?.fullName;
                        setResults((prev) => [...prev, newData]);
                        setResultDialog(false);
                        setResult(emptyResult);
                    }
                    setWaiting(false);
                }
            }
        }
    };
    const saveApproval = async () => {
        setWaiting(true);
        let data = await putData(`/AnnualPlan/MgrApproval?id=${result?.id}`, "", "AnnualPlan-Index");
        if (data) {
            setResults((prev) =>
                prev.map((item) => {
                    if (item.id === data?.id) {
                        return { ...item, aproval: data.aproval };
                    }
                    return item;
                })
            );
            setApproveDialog(false);
            setResult(emptyResult);
        }
        setWaiting(false);
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
    const deleteResult = async () => {
        setWaiting(true);
        let data = await deleteData(`/AnnualPlan/Delete?id=${result?.id}`, "AnnualPlan-Index");
        if (data) {
            setResults(results.filter((item) => item.id !== data?.id));
            setDeleteResultDialog(false);
            setResult(emptyResult);
        }
        setWaiting(false);
    };

    // Replan request
    const saveRequest = async () => {
        setWaiting(true);
        await postData(`/AnnualPlan/CreateReplan`, replan, "AnnualPlan-Index");
        setReplanDialog(false);
        setReplan(replanData);

        setWaiting(false);
    };
    const hideDialog = () => {
        setMessage("");
        setResult(emptyResult);
        setSelected(false);
        setResultDialog(false);
        setSubmitted(false);
        setIsEdit(false);
        setApproveDialog(false);
        setDeleteResultDialog(false);
        setCoachDialog(false);
        setAssessorDialog(false);
        setTaskResultDialog(false);
        setReplanDialog(false);
        setReplan(replanData);
    };

    const getEmployee = () => {
        setDialogLoading(true);
        getData(`/Employees/GetByCostCenter`, "AnnualPlan-Index")
            .then((res) => {
                setEmployee(res.data);
            })
            .catch((error) => {})
            .finally(() => {
                setDialogLoading(false);
            });
    };
    const getPL = () => {
        setDialogLoading(true);
        getData(`/PlHeader/GetByCostCenter`, "AnnualPlan-Index")
            .then((res) => {
                setPlValue(res.data);
            })
            .catch((error) => {})
            .finally(() => {
                setDialogLoading(false);
            });
    };
    const onDateChange = (e, name) => {
        const val = e.target.value;
        let endDate = calculateCoachingEndDate(val);
        setResult((prevResult) => ({
            ...prevResult,
            [name]: val,
            coachingEndDate: endDate,
        }));
    };

    const onAssessmentDateChange = (e, name) => {
        const val = e.target.value;
        setResult((prevResult) => ({
            ...prevResult,
            [name]: val,
        }));
    };

    const calculateCoachingEndDate = (startDate) => {
        if (!startDate) return "";
        const start = new Date(startDate);
        const end = new Date(start);
        end.setMonth(start.getMonth() + result?.duration);
        return end.toISOString().split("T")[0];
    };

    const onPLChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _result = { ...result };
        _result[`${name}`] = val?.plCode;
        _result[`duration`] = val?.duration;
        setResult(_result);
        setSelected(true);
    };
    const onEmployeeChange = (e, name) => {
        debugger;
        const val = (e.target && e.target.value) || "";
        let _result = { ...result };
        _result["id"] = val?.id;
        _result[`${name}`] = val?.employeeId;
        _result[`fullName`] = val?.fullName;
        setResult(_result);
    };
    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _replan = { ...replan };
        _replan[`${name}`] = val;
        setReplan(_replan);
    };
    const getReplan = (annualPlanId) => {
        let _replan = { ...replan };
        _replan["annualPlanId"] = annualPlanId;
        setReplan(_replan);
        setReplanDialog(true);
    };
    const resultDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text btn-success" onClick={hideDialog} />
            {waiting ? <Button label="Saving" icon="pi pi-spin pi-spinner" style={{ backgroundColor: BASE_COLOR }} disabled={true} /> : <Button label="Save" icon="pi pi-save" style={{ backgroundColor: BASE_COLOR }} className="btn-danger" onClick={saveResult} />}
        </>
    );
    const confirmApproval = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text btn-success" onClick={hideDialog} />
            {waiting ? <Button label="Saving" icon="pi pi-spin pi-spinner" style={{ backgroundColor: BASE_COLOR }} disabled={true} /> : <Button label="Yes" icon="pi pi-check" style={{ backgroundColor: BASE_COLOR }} className="btn-danger" onClick={saveApproval} />}
        </>
    );
    const deleteResultDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            {waiting ? <Button label="Deleting" icon="pi pi-spin pi-spinner" style={{ backgroundColor: BASE_COLOR }} disabled={true} /> : <Button label="Yes" icon="pi pi-check" style={{ backgroundColor: BASE_COLOR }} className="" onClick={deleteResult} />}
        </>
    );
    const replanDialogFooter = (
        <>
            <Button label="Cancle" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            {waiting ? <Button label="Saving" icon="pi pi-spin pi-spinner" style={{ backgroundColor: BASE_COLOR }} disabled={true} /> : <Button label="Send" icon="pi pi-check" style={{ backgroundColor: BASE_COLOR }} className="" onClick={saveRequest} />}
        </>
    );
    const items = (data) => [
        data?.aproval === "ManagerApproved" || data?.aproval === "HRApproved"
            ? {
                  label: "Approved",
                  disabled: true,
              }
            : {
                  label: "Approve",
                  icon: "pi pi-check",
                  command: () => {
                      setResult(data);
                      setApproveDialog(true);
                  },
              },
        data?.aproval !== "HRApproved"
            ? {
                  label: "Edit",
                  icon: "pi pi-pencil",
                  command: (e) => {
                      setIsEdit(true);

                      const date1 = moment(data?.coachingStartDate);
                      const date2 = moment(data?.coachingEndDate);

                      const monthDifference = date2.diff(date1, "months");
                      data["duration"] = monthDifference;
                      setResult(data);
                      openNew();
                  },
              }
            : {
                  label: "Coaches",
                  icon: "pi pi-user",
                  command: () => {
                      setResult(data);
                      setCoachDialog(true);
                  },
              },
        data?.aproval !== "HRApproved"
            ? {
                  label: "Remove",
                  icon: "pi pi-trash",
                  command: () => {
                      setResult(data);
                      setDeleteResultDialog(true);
                  },
              }
            : {
                  label: "Assessors",
                  icon: "pi pi-user",
                  command: () => {
                      setResult(data);
                      setAssessorDialog(true);
                  },
              },
        data?.aproval === "HRApproved"
            ? {
                  label: "Replan Request",
                  icon: "pi pi-replay",
                  command: () => {
                      getReplan(data?.id);
                  },
              }
            : "",
    ];
    const planBodyTemplate = (rowData) => {
        return <SplitButton label="Action" className="p-button-raised p-button-success p-button-text mr-2 mb-2" model={items(rowData)} onClick={(e) => items(rowData)}></SplitButton>;
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h4 className="m-0">Annual Plan</h4>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );
    const getTasks = (annualPlanId) => {
        setDialogLoading(true);
        setTaskResultDialog(true);
        getData(`/Coaching/GetByAnnualPlan?annualPlanId=${annualPlanId}`, "AnnualPlan-Index")
            .then((res) => {
                if (res.data) {
                    setCoachingTasks(res.data);
                }
            })
            .catch(() => {})
            .finally(() => {
                setDialogLoading(false);
            });
    };
    const approvalTemplate = (data) => {
        return (
            <>
                <Tooltip target=".customer-badge" position="top" />
                <span className={"customer-badge " + data?.aproval} data-pr-tooltip={data?.remark}>
                    {data?.aproval}
                </span>
            </>
        );
    };
    const tasksTemplate = (data) => {
        return (
            <>
                <Tooltip target=".task-List" position="top" />
                <i className="pi pi-eye text-success task-List" onClick={() => getTasks(data?.id)} data-pr-tooltip="click to view tasks"></i>
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
    const openNew = () => {
        getEmployee();
        getPL();
        setResultDialog(true);
    };
    const exportCSV = () => {
        dt.current.exportCSV();
    };
    const leftToolbar = () => {
        return (
            <React.Fragment>
                <div className="my-2">{new Date(planningDuration?.durationTo) >= new Date() && <Button label="New Plan" icon="pi pi-plus" style={{ backgroundColor: BASE_COLOR }} onClick={openNew} />}</div>
            </React.Fragment>
        );
    };
    const rightToolbar = () => {
        return (
            <React.Fragment>
                <Button label="Export CSV" icon="pi pi-download" style={{ backgroundColor: BASE_COLOR }} className="p-button-help" onClick={exportCSV} />
            </React.Fragment>
        );
    };
    return (
        <>
            <div className="datatable-responsive-demo grid crud-demo">
                <div className="col-12">
                    <div className="card">
                        <Toast ref={toast} />
                        <PlanAlert duration={planningDuration} loading={loading} />
                        <Toolbar left={leftToolbar} right={rightToolbar} />
                        <DataTable
                            ref={dt}
                            value={results}
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} results"
                            globalFilter={globalFilter}
                            emptyMessage="No results found."
                            header={header}
                            dataKey="Id"
                            paginator
                            rows={7}
                            loading={loading}
                            rowsPerPageOptions={[7, 15, 25]}
                            className="p-datatable-responsive-demo"
                        >
                            <Column field="employee.employeeId" header="ID" className="p-column-title"></Column>
                            <Column field="fullName" header="Name" className="p-column-title"></Column>
                            <Column field="plCode" header="PL" className="p-column-title"></Column>
                            <Column field="coachingStartDate" header="Coaching" body={coachingBody} className="p-column-title"></Column>
                            <Column field="assessmentStartDate" header="Assessment" body={assessmentBody} className="p-column-title"></Column>
                            <Column field="aproval" header="Status" body={approvalTemplate} sortable className="p-column-title"></Column>
                            <Column header="Tasks" body={tasksTemplate} className="p-column-title"></Column>
                            <Column header="Action" body={planBodyTemplate}></Column>
                        </DataTable>
                        <Dialog visible={resultDialog} style={{ width: "700px" }} header="" modal className="p-fluid" footer={resultDialogFooter} onHide={hideDialog}>
                            <div className="card">
                                <h5 className="text-center">Annual Plans</h5>
                                <span className="text-danger">{message}</span>
                                <div className="grid forgrid">
                                    <div className="col-12 mb-2 lg:col-6 lg:mb-0">
                                        <label>Employee Id </label>
                                        <Dropdown
                                            value={result.employeeId || ""}
                                            options={employee}
                                            onChange={(e) => onEmployeeChange(e, "employeeId")}
                                            emptyMessage="No employee found"
                                            optionLabel="employeeId"
                                            filter
                                            filterBy="employeeId"
                                            placeholder={dialogLoading ? "Loading..." : result.employeeId || "Select Employee"}
                                            disabled={dialogLoading}
                                        />
                                        {submitted && !result?.employeeId && <small className="p-invalid text-danger">Employee Id required.</small>}
                                    </div>
                                    <div className="col-12 mb-2 lg:col-6 lg:mb-0">
                                        <label>Employee Name </label>
                                        <InputText value={result?.fullName} readOnly />
                                    </div>
                                </div>
                                <div className="grid formgrid">
                                    <div className="col-12 mb-2 lg:col-6 lg:mb-0">
                                        <label>PL Id </label>
                                        <Dropdown
                                            value={result?.plCode}
                                            options={plValue}
                                            onChange={(e) => onPLChange(e, "plCode")}
                                            emptyMessage="No approved active PL found"
                                            optionLabel="plCode"
                                            filter
                                            filterBy="plCode"
                                            placeholder={dialogLoading ? "Loading..." : result.plCode || "Select PL"}
                                            disabled={dialogLoading}
                                        />
                                        {submitted && !result?.plCode && <small className="p-invalid text-danger">PL Id required.</small>}
                                    </div>
                                    <div className="col-12 mb-2 lg:col-6 lg:mb-0">
                                        <label>PL Duration </label>
                                        <InputText value={result?.duration ? result?.duration + " Month" : ""} readOnly />
                                    </div>
                                </div>
                                <div className="grid formgrid">
                                    <div className="col-12 mb-2 lg:col-6 lg:mb-0">
                                        <label>Coaching start </label>
                                        <input
                                            type="text"
                                            ref={coachingStart}
                                            value={result?.coachingStartDate}
                                            onFocus={() => (coachingStart.current.type = "date")}
                                            onBlur={() => (coachingStart.current.type = "text")}
                                            onChange={(e) => onDateChange(e, "coachingStartDate")}
                                            disabled={!selected && !isEdit}
                                            className={"datePicker " + classNames({ "p-invalid": submitted && !result.coachingStartDate })}
                                            min={today}
                                        />
                                        {submitted && !result.coachingStartDate && <span className="text-danger">Required</span>}
                                    </div>
                                    <div className="col-12 mb-2 lg:col-6 lg:mb-0">
                                        <label>Coaching End </label>
                                        <InputText id="minmax" value={result.coachingEndDate || ""} disabled={true} readOnlyInput />
                                        {submitted && !result.coachingEndDate && <span className="text-danger">Required</span>}
                                    </div>
                                </div>
                                <div className="grid formgrid">
                                    <div className="col-12 mb-2 lg:col-6 lg:mb-0">
                                        <label>Assessment Start </label>
                                        <input
                                            type="text"
                                            ref={assessmentStart}
                                            placeholder={result.assessmentStartDate ? new Date(result.assessmentStartDate).toLocaleString().split(",")[0] : ""}
                                            onFocus={() => (assessmentStart.current.type = "date")}
                                            onBlur={() => (assessmentStart.current.type = "text")}
                                            minDate={new Date(result.coachingEndDate)}
                                            onChange={(e) => onAssessmentDateChange(e, "assessmentStartDate")}
                                            disabled={!selected && !isEdit}
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
                                            placeholder={result.assessmentEndDate ? new Date(result.assessmentEndDate).toLocaleString().split(",")[0] : ""}
                                            onFocus={() => (assessmentEnd.current.type = "date")}
                                            onBlur={() => (assessmentEnd.current.type = "text")}
                                            onChange={(e) => onAssessmentDateChange(e, "assessmentEndDate")}
                                            disabled={!selected && !isEdit}
                                            className={"datePicker " + classNames({ "p-invalid": submitted && !result.assessmentEndDate })}
                                            min={result?.assessmentStartDate}
                                        />
                                        {submitted && !result.assessmentEndDate && <span className="text-danger">Required</span>}
                                    </div>
                                </div>
                            </div>
                        </Dialog>
                        <Dialog visible={approveDialog} style={{ width: "400px" }} header="Confirm" footer={confirmApproval} onHide={hideDialog}>
                            <p>Are you sure?</p>
                        </Dialog>
                        <Dialog visible={deleteResultDialog} style={{ width: "450px" }} header="Confirm" modal footer={deleteResultDialogFooter} onHide={hideDialog}>
                            <div className="flex align-items-center justify-content-center">
                                <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />

                                <span>Are you sure you want to delete?</span>
                            </div>
                        </Dialog>
                        <Dialog visible={taskResultDialog} style={{ width: "600px" }} header="Coaching tasks" maximizable modal onHide={hideDialog}>
                            <DataTable
                                ref={dt}
                                value={coachingTasks}
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} results"
                                emptyMessage="No results found."
                                dataKey="Id"
                                paginator
                                rows={7}
                                loading={dialogLoading}
                                rowsPerPageOptions={[7, 25, 50, 100]}
                                className="p-datatable-responsive-demo"
                            >
                                <Column field="taskCode" header="Task Code" className="p-column-title"></Column>
                                <Column field="task" header="Task" className="p-column-title"></Column>
                            </DataTable>
                        </Dialog>
                        <Dialog visible={assessorDialog} style={{ width: "700px" }} modal onHide={hideDialog}>
                            <Assessors invoked={assessorDialog} annualplanId={result?.id} plCode={result?.plCode} onClose={hideDialog} />
                        </Dialog>
                        <Dialog visible={coachDialog} style={{ width: "700px" }} modal onHide={hideDialog}>
                            <Coaches invoked={coachDialog} annualplanId={result?.id} plCode={result?.plCode} onClose={hideDialog} />
                        </Dialog>
                        <Dialog visible={replanDialog} style={{ width: "700px" }} modal footer={replanDialogFooter} onHide={hideDialog}>
                            <div className="card p-fluid" style={{ borderColor: BASE_COLOR }}>
                                <h4 className="text-center">Replan Request </h4>
                                <div className="">
                                    <div className="field col">
                                        <label htmlFor="requestReason">Reason</label>
                                        <InputTextarea
                                            id="requestReason"
                                            cols={25}
                                            rows={5}
                                            autoResize
                                            value={replan.requestReason}
                                            onChange={(e) => onInputChange(e, "requestReason")}
                                            placeholder="Write your reason, you can request for change coaching dates or for plan termination."
                                            required
                                            className={classNames({ "p-invalid": submitted && !replan.requestReason })}
                                        />
                                        {submitted && !replan.requestReason && <small className="p-invalid text-danger">Write your reason here.</small>}
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

export default React.memo(AnnualPlans, comparisonFn);
