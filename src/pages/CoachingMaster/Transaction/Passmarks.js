import React, { useState, useEffect, useRef } from "react";
import { BASE_COLOR } from "../../../services/Settings";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { SplitButton } from "primereact/splitbutton";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { getData, deleteData, postData, putData } from "../../../services/AccessAPI";
import "../../../assets/css/style.css";
import "../../../assets/css/DataTableDemo.css";
const Passingmarks = () => {
    let emptyResult = {
        passMark: null,
        divisionCode: null,
        passMarkFor: null,
    };
    const [loading, setLoading] = useState(true);
    const [waiting, setWaiting] = useState(false);
    const [results, setResults] = useState(null);
    const [divisions, setDivisions] = useState(null);
    const [resultDialog, setResultDialog] = useState(false);
    const [deleteResultDialog, setDeleteResultDialog] = useState(false);
    const [result, setResult] = useState(emptyResult);
    const [submitted, setSubmitted] = useState(false);
    const [message, setMessage] = useState("");
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            await getData(`/PassingMark/GetAll`, "Passingmarks-Index")
                .then((res) => {
                    if (res) {
                        setResults(res?.data);
                    }
                })
                .catch(() => {})
                .finally(() => {
                    setLoading(false);
                });
        };
        fetchData();
    }, []);

    const PassType = [
        { name: "Coaching", value: 1 },
        { name: "Assessment", value: 2 },
    ];
    const getDivisions = async () => {
        await getData(`/Division/GetAll`, "Passingmarks-Index").then((res) => {
            if (res) {
                setDivisions(res?.data);
            }
        });
    };
    //Create new
    const openNew = () => {
        getDivisions();
        setResult(emptyResult);
        setSubmitted(false);
        setResultDialog(true);
        setIsEdit(false);
    };
    const hideDialog = () => {
        setSubmitted(false);
        setResultDialog(false);
        setDeleteResultDialog(false);
    };

    const saveResult = async () => {
        setSubmitted(true);
        if (result.passMark > 50 && result.passMarkFor && result.divisionCode) {
            setSubmitted(false);
            let _result = { ...result };
            if (isEdit) {
                setWaiting(true);
                let data = await putData(`/PassingMark/Update`, _result, "Passingmarks-Index");
                if (data) {
                    setResults((prev) =>
                        prev.map((item) => {
                            if (item.id === data?.id) {
                                return data;
                            }
                            return item;
                        })
                    );
                    setResultDialog(false);
                    setResult(emptyResult);
                }
                setWaiting(false);
            } else {
                setSubmitted(false);
                setWaiting(true);
                let data = await postData(`/PassingMark/Create`, _result, "Passingmarks-Index");
                if (data) {
                    setResults((prev) => [...prev, data]);
                    setResultDialog(false);
                    setResult(emptyResult);
                }
                setWaiting(false);
            }
        } else if (result.passMark < 50) {
            setMessage(" Pass mark should greater than 50.");
        }
    };

    const editresult = (result) => {
        setResult({ ...result });
        setResultDialog(true);
    };
    const confirmDeleteResult = (result) => {
        setResult(result);
        setDeleteResultDialog(true);
    };

    const deleteResult = async () => {
        setWaiting(true);
        let data = await deleteData(`/PassingMark/Delete?Id=${result?.id}`, "Passingmarks-Index");
        if (data) {
            setResults(results.filter((item) => item.id !== data?.id));
            setDeleteResultDialog(false);
            setResult(emptyResult);
        }
        setWaiting(false);
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _result = { ...result };
        _result[`${name}`] = val;
        setResult(_result);
    };
    const onDropdownChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _result = { ...result };
        _result[`${name}`] = val;
        setResult(_result);
    };
    const onDivisionChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _result = { ...result };
        _result[`${name}`] = val.divisionCode;
        setResult(_result);
    };
    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Create New" icon="pi pi-plus" style={{ backgroundColor: BASE_COLOR }} onClick={openNew} />
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                {/* <Button icon="pi pi-upload" className="mr-2 inline-block" label="Import" onClick={openUpload} style={{ backgroundColor: SECONDARY_COLOR, color: "#FFFFF" }} /> */}
                <Button label="Export CSV" icon="pi pi-download" style={{ backgroundColor: BASE_COLOR }} className="p-button-help" onClick={exportCSV} />
            </React.Fragment>
        );
    };
    const items = (data) => [
        {
            label: "Edit",
            icon: "pi pi-pencil",
            command: (e) => {
                setIsEdit(true);
                editresult(data);
            },
        },
        {
            label: "Delete",
            icon: "pi pi-trash",
            command: (e) => {
                confirmDeleteResult(data);
            },
        },
    ];
    const actionBodyTemplate = (data) => {
        return <SplitButton label="Action" className="p-button-raised p-button-success p-button-text mr-2 mb-2" model={items(data)} onClick={(e) => items(data)}></SplitButton>;
    };

    const passtypebody = (rowData) => {
        return <>{rowData.passMarkFor === 1 ? <span className="customer-badge status-qualified">Coaching</span> : rowData.passMarkFor === 2 ? <span className="customer-badge status-renewal">Assessment</span> : "Undefind"}</>;
    };
    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h4 className="m-0">Passing Mark Details</h4>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." style={{ borderRadius: "2rem" }} className="w-full" />
            </span>
        </div>
    );

    const resultDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text btn-success" onClick={hideDialog} />
            {waiting ? <Button label="Saving" icon="pi pi-spin pi-spinner" style={{ backgroundColor: BASE_COLOR }} disabled={true} /> : <Button label="Save" icon="pi pi-save" style={{ backgroundColor: BASE_COLOR }} className="btn-danger" onClick={saveResult} />}
        </>
    );
    const deleteResultDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            {waiting ? <Button label="Deleting" icon="pi pi-spin pi-spinner" style={{ backgroundColor: BASE_COLOR }} disabled={true} /> : <Button label="Yes" icon="pi pi-check" style={{ backgroundColor: BASE_COLOR }} className="" onClick={deleteResult} />}
        </>
    );
    return (
        <>
            <div className="datatable-responsive-demo grid crud-demo">
                <div className="col-12">
                    <div className="card">
                        <Toast ref={toast} />
                        <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
                        <DataTable
                            ref={dt}
                            value={results}
                            dataKey="id"
                            paginator
                            rows={10}
                            loading={loading}
                            rowsPerPageOptions={[5, 10, 25]}
                            className="p-datatable-responsive-demo "
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} results"
                            globalFilter={globalFilter}
                            emptyMessage="No results found."
                            header={header}
                            rowGroupMode="rowspan"
                            groupRowsBy="divisionCode"
                        >
                            <Column field="divisionCode" header="Division" className="p-column-title"></Column>
                            <Column field="passMarkFor" header="Pass Type" body={passtypebody} className="p-column-title"></Column>
                            <Column field="passMark" header="Marks" className="p-column-title"></Column>
                            <Column header="Action" body={actionBodyTemplate}></Column>
                        </DataTable>
                        <Dialog visible={resultDialog} style={{ width: "500px" }} header="" modal className="p-fluid" footer={resultDialogFooter} onHide={hideDialog}>
                            <div className="card p-fluid" style={{ borderColor: BASE_COLOR }}>
                                <h4 className="text-center">Pass Mark {isEdit ? " Edit" : " Create"}</h4>
                                <br />
                                <span className="text-danger">{message}</span>
                                <div className="field col">
                                    <label htmlFor="divisionCode">Division</label>
                                    <Dropdown
                                        id="divisionCode"
                                        value={result.divisionCode}
                                        onChange={(e) => onDivisionChange(e, "divisionCode")}
                                        options={divisions}
                                        optionLabel="divisionCode"
                                        placeholder={result.divisionCode || "Select Division"}
                                        required
                                        filter
                                        className={classNames({ "p-invalid": submitted && !result.divisionCode })}
                                    />
                                    {submitted && !result.divisionCode && <small className="p-invalid text-danger">Division required.</small>}
                                </div>
                                <div className="field col">
                                    <label htmlFor="passMarkFor">Pass Mark Type</label>
                                    <Dropdown
                                        id="passMarkFor"
                                        value={result.passMarkFor}
                                        onChange={(e) => onDropdownChange(e, "passMarkFor")}
                                        options={PassType}
                                        optionLabel="name"
                                        placeholder={result.passMarkFor || "Select Passing Mark Type"}
                                        required
                                        className={classNames({ "p-invalid": submitted && !result.passMarkFor })}
                                    />
                                    {submitted && !result.passMarkFor && <small className="p-invalid text-danger">Pass Mark Type required.</small>}
                                </div>
                                <div className="field col">
                                    <label htmlFor="passMark">Pass Mark</label>
                                    <InputNumber id="passMark" value={result.passMark || ""} onValueChange={(e) => onInputChange(e, "passMark")} max={100} suffix=" out of 100" required className={classNames({ "p-invalid": submitted && !result.passMark })} />
                                    {submitted && !result.passMark && <small className="p-invalid text-danger">Pass mark required.</small>}
                                    {submitted && result.passMark && result.passMark < 1 && <small className="p-invalid text-danger">Invalid passMark.</small>}
                                </div>
                            </div>
                        </Dialog>
                        <Dialog visible={deleteResultDialog} style={{ width: "450px" }} header="Confirm" modal footer={deleteResultDialogFooter} onHide={hideDialog}>
                            <div className="flex align-items-center justify-content-center">
                                <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                                <span>Are you sure you want to delete?</span>
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

export default React.memo(Passingmarks, comparisonFn);
