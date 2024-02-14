"use client";
import React, { useState, useEffect, useRef } from "react";
import { BASE_COLOR } from "../../../services/Settings";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { putData, getData } from "../../../services/AccessAPI";
import { Tooltip } from "primereact/tooltip";
import "../../../assets/css/DataTableDemo.css";

const PlApproval = () => {
    let emptyResult = {
        employeeId: "",
        maxTraineenumber: "",
        plCode: "",
        role: null,
        fullName: "",
    };
    const [loading, setLoading] = useState(false);
    const [waiting, setWaiting] = useState(false);
    const [result, setResult] = useState(emptyResult);
    const [results, setResults] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(null);

    const [approveResultDialog, setapproveResultDialog] = useState(false);
    const dt = useRef(null);
    useEffect(() => {
        fetchData();
    }, []);
    const fetchData = async () => {
        setLoading(true);
        await getData(`/PlHeader/GetByDivision`, "PlHeader-Approval")
            .then((res) => {
                if (res) {
                    setResults(res?.data);
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
    //Create new

    const hideDialog = () => {
        setResult(emptyResult);
        setapproveResultDialog(false);
    };
    const confirmapprove = async () => {
        setWaiting(true);
        let data = await putData(`/PlHeader/HRApproval?plCode=${result?.plCode}`, "", "PlHeader-Approval");
        if (data) {
            setResults((prev) =>
                prev?.map((item) => {
                    if (item?.plCode === data?.plCode) {
                        return data;
                    }
                    return item;
                })
            );
            setapproveResultDialog(false);
            setResult(emptyResult);
        }
        setWaiting(false);
    };

    const approveResult = (data) => {
        setResult(data);
        setapproveResultDialog(true);
    };

    const actionBodyTemplate = (rowData) => {
        if (rowData?.aproval === "HRApproved") {
            return <Button label="Approved" disabled={true} />;
        } else {
            return <Button label="Approve" icon="pi pi-check" onClick={() => approveResult(rowData)} />;
        }
    };
    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h4 className="m-0">PL List</h4>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const approveResultDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            {waiting ? <Button label="Saving" icon="pi pi-spin pi-spinner" style={{ backgroundColor: BASE_COLOR }} disabled={true} /> : <Button label="Yes" icon="pi pi-check" style={{ backgroundColor: BASE_COLOR }} className="" onClick={confirmapprove} />}
        </>
    );
    const statusBody = (data) => {
        return (
            <>
                <Tooltip target=".customer-badge" position="top" />
                <span className={"customer-badge " + data?.aproval} data-pr-tooltip={data?.remark}>
                    {data?.aproval}
                </span>
            </>
        );
    };
    const durationBody = (data) => {
        return <span className={"customer-badge"}>{data?.duration} Month</span>;
    };
    const rowCount = (rowData, props) => {
        let index = parseInt(props.rowIndex + 1, 10);

        return (
            <React.Fragment>
                <span>{index}</span>
            </React.Fragment>
        );
    };
    return (
        <div className="datatable-responsive-demo">
            <DataTable
                ref={dt}
                value={results}
                dataKey="id"
                paginator
                loading={loading}
                rows={6}
                rowsPerPageOptions={[5, 15, 25]}
                className="p-datatable-responsive-demo datatable-responsive"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} results"
                globalFilter={globalFilter}
                emptyMessage="No results found."
                header={header}
            >
                <Column header="No" body={rowCount}></Column>
                <Column field="plCode" header="PL" filter sortable className="p-column-title"></Column>
                <Column field="description" header="Description" className="p-column-title"></Column>
                <Column field="level" header="Level" className="p-column-title"></Column>
                <Column field="duration" header="Duration" body={durationBody} className="p-column-title"></Column>
                <Column field="costCenterCode" header="Cost center" className="p-column-title"></Column>
                <Column field="aproval" header="Status" body={statusBody} className="p-column-title"></Column>
                <Column header="Action" headerStyle={{ width: "30%", minWidth: "3rem" }} body={actionBodyTemplate}></Column>
            </DataTable>
            <Dialog visible={approveResultDialog} style={{ width: "450px" }} header="Confirm" modal footer={approveResultDialogFooter} onHide={hideDialog}>
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                    {result && <span>Are you sure you want to approve?</span>}
                </div>
            </Dialog>
        </div>
    );
};

export default PlApproval;
