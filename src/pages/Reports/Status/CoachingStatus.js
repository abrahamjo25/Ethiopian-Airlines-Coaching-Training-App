import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useEffect, useState } from "react";
import { getData } from "../../../services/AccessAPI";
import { InputText } from "primereact/inputtext";
import { getMonthName } from "../../../components/TimeLine";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { useHistory } from "react-router-dom";

const CoachingStatus = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [selectedDivision, setSelectedDivision] = useState(null);
    const [selectedCostcenter, setSelectedCostcenter] = useState(null);
    const [division, setDivision] = useState(null);
    const [costcenter, setCostcenter] = useState(null);
    useEffect(() => {
        if (!costcenter) {
            getCostcenter();
        }
        if (!division) {
            getDivisions();
        }
    }, []);
    const getCostcenter = async () => {
        await getData(`/GeneralMasters/Costcenters/CostcentersDropdown`, `Costcenters-CostcentersDropdown`)
            .then((res) => {
                if (res) {
                    setCostcenter(res.data);
                }
            })
            .catch(() => {});
    };
    const getDivisions = async () => {
        await getData(`/GeneralMasters/Divisions/DivisionsDropdown`, `Divisions-DivisionsDropdown`)
            .then((res) => {
                if (res) {
                    setDivision(res.data);
                }
            })
            .catch(() => {});
    };

    useEffect(() => {
        getStatus("", "");
    }, []);
    const getStatus = (div, cost) => {
        setLoading(true);
        getData(`/Others/PLStatus/Coachingsts?Divisions=${div}&Costcenters=${cost}`, `PLStatus-Coachingsts`)
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

    const getCostcenterByDiv = (div) => {
        getData(`/GeneralMasters/Costcenters/DivCostenters?Divisions=${div}`, `Costcenters-DivCostenters`)
            .then((res) => {
                if (res) {
                    setCostcenter(res.data);
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

    const clearSearch = () => {
        setSelectedDivision(null);
        setSelectedCostcenter(null);
        getStatus("", "");
    };
    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Coaching Status</h5>
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
    const dateFormatter = (date) => {
        return <>{getMonthName(new Date(date).getMonth()) + " " + new Date(date).getDate() + ", " + new Date(date).getFullYear()}</>;
    };
    const dateTamplate = (rowData, name) => {
        let res = dateFormatter(rowData[`${name}`]);
        return res;
    };
    const viewBodyTamplate = (rowData) => {
        return <Button label="View" icon="pi pi-eye" onClick={() => displayDetail(rowData)} />;
    };
    const history = useHistory();
    const displayDetail = (data) => {
        history.push({
            pathname: "/view-coaching-details",
            state: { data: data },
        });
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
                    emptyMessage="No Result found."
                    header={header}
                    responsiveLayout="scroll"
                >
                    <Column field="EmployeeId" header="Employee Id" />
                    <Column field="Firstname" header="First Name" />
                    <Column field="Middlename" header="Middle Name" />
                    <Column field="Lastname" header="Last Name" />
                    <Column field="Costcntcode" header="Cost Center" />
                    <Column field="Coachingstrdt" header="Coaching start" body={(e) => dateTamplate(e, "Coachingstrdt")} />
                    <Column field="Coachingsenddt" header="Coaching end" body={(e) => dateTamplate(e, "Coachingsenddt")} />
                    <Column field="Assessmentstr" header="Assessment start" body={(e) => dateTamplate(e, "Assessmentstr")} />
                    <Column field="Assessmentend" header="Assessment end" body={(e) => dateTamplate(e, "Assessmentend")} />
                    <Column header="View Detail" body={viewBodyTamplate} />
                </DataTable>
            </div>
        </div>
    );
};

export default CoachingStatus;
