import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { getData } from "../../services/AccessAPI";
import "../../assets/css/style.css";
import moment from "moment/moment";
import { useHistory } from "react-router-dom";
import "../../assets/css/DataTableDemo.css";

const IntrimAssessment = () => {
    const [result, setResult] = useState(null);

    const [loading, setLoading] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);

    const toast = useRef(null);
    const dt = useRef(null);
    const history = useHistory();
    useEffect(() => {
        setLoading(true);
        const fetchData = () => {
            getData(`/Assessment/GetForInterim`, "Interim-Index")
                .then((res) => {
                    if (res) {
                        setResult(res.data);
                    }
                })
                .catch((error) => {
                    if (error.name === "AbortError") {
                        console.log("Request Cancled!");
                    }
                })
                .finally(() => {
                    setLoading(false);
                });
        };
        fetchData();
    }, []);

    const takeIntrim = (rowData) => {
        history.push({
            pathname: "/interm-detail",
            state: { id: rowData.id, fullName: rowData.fullName },
        });
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
    const actionBody = (rowData) => {
        return <Button icon="pi pi-check" label="Intrim" onClick={(e) => takeIntrim(rowData)} className="p-button-outlined p-button-success mr-2 mb-2" />;
    };
    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h4 className="m-0">Employee Monthly Intrim Assessment</h4>
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
                            value={result}
                            dataKey="id"
                            paginator
                            loading={loading}
                            rows={8}
                            rowsPerPageOptions={[5, 10, 25]}
                            className="p-datatable-responsive-demo "
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} results"
                            globalFilter={globalFilter}
                            emptyMessage="No results found."
                            header={header}
                        >
                            <Column field="employeeId" header="ID" className="p-column-title"></Column>
                            <Column field="fullName" header="Name" className="p-column-title"></Column>
                            <Column field="plCode" header="PL" className="p-column-title"></Column>
                            <Column field="coachingStartDate" header="Coaching" body={coachingBody} className="p-column-title"></Column>
                            <Column field="assessmentStartDate" header="Assessment" body={assessmentBody} className="p-column-title"></Column>
                            <Column header="Action" body={actionBody} className="p-column-title"></Column>
                        </DataTable>
                    </div>
                </div>
            </div>
        </>
    );
};

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(IntrimAssessment, comparisonFn);
