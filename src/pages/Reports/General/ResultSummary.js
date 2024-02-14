import React, { useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Tooltip } from "primereact/tooltip";
import { Toast } from "primereact/toast";
import { getData } from "../../../services/AccessAPI";
import { Dropdown } from "primereact/dropdown";
import { getMonthName } from "../../../components/TimeLine";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
import { useLocation } from "react-router-dom";
export const ResultSummary = () => {
    const [loading, setLoading] = useState(false);
    const [assessment, setAssessment] = useState(null);
    const [detailReport, setDetailReport] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [header, setHeader] = useState("Over All");
    const [reportDate, setReportDate] = useState(getMonthName(new Date().getMonth()) + " " + new Date().getFullYear());
    const dt = useRef(null);
    const dtlTable = useRef(null);
    const toast = useRef();
    const location = useLocation();
    const { division, costcenter, date } = location.state.data;
    let duration = "";
    if (date) {
        duration = new Date(date).getMonth() + 1 + "%2F" + new Date(date).getFullYear();
    }
    useEffect(() => {
        if (division) {
            setHeader(division);
        }
        if (costcenter) {
            setHeader(costcenter);
        }
        if (date) {
            setReportDate(getMonthName(new Date(date).getMonth()) + " " + new Date(date).getFullYear());
        }
        setLoading(true);
        getData(`/Reports/ResultSummary/ResultSummaryReportDetail?Divisions=${division}&Costcenters=${costcenter}&Durations=${duration}`, "ResultSummary-ResultSummaryReportDetail")
            .then((res) => {
                if (res) {
                    setDetailReport(res.data);
                    setAssessment(res.data);
                }
            })
            .catch((error) => {
                if (error.name === "AbortError") {
                    toast.current.show({ severity: "error", summary: "Unable to load data.", life: 3000 });
                    console.log("Request Cancled!");
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);
    const exportCSV = () => {
        dt.current.exportCSV();
    };
    const exportCSVDetailTable = () => {
        dtlTable.current.exportCSV();
    };

    let headerGroup = (
        <ColumnGroup>
            <Row>
                <Column header="PL" rowSpan={2} />
                <Column header="Employee Id" rowSpan={2} />
                <Column header="Employee Name" colSpan={3} />
                <Column header="Cost center" rowSpan={2} />
                <Column header="PL Description" rowSpan={2} />
                <Column header=" Coaching" colSpan={2} />
                <Column header=" Assessment" colSpan={2} />
                <Column header="Status" rowSpan={2} />
            </Row>
            <Row>
                <Column header="First Name" colSpan={1} />
                <Column header="Middle Name" colSpan={1} />
                <Column header="Last Name" colSpan={1} />
                <Column header="Start Date" colSpan={1} />
                <Column header="End Date" colSpan={1} />
                <Column header="Start Date" colSpan={1} />
                <Column header="End Date" colSpan={1} />
            </Row>
        </ColumnGroup>
    );
    const statusBodyTamplate = (rowData) => {
        let style = "";
        if (rowData.Status === "Pass") {
            style = "customer-badge status-qualified";
        } else {
            style = "customer-badge status-unqualified";
        }
        return <span className={style}>{rowData.Status}</span>;
    };
    const statusItemTemplate = (option) => {
        return <span className={`customer-badge status-${option.style}`}>{option.value}</span>;
    };
    const statuses = [
        { value: "Pass", style: "qualified" },
        { value: "Fail", style: "unqualified" },
    ];
    const statusFilter = <Dropdown value={selectedStatus} options={statuses} filterBy="value" optionLabel="value" onChange={(e) => customFilter(e)} itemTemplate={statusItemTemplate} placeholder="Select a Status" className="p-column-filter" showClear />;
    const customFilter = (e) => {
        let val = e.value || null;
        setSelectedStatus(val);
        if (val) {
            setAssessment(() => {
                return detailReport.filter((row) => row.Status === e.value);
            });
        } else {
            setAssessment(detailReport);
        }
    };
    return (
        <div className="py-3 md:px-6 lg:px-4">
            <div className="grid">
                <div className="col-12 lg:col-12">
                    <div className="card h-full">
                        <div className="flex flex-column md:flex-row md:align-items-start md:justify-content-between mb-3">
                            <div className="text-900 text-xl font-semibold mb-3 md:mb-0" style={{ fontFamily: "timesNewRoman" }}>
                                <i>
                                    {header} Result Summary report for {reportDate}
                                </i>
                            </div>
                            <div className="inline-flex align-items-center">
                                <Tooltip target=".export-target-button" />
                                <Button icon="pi pi-upload" className="p-button-rounded mx-3 export-target-button" data-pr-tooltip="Export" onClick={exportCSV}></Button>
                            </div>
                        </div>
                        <Toast ref={toast} />
                        <DataTable
                            ref={dt}
                            value={assessment}
                            loading={loading}
                            dataKey="id"
                            filterDisplay="row"
                            paginator
                            className="datatable-responsive"
                            rows={8}
                            rowsPerPageOptions={[8, 15, 15]}
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} results"
                            emptyMessage="No result found."
                            rowGroupMode="rowspan"
                            groupRowsBy="Costcenter"
                        >
                            <Column field="Costcenter" header="Cost Center" filter headerStyle={{ minWidth: "10rem" }}></Column>
                            <Column field="EmployeeId" header="Employee Id"></Column>
                            <Column field="Plcodes" header="PL" headerStyle={{ minWidth: "10rem" }}></Column>
                            <Column field="Firstname" header="First Name" headerStyle={{ minWidth: "10rem" }}></Column>
                            <Column field="Middlename" header="Middle Name" headerStyle={{ minWidth: "10rem" }}></Column>
                            <Column field="Lastname" header="Last Name" headerStyle={{ minWidth: "10rem" }}></Column>
                            <Column field="Result" header="Result" headerStyle={{ minWidth: "10rem" }}></Column>
                            <Column field="Status" header="Status" body={statusBodyTamplate} filter filterElement={statusFilter} headerStyle={{ minWidth: "10rem" }}></Column>
                        </DataTable>
                    </div>
                </div>
            </div>
        </div>
    );
};
