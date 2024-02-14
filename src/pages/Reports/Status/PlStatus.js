import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useEffect, useState } from "react";
import { getData } from "../../../services/AccessAPI";
import { InputText } from "primereact/inputtext";
import { approvalStatusTamplate } from "./approval";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";

const PlStatus = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [expandedRows, setExpandedRows] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [division, setDivision] = useState(null);
    const [costcenter, setCostcenter] = useState(null);
    const [selectedDivision, setSelectedDivision] = useState(null);
    const [selectedCostcenter, setSelectedCostcenter] = useState(null);
    useEffect(() => {
        getStatus("", "");
        getCostcenter();
        getDivisions();
    }, []);
    const getStatus = (div, cost) => {
        setLoading(true);
        getData(`/Others/PLStatus/GetplList?Divisions=${div}&Costcenters=${cost}`, `PLStatus-GetplList`)
            .then((res) => {
                if (res.data && res.data.length > 0) {
                    setResult(res.data);
                } else {
                    setResult(null);
                }
            })
            .catch(() => {})
            .finally(() => {
                setLoading(false);
            });
    };
    const getCostcenter = () => {
        getData(`/GeneralMasters/Costcenters/CostcentersDropdown`, `Costcenters-CostcentersDropdown`)
            .then((res) => {
                if (res) {
                    setCostcenter(res.data);
                }
            })
            .catch(() => {});
    };
    const getCostcenterByDiv = (div) => {
        getData(`/GeneralMasters/Costcenters/DivCostenters?Divisions=${div}`, `Costcenters-DivCostenters`)
            .then((res) => {
                if (res) {
                    setCostcenter(res.data);
                }
            })
            .catch(() => {});
    };
    const getDivisions = () => {
        getData(`/GeneralMasters/Divisions/DivisionsDropdown`, `Divisions-DivisionsDropdown`)
            .then((res) => {
                if (res) {
                    setDivision(res.data);
                }
            })
            .catch(() => {});
    };
    const onDivisionChange = (e) => {
        let val = (e.target && e.target.value) || "";
        setSelectedDivision(val);
        getCostcenterByDiv(val.Divisioncode);
        getStatus(val.Divisioncode, "");
    };
    const onCostcenterChange = (e) => {
        let val = (e.target && e.target.value) || "";
        setSelectedCostcenter(val);
        getStatus("", val.Costcntcode);
    };

    const rowExpansionTemplate = (data) => {
        return (
            <div className="orders-subtable">
                <h5>PL details for {data.Plcodes}</h5>
                <DataTable value={data.pldetails}>
                    <Column field="Taskcatagory" header="Task catagory" />
                    <Column field="Taskdescription" header="Description" />
                </DataTable>
            </div>
        );
    };
    const clearSearch = () => {
        setSelectedDivision(null);
        setSelectedCostcenter(null);
        setGlobalFilter(null);
        getStatus("", "");
    };
    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">PL Status</h5>
            <div className="">
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." style={{ borderRadius: "2rem" }} className="w-full" />
                </span>
                <span className="p-input-icon-left">
                    <Dropdown value={selectedDivision} filter options={division} optionLabel="Divisioncode" onChange={(e) => onDivisionChange(e)} placeholder="Filter by Division" className="w-full" />
                </span>
                <span className="p-input-icon-left">
                    <Dropdown value={selectedCostcenter} filter options={costcenter} optionLabel="Costcntcode" onChange={(e) => onCostcenterChange(e)} placeholder="Filter by Cost center" className="w-full" />
                </span>
                <Button label="Clear" onClick={clearSearch} disabled={!selectedDivision && !selectedCostcenter && !globalFilter} className="p-button-raised p-button p-button-text" />
            </div>
        </div>
    );
    const levelBodyTamplate = (rowData) => {
        return <>{`Level ${rowData.Pllevel}`}</>;
    };
    const durationBodyTamplate = (rowData) => {
        if (rowData.Compduration > 1) {
            return <>{`${rowData.Compduration} Month's`}</>;
        } else {
            return <>{`${rowData.Compduration} Month`}</>;
        }
    };
    return (
        <div className="datatable-rowexpansion-demo">
            <div className="card">
                <DataTable
                    value={result}
                    dataKey="Id"
                    paginator
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25]}
                    loading={loading}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} results"
                    globalFilter={globalFilter}
                    emptyMessage="No PL found."
                    header={header}
                    responsiveLayout="scroll"
                    expandedRows={expandedRows}
                    onRowToggle={(e) => setExpandedRows(e.data)}
                    rowExpansionTemplate={rowExpansionTemplate}
                >
                    <Column expander style={{ width: "3em" }} />
                    <Column field="Plcodes" header="Pl code" />
                    <Column field="Pldescription" header="Description" />
                    <Column field="Pllevel" header="Pl level" body={levelBodyTamplate} />
                    <Column field="Compduration" header="Duration(month)" body={durationBodyTamplate} />
                    <Column field="Approvalsts" header="Approval" body={(e) => approvalStatusTamplate(e, "Approvalsts")} />
                </DataTable>
            </div>
        </div>
    );
};

export default PlStatus;
