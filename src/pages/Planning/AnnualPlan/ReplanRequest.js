import React, { useState, useEffect, useRef } from "react";
import { BASE_COLOR } from "../../../services/Settings";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { getData, putData } from "../../../services/AccessAPI";
import { SplitButton } from "primereact/splitbutton";
import { Tooltip } from "primereact/tooltip";
import { Message } from "primereact/message";
const ReplanRequest = () => {
    const [loading, setLoading] = useState(true);
    const [waiting, setWaiting] = useState(false);
    const [results, setResults] = useState(null);
    const [result, setResult] = useState(null);
    const [resultDialog, setResultDialog] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        fetchData();
    }, []);
    const fetchData = () => {
        getData(`/GeneralMasters/PlanningRequests/Index`, "PlanningRequests-Index")
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
    const hideDialog = () => {
        setResultDialog(false);
    };
    const saveResult = () => {
        setWaiting(true);
        putData(`/GeneralMasters/PlanningRequests/ApproveRequest?EmployeeId=${result.EmployeeId}&Costcenters=${result.Costcenters}&Plcodes=${result.Plcodes}`, "", "PlanningRequests-ApproveRequest")
            .then((res) => {
                if (res.data.Status === 3) {
                    toast.current.show({ severity: "success", summary: "Successful", detail: "Result Updated!", life: 3000 });
                    fetchData();
                } else {
                    toast.current.show({ severity: "error", summary: "Oops!", detail: `${res.data.Message}`, life: 5000 });
                }
            })
            .catch(() => {})
            .finally(() => {
                setResultDialog(false);
                setWaiting(false);
            });
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };
    const openApproveDialog = (data) => {
        setResult(data);
        setResultDialog(true);
    };
    const items = (data) => [
        {
            label: "Approve",
            icon: "pi pi-check text-success",
            command: () => {
                openApproveDialog(data);
            },
        },

        {
            label: "Reject",
            icon: "pi pi-times text-danger",
            command: () => {},
        },
    ];
    const actionBodyTamplate = (rowData) => {
        if (rowData.Status === 2) {
        } else if (rowData.Status === 3) {
            return <Message severity="error" text="Rejected" />;
        } else {
            return <SplitButton label="Action" className="p-button-raised p-button-success p-button-text mr-2 mb-2" model={items(rowData)} onClick={() => items(rowData)}></SplitButton>;
        }
    };
    const formateDate = (rowData) => {
        return <>{new Date(rowData.IssuedDate).toLocaleString().split(",")[0]}</>;
    };
    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h4 className="m-0">Annual Replan Request</h4>
            <div className="inline-flex align-items-center">
                <span className="block mt-2 md:mt-0 p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." style={{ borderRadius: "2rem" }} className="w-full" />
                </span>
                <Tooltip target=".export-target-button" />
                <Button icon="pi pi-upload" className="p-button-rounded mx-3 export-target-button" data-pr-tooltip="Export" onClick={exportCSV}></Button>
            </div>
        </div>
    );

    const resultDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text btn-success" onClick={hideDialog} />
            {waiting ? <Button label="Saving" icon="pi pi-spin pi-spinner" style={{ backgroundColor: BASE_COLOR }} disabled={true} /> : <Button label="Save" icon="pi pi-save" style={{ backgroundColor: BASE_COLOR }} className="btn-danger" onClick={saveResult} />}
        </>
    );

    return (
        <>
            <div className="grid crud-demo">
                <div className="col-12">
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
                            className="datatable-responsive"
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} results"
                            globalFilter={globalFilter}
                            emptyMessage="No results found."
                            header={header}
                            responsiveLayout="scroll"
                        >
                            <Column field="EmployeeId" header="Employee Id" filter sortable body="" headerStyle={{ width: "15%", minWidth: "10rem" }} className="p-column-title"></Column>
                            <Column field="Plcodes" header="PL" headerStyle={{ width: "10%", minWidth: "10rem" }} className="p-column-title"></Column>
                            <Column field="Requestcontent" header="Content" headerStyle={{ width: "11%", minWidth: "10rem" }} className="p-column-title"></Column>
                            <Column field="Senders" header="Sender" headerStyle={{ width: "11%", minWidth: "10rem" }} className="p-column-title"></Column>
                            <Column field="Costcenters" header="Cost center" headerStyle={{ width: "11%", minWidth: "10rem" }} className="p-column-title"></Column>
                            <Column field="Types" header="Planning Type" headerStyle={{ width: "11%", minWidth: "10rem" }} className="p-column-title"></Column>
                            <Column field="IssuedDate" header="Issued Date" body={formateDate} sortable headerStyle={{ width: "20%", minWidth: "8rem" }} className="p-column-title"></Column>
                            <Column header="Action" body={actionBodyTamplate} headerStyle={{ width: "20%", minWidth: "8rem" }} className="p-column-title"></Column>
                        </DataTable>
                        <Dialog visible={resultDialog} style={{ width: "450px" }} header="Confirm" modal footer={resultDialogFooter} onHide={hideDialog}>
                            <div className="flex align-items-center justify-content-center">
                                <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                                <span>Are you sure you want to approve?</span>
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

export default React.memo(ReplanRequest, comparisonFn);
