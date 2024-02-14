import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Rating } from "primereact/rating";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { getData } from "../../services/AccessAPI";
import CertificateBg from "../../assets/images/CertificateBg.png";
import { exportComponentAsPNG } from "react-component-export-image";

import "../../assets/css/style.css";
import moment from "moment/moment";
import "../../assets/css/DataTableDemo.css";
import "../../assets/css/Certificate.css";

const OverAllCoaching = () => {
    const [loading, setLoading] = useState(true);
    const [dialogLoading, setDialogLoading] = useState(true);
    const [results, setResults] = useState(null);
    const [coachedTask, setCoachedTask] = useState(false);
    const [assessedTask, setAssessedTask] = useState(false);
    const [coachedTaskList, setCoachedTaskList] = useState(null);
    const [assessedTaskList, setAssessedTaskList] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [printDialog, setPrintDialog] = useState(false);
    const [certificateData, setCertificateData] = useState(null);

    const toast = useRef(null);
    const dt = useRef(null);
    const certificateWrapper = useRef();

    useEffect(() => {
        fetchData();
    }, []);
    const fetchData = () => {
        getData(`/Result/GetByDivision`, "Result-Index")
            .then((res) => {
                if (res) {
                    setResults(res.data);
                }
            })
            .catch((error) => {
                if (error.name === "AbortError") {
                    console.log("Request Cancled!");
                }
            })
            .finally(() => setLoading(false));
    };
    const hideCoahedTaskDialog = () => {
        setCoachedTask(false);
        setCoachedTaskList(null);
    };
    const hideAssessedTaskDialog = () => {
        setAssessedTask(false);
        setAssessedTaskList(null);
    };
    const hideDialog = () => {
        setPrintDialog(false);
    };
    const coachRating = (rowData) => {
        let rateVal = Math.round((rowData.coachingMark * 5) / 100);
        return <Rating value={rateVal} readonly cancel={false} />;
    };
    const assessorRating = (rowData) => {
        let rateVal = Math.round((rowData.assessmentMark * 5) / 100);
        return <Rating value={rateVal} readonly cancel={false} />;
    };

    const displayCoachedTask = (rowData) => {
        setCoachedTask(true);
        setDialogLoading(true);
        getData(`/Result/GetCoachingResults?annualPlanId=${rowData.id}`, "Result-Index")
            .then((res) => {
                if (res) {
                    setCoachedTaskList(res.data);
                }
            })
            .catch(() => {})
            .finally(() => {
                setDialogLoading(false);
            });
    };
    const displayAssessedTask = (rowData) => {
        setAssessedTask(true);
        setDialogLoading(true);
        getData(`/Result/GetAssessmentResults?annualPlanId=${rowData.id}`, "Result-Index")
            .then((res) => {
                if (res) {
                    setAssessedTaskList(res.data);
                }
            })
            .catch(() => {})
            .finally(() => {
                setDialogLoading(false);
            });
    };

    const coachedOn = (rowData) => {
        return (
            <>
                <i className="pi pi-eye text-lg text-info" onClick={() => displayCoachedTask(rowData)} />
            </>
        );
    };
    const assessedOn = (rowData) => {
        return (
            <>
                <i className="pi pi-eye text-lg text-info" onClick={() => displayAssessedTask(rowData)} />
            </>
        );
    };
    const printCertificate = async (rowData) => {
        setCertificateData(rowData);
        setPrintDialog(true);
    };
    const certificateBody = (rowData) => {
        return (
            <>
                <Button label="View" icon="pi pi-print" onClick={() => printCertificate(rowData)} />
            </>
        );
    };
    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h4 className="">PL Result</h4>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const rowCount = (rowData, props) => {
        let index = parseInt(props.rowIndex + 1, 10);

        return (
            <React.Fragment>
                <span>{index}</span>
            </React.Fragment>
        );
    };
    const printDialogFooter = () => {
        return (
            <button
                onClick={(e) => {
                    e.preventDefault();
                    exportComponentAsPNG(certificateWrapper, {
                        html2CanvasOptions: { backgroundColor: null },
                        fileName: certificateData?.fullName,
                    });
                    hideDialog();
                }}
            >
                <i className="pi pi-print"></i> Print
            </button>
        );
    };
    return (
        <>
            <div className="datatable-responsive-demo grid crud-demo">
                <div className="offset-0 col-12">
                    <div className="card">
                        <Toast ref={toast} />
                        <DataTable
                            ref={dt}
                            value={results}
                            dataKey="id"
                            paginator
                            rows={10}
                            loading={loading}
                            rowsPerPageOptions={[5, 10, 25]}
                            className="p-datatable-gridlines p-datatable-responsive-demo"
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} results"
                            globalFilter={globalFilter}
                            header={header}
                            emptyMessage="No results found."
                        >
                            <Column field="" header="No" body={rowCount} className="p-column-title"></Column>
                            <Column field="employee.employeeId" header="ID" className="p-column-title"></Column>
                            <Column field="fullName" header="Name" className="p-column-title"></Column>
                            <Column field="plCode" header="PL" className="p-column-title"></Column>
                            <Column field="Coachedontskcnt" header="Coach Rating" body={coachRating} className="p-column-title"></Column>
                            <Column field="coachingMark" header="Coach Result" className="p-column-title"></Column>
                            <Column header="Detail" body={coachedOn} className="p-column-title"></Column>
                            <Column field="Assessedontskcnt" header="Assessor Rating" body={assessorRating} className="p-column-title"></Column>
                            <Column field="assessmentMark" header="Assessment Result" className="p-column-title"></Column>
                            <Column header="Detail" body={assessedOn} className="p-column-title"></Column>
                            <Column header="Certificate" body={certificateBody} className="p-column-title"></Column>
                        </DataTable>

                        <Dialog visible={coachedTask} style={{ width: "850px" }} onHide={hideCoahedTaskDialog}>
                            <DataTable
                                ref={dt}
                                value={coachedTaskList}
                                dataKey="id"
                                paginator
                                rows={5}
                                loading={dialogLoading}
                                rowsPerPageOptions={[5, 10, 25]}
                                className="p-datatable-gridlines"
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} results"
                                emptyMessage="No results found."
                                responsiveLayout="scroll"
                            >
                                <Column field="" header="No" body={rowCount} className="p-column-title"></Column>
                                <Column field="item" header="Task" className="p-column-title"></Column>
                                <Column field="rating" header="Rating" className="p-column-title"></Column>
                            </DataTable>
                        </Dialog>
                        <Dialog visible={assessedTask} style={{ width: "850px" }} onHide={hideAssessedTaskDialog}>
                            <DataTable
                                ref={dt}
                                value={assessedTaskList}
                                dataKey="id"
                                paginator
                                rows={5}
                                loading={dialogLoading}
                                rowsPerPageOptions={[5, 10, 25]}
                                className="p-datatable-gridlines"
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} results"
                                emptyMessage="No results found."
                                responsiveLayout="scroll"
                            >
                                <Column field="" header="No" body={rowCount} className="p-column-title"></Column>
                                <Column field="item" header="Task" className="p-column-title"></Column>
                                <Column field="rating" header="Rating" className="p-column-title"></Column>
                            </DataTable>
                        </Dialog>
                        <Dialog visible={printDialog} footer={printDialogFooter} onHide={hideDialog}>
                            <div className="App">
                                <div id="downloadWrapper" ref={certificateWrapper}>
                                    <div id="certificateWrapper">
                                        <p className="owner-name">{certificateData?.fullName}</p>
                                        <p className="owner-body">Has Seccessfully Completed</p>
                                        <p className="owner-pl">
                                            PL (Practical Log Book) of <u className="text-success">{certificateData?.plCode}</u>
                                        </p>
                                        <span className="date">
                                            Date issued <b> {moment(certificateData?.assessmentEndDate).format("LL")}</b>
                                        </span>
                                        <img src={CertificateBg} alt="Certificate" />
                                    </div>
                                </div>
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

export default React.memo(OverAllCoaching, comparisonFn);
