import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useEffect, useState } from "react";
import { getData } from "../../../services/AccessAPI";
import { getMonthName } from "../../../components/TimeLine";
import { useLocation } from "react-router-dom";
const CoachingStsDetail = () => {
    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [expandedRows, setExpandedRows] = useState(null);
    const location = useLocation();

    useEffect(() => {
        getStatus();
    }, []);
    const getStatus = () => {
        getData(`/Others/PLStatus/Coachingdtl?EmployeeId=${location.state.data.EmployeeId}`, `PLStatus-Coachingdtl`)
            .then((res) => {
                setResult(res.data);
                console.log(res.data);
            })
            .catch(() => {})
            .finally(() => {
                setLoading(false);
            });
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
                        <Column field="Plcodes" header="PL code" headerStyle={{ width: "16%", minWidth: "5rem" }} />
                        <Column field="Taskcatagory" header="Task Category" />
                        <Column field="Taskdescription" header="Description" />
                        <Column field="CRatings" header="Coach Ratings" body={coachTamplate} />
                        <Column field="ARatings" header="Assessor Ratings" body={assessorTamplate} />
                    </DataTable>
                </div>
                <div className="orders-subtable">
                    <h5>Coachs</h5>
                    <DataTable value={data.Coachescodtl} emptyMessage="Not found">
                        <Column field="CoachesId" header="Employee Id" />
                        <Column field="FirstName" header=" Name" body={coachBodyTamplate} />
                        <Column field="CostCenter" header="Cost Center" />
                        <Column field="Plcodes" header="PL" />
                        <Column field="Status" header="Status" body={authorizedBody} />
                    </DataTable>
                </div>
                <div className="orders-subtable">
                    <h5>Assessors</h5>
                    <DataTable value={data.Coachesasdtl} emptyMessage="Not found">
                        <Column field="AssessorsId" header="Employee Id" />
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
            <h6 className="text-lg">{location.state.data.Firstname + " " + location.state.data.Middlename + " " + location.state.data.Lastname}</h6>
        </div>
    );
    const dateFormatter = (date) => {
        return <>{getMonthName(new Date(date).getMonth()) + " " + new Date(date).getDate() + ", " + new Date(date).getFullYear()}</>;
    };
    const dateTamplate = (rowData, name) => {
        let res = dateFormatter(rowData[`${name}`]);
        return res;
    };
    const statusBodyTamplate = (rowData) => {
        let status = "";
        let style = "";
        // switch (rowData.Plstatus) {
        if (rowData.Plstatus === 5) {
            status = "Canclled";
            style = "customer-badge status-unqualified";
        } else if (rowData.Plstatus === 4) {
            status = "Closed";
            style = "customer-badge status-qualified";
        } else if (rowData.Plstatus === 3 || (new Date(rowData.Coachingstrdt) && rowData.Approvalsts === 3)) {
            status = "On Progress";
            style = "customer-badge status-new";
        } else if (new Date(rowData.Coachingstrdt) > new Date()) {
            status = "Waiting";
            style = "customer-badge status-proposal";
        } else if (new Date(rowData.Coachingsenddt) < new Date() && rowData.Plstatus < 3) {
            status = "Expired";
            style = "customer-badge status-unqualified";
        }
        return <span className={style}>{status}</span>;
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
                    emptyMessage="No result found."
                    header={header}
                    responsiveLayout="scroll"
                    expandedRows={expandedRows}
                    onRowToggle={(e) => setExpandedRows(e.data)}
                    rowExpansionTemplate={rowExpansionTemplate}
                >
                    <Column expander style={{ width: "3em" }} />
                    <Column field="EmployeeId" header="Employee Id" />
                    <Column field="Costcntcode" header="Cost Center" />
                    <Column field="Coachingstrdt" header="Coaching start" body={(e) => dateTamplate(e, "Coachingstrdt")} />
                    <Column field="Coachingsenddt" header="Coaching end" body={(e) => dateTamplate(e, "Coachingsenddt")} />
                    <Column field="Assessmentstr" header="Assessment start" body={(e) => dateTamplate(e, "Assessmentstr")} />
                    <Column field="Assessmentend" header="Assessment end" body={(e) => dateTamplate(e, "Assessmentend")} />
                    <Column field="Plstatus" header="Status" body={statusBodyTamplate} />
                </DataTable>
            </div>
        </div>
    );
};

export default CoachingStsDetail;
