import React, { useState, useEffect, useRef } from "react";
import { BASE_COLOR } from "../../../services/Settings";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import { InputText } from "primereact/inputtext";
import { getData, putData } from "../../../services/AccessAPI";
import "../../../assets/css/style.css";
import { today } from "../AnnualPlan/minDate";
import moment from "moment/moment";
import "../../../assets/css/DataTableDemo.css";
import { useLocation } from "react-router-dom";

const RePlan = () => {
    let emptyResult = {
        fromDate: null,
        toDate: null,
        ids: [],
    };

    const [result, setResult] = useState(emptyResult);
    const [loading, setLoading] = useState(true);
    const [waiting, setWaiting] = useState(false);
    const [results, setResults] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [dialogLoading, setDialogLoading] = useState(false);
    const [actionPlanDialog, setActionPlanDialog] = useState(false);
    const [selectitem, setSelectitem] = useState(null);
    const [task, setTask] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [actionPlanValue, setActionPlanValue] = useState(null);
    const [actionPlanDisabled, setActionPlanDisabled] = useState(new Date());

    const toast = useRef(null);
    const dt = useRef(null);
    const startDate = useRef(null);
    const endDate = useRef(null);
    const location = useLocation();
    const { id, name } = location?.state;
    useEffect(() => {
        const fetchData = () => {
            getData(`/Coaching/GetForReActionPlan?annualPlanId=${id}`, "ActionPlan-Index")
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
        fetchData();
    }, []);

    const hideCheckDialog = () => {
        setActionPlanDialog(false);
        setSelectitem(null);
    };
    const onStartDateChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _result = { ...result };
        let date = new Date(val).toISOString().split("T")[0];
        _result[`${name}`] = date;
        _result["toDate"] = null;
        setResult(_result);
        const endOfMonth = moment().endOf("month").format("YYYY-MM-DD");
        let _lastDate = new Date(endOfMonth).getDate();
        let disabledDate = new Date(val).setDate(_lastDate);
        setActionPlanDisabled(disabledDate);
    };
    const onEndDateChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _result = { ...result };
        let date = new Date(val).toISOString().split("T")[0];
        _result[`${name}`] = date;
        setResult(_result);
    };
    const onPlanSelect = (e) => {
        const selectedIds = e.value.map((selectedTask) => selectedTask.id);
        setResult({ ...result, ids: selectedIds });
        setSelectitem(e.value);
    };

    const actionPlan = (data) => {
        setActionPlanValue(data);
        setDialogLoading(true);
        setActionPlanDialog(true);
        getData(`/Coaching/GetForRePlan?employeeId=${data?.employeeId}&plCode=${data?.plCode}&fromDate=${data?.fromDate}&toDate=${data?.toDate}`, "ActionPlan-Index")
            .then((res) => {
                if (res) {
                    setTask(res.data);
                    const selectedIds = res.data?.map((selectedTask) => selectedTask.id);
                    setResult({ fromDate: data?.fromDate, toDate: data.toDate, ids: selectedIds });
                    setSelectitem(res.data);
                }
            })
            .catch(() => {})
            .finally(() => {
                setDialogLoading(false);
            });
    };

    const saveResult = async () => {
        setSubmitted(true);
        if (result.fromDate && result.toDate && result.ids?.length > 0) {
            let _result = { ...result };
            setSubmitted(false);
            setWaiting(true);
            try {
                let data = await putData(`/Coaching/CreateActionPlan`, _result, "ActionPlan-Index");
                if (data) {
                    setActionPlanDialog(false);
                    setResult(emptyResult);
                }
            } catch {
            } finally {
                setWaiting(false);
            }
        }
    };

    const ActionPlanBtn = (data) => {
        return <Button label="Edit" icon="pi pi-pencil" className="p-button-raised p-button-success p-button-text mr-2 mb-2" onClick={() => actionPlan(data)} />;
    };
    const resultDialogFooter = (rowData) => {
        return (
            <div className="text-right">
                <React.Fragment>
                    {waiting ? <Button label="Saving.." icon="pi pi-spin pi-spinner" style={{ backgroundColor: BASE_COLOR }} disabled={true} /> : <Button label="Create" icon="pi pi-plus" style={{ backgroundColor: BASE_COLOR }} className="btn-danger" onClick={() => saveResult(rowData)} />}
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
    const coachingBody = (data) => {
        return (
            <span>
                {moment(data?.fromDate).format("MMM Do YY")} - {moment(data?.toDate).format("MMM Do YY")}
            </span>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">{name}</h5>
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
                        <DataTable
                            ref={dt}
                            value={results}
                            loading={loading}
                            dataKey="Id"
                            paginator
                            rows={10}
                            rowsPerPageOptions={[5, 10, 25]}
                            className="p-datatable-responsive-demo"
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} results"
                            globalFilter={globalFilter}
                            emptyMessage="No created action plan  found to update."
                            header={header}
                        >
                            <Column field="" header="No" body={rowCount} className="p-column-title"></Column>
                            <Column field="plCode" header="PL" className="p-column-title"></Column>
                            <Column field="coachingStartDate" header="Plan" body={coachingBody} className="p-column-title"></Column>
                            <Column header="Action" body={ActionPlanBtn}></Column>
                        </DataTable>
                        <Dialog visible={actionPlanDialog} style={{ width: "900px" }} header="" modal className="p-fluid" footer={resultDialogFooter} onHide={hideCheckDialog}>
                            <div className="user-card card ">
                                <h4 className="">Edit action plan</h4>
                                {submitted && selectitem?.length === 0 && <span className="text-danger text-center">Select tasks to create action plan</span>}
                                <hr />
                                <div className="formgrid grid fs-5">
                                    <div className="field col-6 text-lg"> {"ID: " + " " + actionPlanValue?.employeeId}</div>
                                    <div className="text-lg">{actionPlanValue?.fullName}</div>
                                </div>
                                <div className="col-12 lg:col-12">
                                    <div className="formgrid grid">
                                        <div className="field col">
                                            <label htmlFor="fromDate">Action From Date</label>
                                            <input
                                                type="text"
                                                ref={startDate}
                                                onFocus={() => (startDate.current.type = "date")}
                                                onBlur={() => (startDate.current.type = "text")}
                                                onChange={(e) => onStartDateChange(e, "fromDate")}
                                                required
                                                className={"datePicker " + classNames({ "p-invalid": submitted && !result.fromDate })}
                                                min={today}
                                                placeholder={result?.fromDate || ""}
                                            />
                                            {submitted && !result.fromDate && <small className="p-invalid text-danger">Action From Date is required.</small>}
                                        </div>

                                        <div className="field col">
                                            <label htmlFor="toDate">Action To Date</label>
                                            <input
                                                type="text"
                                                ref={endDate}
                                                onFocus={() => (endDate.current.type = "date")}
                                                onBlur={() => (endDate.current.type = "text")}
                                                onChange={(e) => onEndDateChange(e, "toDate")}
                                                required
                                                className={"datePicker " + classNames({ "p-invalid": submitted && !result.toDate })}
                                                min={today}
                                                max={new Date(actionPlanDisabled).toISOString().split("T")[0]}
                                                placeholder={result?.toDate || ""}
                                            />
                                            {submitted && !result.toDate && <small className="p-invalid text-danger">Action To Date is required.</small>}
                                            <br />
                                        </div>
                                    </div>
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
                                        className="datatable-responsive"
                                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} results"
                                        globalFilter={globalFilter}
                                        emptyMessage="No results found."
                                        responsiveLayout="scroll"
                                    >
                                        <Column header="" selectionMode="multiple"></Column>
                                        <Column field="" header="No" body={rowCount} className="p-column-title"></Column>
                                        <Column field="taskCode" header="Category" className="p-column-title"></Column>
                                        <Column field="task" header="Task" className="p-column-title"></Column>
                                    </DataTable>
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

export default React.memo(RePlan, comparisonFn);
