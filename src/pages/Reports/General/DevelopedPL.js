import React, { useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Tooltip } from "primereact/tooltip";
import { InputText } from "primereact/inputtext";
import { getData } from "../../../services/AccessAPI";
import { getMonthName } from "../../../components/TimeLine";
import { useLocation } from "react-router-dom";
export const DevelopedPL = () => {
    const [loading, setLoading] = useState(false);
    const [detailReport, setDetailReport] = useState([]);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [header, setHeader] = useState("Over All");
    const [reportDate, setReportDate] = useState(getMonthName(new Date().getMonth()) + " " + new Date().getFullYear());
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
        getData(`/Reports/Numberofdevelopedpls/Getdevelopedpldetails?Divisions=${division}&Costcenters=${costcenter}&Durations=${duration}`, "Numberofdevelopedpls-Getdevelopedpldetails")
            .then((res) => {
                if (res) {
                    setDetailReport(res.data);
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
    const exportCSVDetailTable = () => {
        dtlTable.current.exportCSV();
    };
    const status = [
        { name: "Closed", val: 4 },
        { name: "Completed", val: 3 },
        { name: "On Progress", val: 2 },
        { name: "Not Started", val: 1 },
    ];
    const complationBodyTamplate = (rowData) => {
        let text = " Month";
        if (rowData.Compduration > 1) {
            text = " Months";
        }
        return <>{rowData.Compduration + text}</>;
    };
    const plOriginBodyTamplate = (rowData) => {
        return <>{getMonthName(new Date(rowData.Plorgindate).getMonth()) + " " + new Date(rowData.Plorgindate).getDate() + ", " + new Date(rowData.Plorgindate).getFullYear()}</>;
    };
    const plRevisedBodyTamplate = (rowData) => {
        return <>{getMonthName(new Date(rowData.Plreviseddat).getMonth()) + " " + new Date(rowData.Plreviseddat).getDate() + ", " + new Date(rowData.Plreviseddat).getFullYear()}</>;
    };
    const statusDetailTamplate = (rowData) => {
        let statusDetail = "";
        if (rowData.Plversion) {
            const parts = rowData.Plversion.split("-");
            const lastPart = parts.pop();
            let intVersion = parseInt(lastPart);
            if (intVersion > 1) {
                statusDetail = <span className="customer-badge status-qualified">Revised {intVersion - 1} times</span>;
            } else {
                statusDetail = <span className="customer-badge status-new">Not Revised</span>;
            }
        }

        return <span>{statusDetail}</span>;
    };
    const headerDetail = (
        <>
            <div className="flex flex-column md:flex-row md:align-items-start md:justify-content-between mb-3">
                <div className="text-900 text-xl font-semibold mb-3 md:mb-0" style={{ fontFamily: "timesNewRoman" }}>
                    <i>
                        {header} Developed PL report detail for {reportDate}
                    </i>
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
            <div className="card">
                <DataTable
                    ref={dtlTable}
                    value={detailReport}
                    dataKey="id"
                    paginator
                    loading={loading}
                    rows={10}
                    rowsPerPageOptions={[10, 15, 25]}
                    className="p-datatable-gridlines"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} results"
                    globalFilter={globalFilter}
                    emptyMessage="No results found."
                    header={headerDetail}
                    responsiveLayout="scroll"
                    rowGroupMode="rowspan"
                    groupRowsBy="Costcntcode"
                    sortMode="single"
                    sortField="Costcntcode"
                >
                    <Column field="Costcntcode" header="Cost center"></Column>
                    <Column field="Plcodes" header="PL Code"></Column>
                    <Column field="Pldescription" header="Description"></Column>
                    <Column field="Pllevel" header="PL Level"></Column>
                    <Column field="Compduration" header="Completion Duration" body={complationBodyTamplate}></Column>
                    <Column field="Plorgindate" header="PL origin date" body={plOriginBodyTamplate}></Column>
                    <Column field="Plreviseddat" header="PL Revised date" body={plRevisedBodyTamplate}></Column>
                    <Column field="Plversion" header="PL Version"></Column>
                    <Column field="Status" header="PL Status" body={statusDetailTamplate}></Column>
                </DataTable>
            </div>
        </div>
    );
};
