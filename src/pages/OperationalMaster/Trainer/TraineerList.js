import React, { useState, useEffect, useRef } from "react";
import { BASE_COLOR } from "../../../services/Settings";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { deleteData, getData, postData, putData } from "../../../services/AccessAPI";
import { classNames } from "primereact/utils";
import { Toolbar } from "primereact/toolbar";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { Link } from "react-router-dom";
import { SplitButton } from "primereact/splitbutton";
import Select from "react-select";
import { Tooltip } from "primereact/tooltip";
import "../../../assets/css/DataTableDemo.css";

const TraineerList = () => {
    let emptyResult = {
        id: "",
        maxTraineenumber: "",
        plCode: "",
        role: null,
        fullName: "",
    };
    const [loading, setLoading] = useState(false);
    const [waiting, setWaiting] = useState(false);
    const [result, setResult] = useState(emptyResult);
    const [results, setResults] = useState(null);
    const [resultDialog, setResultDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const [dialogLoading, setDialogLoading] = useState(false);
    const [plHeader, setPlHeader] = useState(null);
    const [trainer, setTrainer] = useState(null);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [selectedPl, setSelectedPl] = useState(null);
    const [deleteResultDialog, setDeleteResultDialog] = useState(false);
    const [approveResultDialog, setApproveResultDialog] = useState(false);
    const toast = useRef(null);
    const dt = useRef(null);
    useEffect(() => {
        fetchData();
    }, []);
    const fetchData = () => {
        setLoading(true);
        getData(`/Trainer/GetByCostcenter`, "Trainer-Index")
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
    const getPL = async (role) => {
        setDialogLoading(true);
        await getData(`/PlHeader/GetByCostCenter`, "PLHeader-Index")
            .then((res) => {
                if (res) {
                    const options = res?.data.map((item) => ({
                        value: item.plCode,
                        label: item.plCode,
                    }));
                    setPlHeader(options);
                }
            })
            .catch((error) => {
                if (error.name === "AbortError") {
                    console.log("Request Cancled!");
                }
            });

        let traineURL = null;
        if (role === 1) {
            traineURL = "/Employees/GetCoachesByCostcenter";
        } else if (role === 2) {
            traineURL = "/Employees/GetAssessorsByCostcenter";
        }
        if (traineURL) {
            await getData(traineURL, "Employees-Index")
                .then((res) => {
                    if (res) {
                        const options = res?.data.map((item) => ({
                            value: item?.id,
                            label: item?.employeeId,
                            fullName: item?.fullName,
                            id: item?.id,
                        }));
                        setTrainer(options);
                    }
                })
                .catch((error) => {
                    if (error.name === "AbortError") {
                        console.log("Request Cancled!");
                    }
                })
                .finally(() => {
                    setDialogLoading(false);
                });
        } else {
            setDialogLoading(false);
        }
    };
    //Create new

    const hideDialog = () => {
        setResult(emptyResult);
        setSubmitted(false);
        setResultDialog(false);
        setIsEdit(false);
        setDeleteResultDialog(false);
        setApproveResultDialog(false);
        setSelectedEmployee(null);
        setSelectedPl(null);
        setPlHeader(null);
        setTrainer(null);
    };
    const saveResult = async () => {
        debugger;
        setSubmitted(true);
        if (result?.id && result?.plCode && result?.maxTraineenumber) {
            let _result = { ...result };
            if (isEdit) {
                setWaiting(true);
                setSubmitted(false);
                setWaiting(true);
                let data = await putData(`/Trainer/Update`, _result, "Trainer-Index");
                let newData = { ...data };
                newData["fullName"] = result?.fullName;
                if (data) {
                    setResults((prev) =>
                        prev.map((item) => {
                            if (item.id === data?.id) {
                                return newData;
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
                let data = await postData(`/Trainer/Create`, _result, "Trainer-Index");
                if (data) {
                    let newData = { ...data };
                    newData["fullName"] = result?.fullName;
                    setResults((prev) => [...prev, newData]);
                    setResultDialog(false);
                    setResult(emptyResult);
                }
                setWaiting(false);
            }
        }
    };
    const confirmDelete = async () => {
        setWaiting(true);
        let data = await deleteData(`/Trainer/Delete?id=${result?.id}`, "Trainer-Index");
        if (data) {
            setResults(results.filter((item) => item.id !== data?.id));
            setDeleteResultDialog(false);
            setResult(emptyResult);
        }
        setWaiting(false);
    };
    const confirmApprove = async () => {
        setWaiting(true);
        let data = await putData(`/Trainer/ManagerApproval?Id=${result?.id}`, "", "Trainer-Index");
        if (data) {
            setResults((prev) =>
                prev?.map((item) => {
                    if (item?.id === data?.id) {
                        return { ...item, aproval: "ManagerApproved" };
                    }
                    return item;
                })
            );
            setApproveResultDialog(false);
            setResult(emptyResult);
        }
        setWaiting(false);
    };
    const openNew = async (value) => {
        await getPL(value);
        let _result = { ...result };
        _result["role"] = value;
        setResult(_result);
        setResultDialog(true);
        setSubmitted(false);
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _result = { ...result };
        _result[`${name}`] = val;
        setResult(_result);
    };
    const handleSelectEmployee = (selected, name) => {
        debugger;
        let _result = { ...result };
        _result[`${name}`] = selected?.id;
        if (name === "id") {
            _result["fullName"] = selected?.fullName;
        }
        setSelectedEmployee(selected);
        setResult(_result);
    };
    const handleSelectPL = (selected, name) => {
        let _result = { ...result };
        _result[`${name}`] = selected?.value;
        setSelectedPl(selected);
        setResult(_result);
    };
    const editResult = async (data) => {
        await getPL(data?.role);
        setResult(data);
        setSelectedEmployee({ value: data?.id, label: data?.employee?.id, fullName: data?.fullName });
        setSelectedPl({ value: data?.plCode, label: data?.plCode });
        setIsEdit(true);
        setResultDialog(true);
    };
    const deleteResult = (data) => {
        setResult(data);
        setDeleteResultDialog(true);
    };
    const items = (data) => [
        data?.aproval === "Ready" || data?.aproval === "Rejected"
            ? {
                  label: "Approve",
                  icon: "pi pi-check",
                  command: () => {
                      setResult(data);
                      setApproveResultDialog(true);
                  },
              }
            : {
                  label: "Approved",
                  disabled: true,
              },
        {
            label: "Edit",
            icon: "pi pi-pencil",
            command: (e) => {
                editResult(data);
            },
        },
        {
            label: "Delete",
            icon: "pi pi-trash",
            command: (e) => {
                deleteResult(data);
            },
        },
    ];
    const actionBodyTemplate = (rowData) => {
        return <SplitButton label="Action" className="p-button-raised p-button-success p-button-text mr-2 mb-2" model={items(rowData)} onClick={(e) => items(rowData)}></SplitButton>;
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

    const resultDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text btn-success" onClick={hideDialog} />
            {waiting ? <Button label="Saving" icon="pi pi-spin pi-spinner" style={{ backgroundColor: BASE_COLOR }} disabled={true} /> : <Button label="Save" icon="pi pi-save" style={{ backgroundColor: BASE_COLOR }} className="btn-danger" onClick={saveResult} />}
        </>
    );
    const deleteResultDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            {waiting ? <Button label="Deleting" icon="pi pi-spin pi-spinner" style={{ backgroundColor: BASE_COLOR }} disabled={true} /> : <Button label="Yes" icon="pi pi-check" style={{ backgroundColor: BASE_COLOR }} className="" onClick={confirmDelete} />}
        </>
    );
    const approveResultDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            {waiting ? <Button label="Saving" icon="pi pi-spin pi-spinner" style={{ backgroundColor: BASE_COLOR }} disabled={true} /> : <Button label="Yes" icon="pi pi-check" style={{ backgroundColor: BASE_COLOR }} className="" onClick={confirmApprove} />}
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
        return <span className={"customer-badge"}>{data?.role}</span>;
    };
    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="">
                    <DropdownButton id="dropdown-basic-button" title="Create New" variant="success">
                        <Dropdown.Item onClick={() => openNew(1)}>Add Coach</Dropdown.Item>
                        <Dropdown.Item onClick={() => openNew(2)}>Add Assessor</Dropdown.Item>
                    </DropdownButton>
                </div>
            </React.Fragment>
        );
    };
    return (
        <>
            <div className="datatable-responsive-demo grid crud-demo">
                <div className="col-12">
                    <div className="card">
                        <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>
                        <Toast ref={toast} />
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
                            <Column field="employee.employeeId" header="Employee Id" filter sortable className="p-column-title"></Column>
                            <Column field="fullName" header="Full Name" className="p-column-title"></Column>
                            <Column field="plCode" header="Authorized on" className="p-column-title"></Column>
                            <Column field="role" header="Role" body={roleBody} className="p-column-title"></Column>
                            <Column field="maxTraineenumber" header="Max Trainee" className="p-column-title"></Column>
                            <Column field="aproval" header="Status" body={statusBody} className="p-column-title"></Column>
                            <Column header="Action" headerStyle={{ width: "30%", minWidth: "3rem" }} body={actionBodyTemplate}></Column>
                        </DataTable>
                        <Dialog visible={resultDialog} style={{ width: "700px" }} header="" modal className="p-fluid" footer={resultDialogFooter} onHide={hideDialog}>
                            <div className="card p-fluid" style={{ borderColor: BASE_COLOR }}>
                                <h5 className="text-center">
                                    {isEdit ? "Edit" : "Create"} {result?.role === 1 ? "Coach" : "Assessor"}
                                </h5>
                                <br />
                                <div className="formgrid grid">
                                    <div className="field col">
                                        <label htmlFor="id">Employee Id</label>
                                        <Select options={trainer} value={selectedEmployee} isDisabled={dialogLoading} onChange={(e) => handleSelectEmployee(e, "id")} placeholder={dialogLoading ? "Loading..." : "Select Trainer"} />
                                        {submitted && !result.id && <span className="text-danger">This field is required!</span>}
                                    </div>
                                    <div className="field col">
                                        <label htmlFor="plCode">Name</label>
                                        <InputText value={result?.fullName} readOnly />
                                    </div>
                                </div>
                                <div className="formgrid grid">
                                    <div className="field col">
                                        <label htmlFor="plCode">Authorize with PL</label>
                                        <Select options={plHeader} value={selectedPl} isDisabled={dialogLoading} onChange={(e) => handleSelectPL(e, "plCode")} placeholder={dialogLoading ? "Loading..." : "Select PL"} />
                                        {submitted && !result.plCode && <span className="text-danger">This field is required!</span>}
                                    </div>
                                    <div className="field col">
                                        <label htmlFor="maxTraineenumber">
                                            Max Limit <Link to={{ pathname: "/Help-Center", state: { data: "maxTraineenumber" } }}> &nbsp;&nbsp;Help</Link>
                                        </label>
                                        <InputText id="maxTraineenumber" type="number" value={result.maxTraineenumber || ""} onChange={(e) => onInputChange(e, "maxTraineenumber")} className={classNames({ "p-invalid": submitted && !result.maxTraineenumber })} />
                                        {submitted && !result.maxTraineenumber && <span className="text-danger">This field is required!</span>}
                                    </div>
                                </div>
                            </div>
                        </Dialog>
                        <Dialog visible={deleteResultDialog} style={{ width: "450px" }} header="Confirm" modal footer={deleteResultDialogFooter} onHide={hideDialog}>
                            <div className="flex align-items-center justify-content-center">
                                <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                                {result && <span>Are you sure you want to delete?</span>}
                            </div>
                        </Dialog>
                        <Dialog visible={approveResultDialog} style={{ width: "450px" }} header="Confirm" modal footer={approveResultDialogFooter} onHide={hideDialog}>
                            <div className="flex align-items-center justify-content-center">
                                <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                                {result && <span>Are you sure you want to approve?</span>}
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

export default React.memo(TraineerList, comparisonFn);
