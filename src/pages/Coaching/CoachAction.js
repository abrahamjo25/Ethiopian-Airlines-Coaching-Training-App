import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import "../../assets/css/style.css";
import { getData } from "../../services/AccessAPI";
import moment from "moment/moment";
import { useHistory } from "react-router-dom";
import "../../assets/css/DataTableDemo.css";
const CoachAction = () => {

    const [loading, setLoading] = useState(true);
    const [results, setResults] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    const history = useHistory();
    useEffect(() => {
        const fetchData = () => {
            getData(`/Coaching/GetByCoachId`, "Coaching-Sign")
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

    const openNew = async (data) => {
        history.push({
            pathname: "/coaching-detail",
            state: { data: data },
        });
    };

    const ActionBody = (rowData) => {
        return (
            <React.Fragment>
                <Button label="View List" icon="pi pi-list" className="p-button-outlined p-button-success mr-2 mb-2" style={{ backgroundColor: "white", color: "#2e7d32" }} onClick={() => openNew(rowData)} />
            </React.Fragment>
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
    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h4 className="m-0">Coach Sign</h4>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );
    return (
        <>
            <div className="datatable-responsive-demo">
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
                            emptyMessage="No results found."
                            header={header}
                        >
                            <Column field="" header="No" body={rowCount} className="p-column-title"></Column>
                            <Column field="employeeId" header="Employee Id" sortable className="p-column-title"></Column>
                            <Column field="fullName" header="Name" className="p-column-title"></Column>
                            <Column field="plCode" header="PL" className="p-column-title"></Column>
                            <Column field="coachingStartDate" header="Coaching" body={coachingBody} className="p-column-title"></Column>
                            <Column field="assessmentStartDate" header="Assessment" body={assessmentBody} className="p-column-title"></Column>
                            <Column header="Action" body={ActionBody}></Column>
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

export default React.memo(CoachAction, comparisonFn);
