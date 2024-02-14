import React, { useState, useEffect, useRef } from "react";
import { BASE_COLOR } from "../../../services/Settings";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { putData, getData } from "../../../services/AccessAPI";
import { Tooltip } from "primereact/tooltip";
import { SplitButton } from "primereact/splitbutton";
import { InputTextarea } from "primereact/inputtextarea";
import { classNames } from "primereact/utils";
import "../../../assets/css/DataTableDemo.css";

const Trainer = () => {
    let emptyResult = {
        id: null,
        remark: null,
    };
    const [loading, setLoading] = useState(false);
    const [waiting, setWaiting] = useState(false);
    const [result, setResult] = useState(emptyResult);
    const [results, setResults] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [submitted, setSubmitted] = useState(null);
    const [rejectResultDialog, setRejectResultDialog] = useState(null);

    const [approveResultDialog, setapproveResultDialog] = useState(false);
    const dt = useRef(null);
    useEffect(() => {
        const fetchData = () => {
            setLoading(true);
            getData(`/Trainer/GetByDivision`, "Trainer-Approval")
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
                .finally(() => {
                    setLoading(false);
                });
        };
        fetchData();
    }, []);

    //Create new

    const hideDialog = () => {
        setResult(emptyResult);
        setSubmitted(false);
        setapproveResultDialog(false);
        setRejectResultDialog(false);
    };
    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _result = { ...result };
        _result[`${name}`] = val;
        setResult(_result);
    };
    const confirmapprove = async () => {
        setWaiting(true);
        let data = await putData(`/Trainer/HRApproval?id=${result?.id}`, "Trainer-Approval");
        if (data) {
            setResults((prev) =>
                prev?.map((item) => {
                    if (item?.id === data?.id) {
                        return { ...item, aproval: "HRApproved" };
                    }
                    return item;
                })
            );
            setapproveResultDialog(false);
            setResult(emptyResult);
        }
        setWaiting(false);
    };
    const confirmReject = async () => {
        setSubmitted(true);
        if (result?.id && result?.remark) {
            setWaiting(true);
            let data = await putData(`/Trainer/HRReject`, result, "Trainer-Approval");
            if (data) {
                setResults((prev) =>
                    prev?.map((item) => {
                        if (item?.id === data?.id) {
                            return { ...item, aproval: "Rejected" };
                        }
                        return item;
                    })
                );
                setapproveResultDialog(false);
                setResult(emptyResult);
            }
            setWaiting(false);
            setSubmitted(false);
        }
    };
    const approveResult = (data) => {
        setResult(data);
        setapproveResultDialog(true);
    };

    const items = (data) => [
        data?.aproval !== "HRApproved"
            ? {
                  label: "Approve",
                  icon: "pi pi-check",
                  command: (e) => {
                      approveResult(data);
                  },
              }
            : {
                  label: "Approved",
                  disabled: true,
              },

        data?.aproval !== "HRApproved"
            ? {
                  label: "Reject",
                  icon: "pi pi-times",
                  command: (e) => {
                      setResult(data);
                      setRejectResultDialog(true);
                  },
              }
            : "",
    ];
    const actionBodyTemplate = (data) => {
        return <SplitButton label="Manage" className="p-button-raised p-button-success p-button-text mr-2 mb-2" model={items(data)} onClick={() => items(data)}></SplitButton>;
    };
    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h4 className="m-0">Trainer List</h4>
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
    const approveResultDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            {waiting ? <Button label="Deleting" icon="pi pi-spin pi-spinner" style={{ backgroundColor: BASE_COLOR }} disabled={true} /> : <Button label="Yes" icon="pi pi-check" style={{ backgroundColor: BASE_COLOR }} className="" onClick={confirmapprove} />}
        </>
    );
    const rejectResultDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            {waiting ? <Button label="Saving" icon="pi pi-spin pi-spinner" style={{ backgroundColor: BASE_COLOR }} disabled={true} /> : <Button label="Yes" icon="pi pi-check" style={{ backgroundColor: BASE_COLOR }} className="" onClick={confirmReject} />}
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
    const roleBody = (data) => {
        return <span className="customer-badge">{data?.role}</span>;
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
                className="p-datatable-responsive-demo"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} results"
                globalFilter={globalFilter}
                emptyMessage="No results found."
                header={header}
            >
                <Column header="No" body={rowCount}></Column>
                <Column field="employee.employeeId" header="Employee Id" filter sortable className="p-column-title"></Column>
                <Column field="fullName" header="Full Name" className="p-column-title"></Column>
                <Column field="plCode" header="Authorized on" className="p-column-title"></Column>
                <Column field="role" header="Role" body={roleBody} className="p-column-title"></Column>
                <Column field="maxTraineenumber" header="Max Trainee" className="p-column-title"></Column>
                <Column field="aproval" header="Status" body={statusBody} className="p-column-title"></Column>
                <Column header="Action" headerStyle={{ width: "30%", minWidth: "3rem" }} body={actionBodyTemplate}></Column>
            </DataTable>
            <Dialog visible={approveResultDialog} style={{ width: "450px" }} header="Confirm" modal footer={approveResultDialogFooter} onHide={hideDialog}>
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                    {result && <span>Are you sure you want to approve?</span>}
                </div>
            </Dialog>
            <Dialog visible={rejectResultDialog} style={{ width: "450px" }} header="Confirm" modal footer={rejectResultDialogFooter} onHide={hideDialog}>
                <div className="flex align-items-center justify-content-center">
                    <div className="formgrid grid">
                        <div className="field col">
                            <InputTextarea id="remark" cols={50} rows={3} value={result.remark} placeholder="Write a remark here." onChange={(e) => onInputChange(e, "remark")} autoResize required className={classNames({ "p-invalid": submitted && !result.remark })} />
                            {submitted && !result.remark && <small className="p-invalid text-danger">Remark is required.</small>}
                        </div>
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default Trainer;
