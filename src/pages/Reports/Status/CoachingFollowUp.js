import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useEffect, useState } from "react";
import { getData } from "../../../services/AccessAPI";
import { InputText } from "primereact/inputtext";
import { getMonthName } from "../../../components/TimeLine";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { useHistory } from "react-router-dom";

const CoachingFollowUp = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
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
    const getCostcenter = () => {
        getData(`/GeneralMasters/Costcenters/CostcentersDropdown`, `Costcenters-CostcentersDropdown`)
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
    const coachTamplate = (rowData) => {
        if (rowData.CRatings === 0) {
            return "Not Rated";
        } else {
            return rowData.CRatings;
        }
    };
    const assessorTamplate = (rowData) => {
        if (rowData.CRatings === 0) {
            return "Not Rated";
        } else {
            return rowData.ARatings;
        }
    };
    const coachBodyTamplate = (rowData) => {
        return <>{rowData.FirstName + " " + rowData.MidleName}</>;
    };
    const authorizedBody = () => {
        return (
            <>
                <span className="customer-badge status-renewal">Authorized</span>
            </>
        );
    };
    const rowExpansionTemplate = (data) => {
        return (
            <div className="px-8">
                <div className="orders-subtable">
                    <h5>PL details</h5>
                    <DataTable value={data.Pldetails} emptyMessage="Not found">
                        <Column field="Plcodes" header="PL code" />
                        <Column field="Taskcatagory" header="Task Category" />
                        <Column field="Taskdescription" header="Description" />
                        <Column field="CRatings" header="Coach Ratings" body={coachTamplate} />
                        <Column field="ARatings" header="Assessor Ratings" body={assessorTamplate} />
                    </DataTable>
                </div>
                <div className="orders-subtable">
                    <h5>Coachs</h5>
                    <DataTable value={data.Coachescodtl} emptyMessage="Not found">
                        <Column field="CoachesId" header="Coach Id" />
                        <Column field="FirstName" header=" Name" body={coachBodyTamplate} />
                        <Column field="CostCenter" header="Cost Center" />
                        <Column field="Plcodes" header="PL" />
                        <Column field="Status" header="Status" body={authorizedBody} />
                    </DataTable>
                </div>
                <div className="orders-subtable">
                    <h5>Assessors</h5>
                    <DataTable value={data.Coachesasdtl} emptyMessage="Not found">
                        <Column field="AssessorsId" header="Assessor Id" />
                        <Column field="FirstName" header=" Name" body={coachBodyTamplate} />
                        <Column field="CostCenter" header="Cost Center" />
                        <Column field="Plcodes" header="PL" />
                        <Column field="Status" header="Status" body={authorizedBody} />
                    </DataTable>
                </div>
            </div>
        );
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
                <Button label="Clear" onClick={clearSearch} className="p-button-raised p-button p-button-text" />
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
                    // expandedRows={expandedRows}
                    // onRowToggle={(e) => setExpandedRows(e.data)}
                    // rowExpansionTemplate={rowExpansionTemplate}
                >
                    {/* <Column expander style={{ width: "3em" }} /> */}
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

export default CoachingFollowUp;
