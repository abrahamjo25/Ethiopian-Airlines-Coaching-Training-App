import React, { useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Tooltip } from "primereact/tooltip";
import { InputText } from "primereact/inputtext";
import { getData } from "../../../services/AccessAPI";
import moment from "moment/moment";

const fetchData = async () => {
    const res = await getData(`/GeneralReport/GetCoachingReportByDivision`, "GeneralReport-Index");
    localStorage.setItem("generalCoachingReport", JSON.stringify(res?.data));
    return res.data;
};
export const CoachingReport = () => {
    const [loading, setLoading] = useState(true);
    const [assessment, setAssessment] = useState([]);
    const [globalFilter, setGlobalFilter] = useState(null);

    const dtlTable = useRef(null);

    useEffect(() => {
        const storedData = localStorage.getItem("generalCoachingReport");
        if (storedData) {
            try {
                const parsedData = JSON.parse(storedData);
                setAssessment(parsedData?.filter((key) => key.annualplanStatus !== ""));
                setLoading(false);
            } catch (ex) {
                console.log("no data stored");
            }
        }

        fetchData()
            .then((data) => {
                setAssessment(data?.filter((key) => key.coachingStatus !== ""));
            })
            .catch((error) => {
                // Handle any errors
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const exportCSVDetailTable = () => {
        dtlTable.current.exportCSV();
    };

    const rowCount = (rowData, props) => {
        let index = parseInt(props.rowIndex + 1, 10);
        return (
            <React.Fragment>
                <span>{index}</span>
            </React.Fragment>
        );
    };

    const statusTemplate = (data) => {
        return <span className={"customer-badge " + data?.coachingStatus}>{data?.coachingStatus}</span>;
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

    const headerDetail = (
        <>
            <div className="flex flex-column md:flex-row md:align-items-start md:justify-content-between mb-3">
                <div className="text-900 text-xl font-semibold mb-3 md:mb-0" style={{ fontFamily: "timesNewRoman" }}>
                    <i>Coaching status report detail</i>
                </div>
                <div className="inline-flex align-items-center">
                    <span className="block mt-2 md:mt-0 p-input-icon-left">
                        <i className="pi pi-search" />
                        <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." style={{ borderRadius: "2rem" }} className="w-full" />
                    </span>
                    <Tooltip target=".export-target-button" />
                    <Button icon="pi pi-upload" className="p-button-rounded mx-3 export-target-button" data-pr-tooltip="Export" onClick={exportCSVDetailTable}></Button>
                </div>
            </div>
        </>
    );
    return (
        <div className="py-3 md:px-6 lg:px-4">
            <div className="grid crud-demo">
                <div className="col-12">
                    <div className="card">
                        <DataTable
                            ref={dtlTable}
                            value={assessment}
                            dataKey="id"
                            paginator
                            loading={loading}
                            rows={12}
                            rowsPerPageOptions={[12, 25, 50]}
                            className="p-datatable-gridlines"
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} results"
                            globalFilter={globalFilter}
                            emptyMessage="No results found."
                            header={headerDetail}
                            responsiveLayout="scroll"
                            rowGroupMode="rowspan"
                            groupRowsBy="costcenterCode"
                        >
                            <Column body={rowCount} header="No"></Column>
                            <Column field="costcenterCode" header="Cost center"></Column>
                            <Column field="plCode" header="PL"></Column>
                            <Column field="employeeId" header="ID"></Column>
                            <Column field="employeeName" header="Employee Name"></Column>
                            <Column field="coachingStartDate" header="Coaching" body={coachingBody}></Column>
                            <Column field="assessmentStartDate" header="Assessment" body={assessmentBody}></Column>
                            <Column field="coachingStatus" header="Status" body={statusTemplate}></Column>
                        </DataTable>
                    </div>
                </div>
            </div>
        </div>
    );
};
