import React, { useState, useEffect, useRef } from "react";
import { BASE_COLOR } from "../../../services/Settings";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { SplitButton } from "primereact/splitbutton";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Dropdown } from "primereact/dropdown";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { getData, deleteData, postData, putData } from "../../../services/AccessAPI";
import "../../../assets/css/style.css";
import "../../../assets/css/DataTableDemo.css";

const HrSpecialist = () => {
    let emptyResult = {
        divisionCode: "",
        employeeId: "",
        activeFrom: new Date().toISOString().split("T")[0],
        activeTo: null,
    };
    const startDate = useRef(null);
    const endDate = useRef(null);
    const [loading, setLoading] = useState(true);
    const [results, setResults] = useState([]);
    const [waiting, setWaiting] = useState(false);
    const [resultDialog, setResultDialog] = useState(false);
    const [deleteResultDialog, setDeleteResultDialog] = useState(false);
    const [invalidEmployee, setInvalidEmployee] = useState("");
    const [result, setResult] = useState(emptyResult);
    const [isEdit, setIsEdit] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [dialogLoading, setDialogLoading] = useState(false);
    const [division, setDivisions] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    useEffect(() => {
        fetchData();
    }, []);
    const fetchData = () => {
        getData(`/HRSpecialist/GetAll`, "HRSpecialist-Index")
            .then((res) => {
                if (res) {
                    console.log(res.data);
                    setResults(res.data);
                }
            })
            .catch(() => {})
            .finally(() => {
                setLoading(false);
            });
    };
    const getDivision = async () => {
        setDialogLoading(true);
        await getData(`/Division/GetAll`, `HRSpecialist-Index`)
            .then((result) => {
                if (result) {
                    setDivisions(result.data);
                }
            })
            .catch(() => {})
            .finally(() => {
                setDialogLoading(false);
            });
    };
    const openNew = () => {
        getDivision();
        setResult(emptyResult);
        setSubmitted(false);
        setResultDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setInvalidEmployee("");
        setResultDialog(false);
    };

    const hideDeleteResultDialog = () => {
        setDeleteResultDialog(false);
    };

    const saveResult = async () => {
        setSubmitted(true);
        if (result.divisionCode && result.employeeId && result.activeFrom && result.activeTo) {
            let _result = { ...result };
            if (isEdit) {
                setWaiting(true);
                setSubmitted(false);
                setWaiting(true);
                let data = await putData(`/HRSpecialist/Update`, _result, "HRSpecialist-Index");
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
                let data = await postData(`/HRSpecialist/Create`, _result, "HRSpecialist-Index");
                if (data) {
                    setResults((prev) => [...prev, data]);
                    setResultDialog(false);
                    setResult(emptyResult);
                }
                setWaiting(false);
            }
        }
    };

    const editresult = (res) => {
        debugger;
        getDivision();
        setIsEdit(true);
        let _result = { ...result };
        _result["id"] = res?.id;
        _result["divisionCode"] = res?.divisionCode;
        _result["employeeId"] = res?.employee?.employeeId;
        _result["activeFrom"] = res?.activeFrom;
        _result["activeTo"] = res?.activeTo;
        setResult(_result);
        setResultDialog(true);
    };
    const confirmDeleteResult = (result) => {
        setResult(result);
        setDeleteResultDialog(true);
    };

    const deleteResult = async () => {
        setWaiting(true);
        let data = await deleteData(`/HRSpecialist/Delete?id=${result?.id}`, "HRSpecialist-Index");
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

    const onDateChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _result = { ...result };
        let date = new Date(val).toISOString().split("T")[0];
        _result[`${name}`] = date;
        setResult(_result);
    };
    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _result = { ...result };
        _result[`${name}`] = val;
        setResult(_result);
    };
    const onDivChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _result = { ...result };
        let div = val.divisionCode;
        _result[`${name}`] = div;
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
                <Button label="Export CSV" icon="pi pi-download" style={{ backgroundColor: BASE_COLOR }} className="p-button-help" onClick={exportCSV} />
            </React.Fragment>
        );
    };
    const items = (data) => [
        {
            label: "Edit",
            icon: "pi pi-pencil",
            command: (e) => {
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
    const rowCount = (rowData, props) => {
        let index = parseInt(props.rowIndex + 1, 10);

        return (
            <React.Fragment>
                <span>{index}</span>
            </React.Fragment>
        );
    };
    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h4 className="m-0">HR Specialist Details</h4>
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
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteResultDialog} />
            {waiting ? <Button label="Deleting" icon="pi pi-spin pi-spinner" style={{ backgroundColor: BASE_COLOR }} disabled={true} /> : <Button label="Yes" icon="pi pi-check" style={{ backgroundColor: BASE_COLOR }} className="" onClick={deleteResult} />}
        </>
    );
    return (
        <div className="datatable-responsive-demo grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
                    <DataTable
                        ref={dt}
                        value={results}
                        dataKey="id"
                        paginator
                        loading={loading}
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
                        <Column field="divisionCode" header="Division Code" className="p-column-title"></Column>
                        <Column field="employee.employeeId" header="Responsible person" className="p-column-title"></Column>
                        <Column field="activeFrom" header="Active from Date" className="p-column-title"></Column>
                        <Column field="activeTo" header="Active to Date" className="p-column-title"></Column>
                        <Column header="Action" body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={resultDialog} style={{ width: "450px" }} header="" modal className="p-fluid" footer={resultDialogFooter} onHide={hideDialog}>
                        <div className="card p-fluid" style={{ borderColor: BASE_COLOR }}>
                            <h4 className="text-center">HR Specialist {isEdit ? " Edit" : " Create"}</h4>
                            <div className=" col-sm-12 row">
                                <div className="field col">
                                    <label htmlFor="Deptmentcod">Division</label>
                                    <Dropdown
                                        value={result.divisionCode}
                                        options={division}
                                        onChange={(e) => onDivChange(e, "divisionCode")}
                                        disabled={dialogLoading || isEdit}
                                        optionLabel="divisionCode"
                                        filter
                                        filterBy="divisionCode"
                                        placeholder={dialogLoading ? "Loading..." : result.divisionCode || "Choose Division Code"}
                                    />
                                    {submitted && !result.divisionCode && (
                                        <p>
                                            <small className="p-invalid text-danger">Division is Required.</small>
                                        </p>
                                    )}
                                    <label htmlFor="employeeId">
                                        Responsible person <span className="text-danger">{invalidEmployee}</span>
                                    </label>
                                    <InputText value={result.employeeId || ""} onChange={(e) => onInputChange(e, "employeeId")} />
                                    {submitted && !result.employeeId && (
                                        <p>
                                            <small className="p-invalid text-danger">Responsible person is Required.</small>
                                        </p>
                                    )}
                                    <label htmlFor="activeFrom">Active from date </label>
                                    <input
                                        type="text"
                                        ref={startDate}
                                        onFocus={() => (startDate.current.type = "date")}
                                        onBlur={() => (startDate.current.type = "text")}
                                        onChange={(e) => onDateChange(e, "activeFrom")}
                                        required
                                        placeholder={result.activeFrom ? new Date(result.activeFrom).toLocaleString().split(",")[0] : ""}
                                        className={"datePicker " + classNames({ "p-invalid": submitted && !result.activeFrom })}
                                    />
                                    {submitted && !result.activeFrom && <small className="p-invalid">Active from date is required.</small>}
                                    <label htmlFor="activeFrom">Active to date </label>
                                    <input
                                        type="text"
                                        ref={endDate}
                                        onFocus={() => (endDate.current.type = "date")}
                                        onBlur={() => (endDate.current.type = "text")}
                                        onChange={(e) => onDateChange(e, "activeTo")}
                                        required
                                        placeholder={result.activeTo ? new Date(result.activeTo).toLocaleString().split(",")[0] : ""}
                                        className={"datePicker " + classNames({ "p-invalid": submitted && !result.activeTo })}
                                    />
                                    {submitted && !result.activeTo && <small className="p-invalid">Active to date is required.</small>}
                                </div>
                            </div>
                        </div>
                    </Dialog>

                    <Dialog visible={deleteResultDialog} style={{ width: "450px" }} header="Confirm" modal footer={deleteResultDialogFooter} onHide={hideDeleteResultDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {result && (
                                <span>
                                    Are you sure you want to delete <b>{result.Deptmentcod}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(HrSpecialist, comparisonFn);
