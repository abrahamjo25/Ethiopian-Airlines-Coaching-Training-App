import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import "../../assets/css/style.css";
import { getData } from "../../services/AccessAPI";
import moment from "moment/moment";
import { useHistory } from "react-router-dom";
import "../../assets/css/DataTableDemo.css";
import { Dialog } from "primereact/dialog";

const AssessingTrainee = () => {
    const [loading, setLoading] = useState(true);
    const [results, setResults] = useState(null);
    const [taskDialog, setTaskDialog] = useState(null);
    const [task, setTask] = useState(null);
    const [dialogLoading, setDialogLoading] = useState(null);

    const [globalFilter, setGlobalFilter] = useState(null);
    const dt = useRef(null);

    const history = useHistory();
    useEffect(() => {
        const fetchData = () => {
            getData(`/Assessment/GetByAssessorId`, "Assessment-Sign")
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

    const openNew = (data) => {
        history.push({
            pathname: "/assessment-detail",
            state: { data: data },
        });
    };
    const hideDialog = () => {
        setTask(null);
        setTaskDialog(false);
    };
    const ActionBody = (rowData) => {
        const currentDate = new Date();
        const assessmentStartDate = new Date(rowData?.assessmentStartDate);
        const assessmentEndDate = new Date(rowData?.assessmentEndDate);

        currentDate?.setHours(0, 0, 0, 0);
        assessmentStartDate?.setHours(0, 0, 0, 0);
        assessmentEndDate?.setHours(0, 0, 0, 0);

        if (currentDate >= assessmentStartDate && currentDate <= assessmentEndDate) {
            return (
                <React.Fragment>
                    <Button label="View List" icon="pi pi-list" className="p-button-outlined p-button-success mr-2 mb-2" style={{ backgroundColor: "white", color: "#2e7d32" }} onClick={() => openNew(rowData)} />
                </React.Fragment>
            );
        } else if (currentDate < assessmentStartDate) {
            return <span className="customer-badge Ready">Waiting</span>;
        } else if (currentDate > assessmentEndDate) {
            return <span className="customer-badge Rejected">Expired</span>;
        }
    };
    const fetchPlTasks = async (annualPlanId) => {
        setDialogLoading(true);
        setTaskDialog(true);
        await getData(`/Assessment/GetTasks?annualPlanId=${annualPlanId}`, "Assessment-Sign")
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
    const rowCount = (rowData, props) => {
        let index = parseInt(props.rowIndex + 1, 10);

        return (
            <React.Fragment>
                <span>{index}</span>
            </React.Fragment>
        );
    };
    const statusBody = (rowData) => {
        if (rowData?.coachApproval === "CoachAction") {
            return <span className={"customer-badge " + rowData?.coachApproval}>Signed</span>;
        } else {
            return <span className={"customer-badge " + rowData?.coachApproval}>{rowData?.coachApproval}</span>;
        }
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
    const viewTasksBody = (data) => {
        return (
            <span>
                <i className="pi pi-eye" onClick={() => fetchPlTasks(data?.id)}></i>
            </span>
        );
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
                            emptyMessage="No results found."
                            header={header}
                        >
                            <Column field="" header="No" body={rowCount} className="p-column-title"></Column>
                            <Column field="employeeId" header="Employee Id" sortable className="p-column-title"></Column>
                            <Column field="fullName" header="Name" className="p-column-title"></Column>
                            <Column field="plCode" header="PL" className="p-column-title"></Column>
                            <Column field="coachingStartDate" header="Coaching" body={coachingBody} className="p-column-title"></Column>
                            <Column field="assessmentStartDate" header="Assessment" body={assessmentBody} className="p-column-title"></Column>
                            <Column header="Tasks" body={viewTasksBody} className="p-column-title"></Column>
                            <Column header="Action" body={ActionBody}></Column>
                        </DataTable>
                        <Dialog visible={taskDialog} style={{ width: "800px" }} maximizable onHide={hideDialog}>
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
                                    emptyMessage="No results found."
                                >
                                    <Column field="" header="No" body={rowCount} className="p-column-title"></Column>
                                    <Column field="taskCode" header="Category" className="p-column-title"></Column>
                                    <Column field="task" header="Task" className="p-column-title"></Column>
                                    <Column field="coachingAction" header="Coaching" className="p-column-title"></Column>
                                    <Column field="coachApproval" header="Status" body={statusBody} className="p-column-title"></Column>
                                    <Column field="ataChapter" className="p-column-title"></Column>
                                </DataTable>
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

export default React.memo(AssessingTrainee, comparisonFn);
