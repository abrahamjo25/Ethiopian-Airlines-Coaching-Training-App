import React, { useState, useEffect, useRef } from "react";
import { BASE_COLOR } from "../../services/Settings";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { getData, postData } from "../../services/AccessAPI";
const MassMapping = () => {
    const [loading, setLoading] = useState(true);
    const [waiting, setWaiting] = useState(false);
    const [results, setResults] = useState(null);
    const [resultDialog, setResultDialog] = useState(false);
    const [selectedResults, setSelectedResults] = useState([]);
    const [selectedAutoValueToMap, setSelectedAutoValueToMap] = useState([]);
    const [autoValue, setAutoValue] = useState(null);
    const [invalidEmployeeToMap, setInvalidEmployeeToMap] = useState("");
    const [submittedToMap, setSubmittedToMap] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [globalDialogFilter, setGlobalDialogFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const componentMouted = useRef(true);
    useEffect(() => {
        getData(`/OperationalMasters/Massmappings/Index`, "Massmappings-Index")
            .then((res) => {
                if (componentMouted) {
                    setAutoValue(res.data);
                    setLoading(false);
                }
            })
            .catch(() => {});
    }, []);
    const findEmployeeById = (key) => {
        let checkId = false;
        for (let i = 0; i < autoValue.length; i++) {
            if (autoValue[i].EmployeeId === key) {
                checkId = true;
                break;
            }
        }

        return checkId;
    };
    const searchEmployeeTo = (e) => {
        setSelectedAutoValueToMap(e.value);
    };
    const saveMapping = () => {
        setSubmittedToMap(true);
        if (selectedAutoValueToMap.EmployeeId) {
            setLoading(true);
            setWaiting(true);
            postData(`/OperationalMasters/Massmappings/Mappemployees?Currsupervisor=${selectedAutoValueToMap.EmployeeId}`, selectedResults, "Massmappings-Mappemployees")
                .then((res) => {
                    if (res.data.Status === 3) {
                        setSelectedResults(null);
                        setSelectedAutoValueToMap(null);
                        hideDialog();
                        toast.current.show({ severity: "success", summary: "Successful", detail: "Result Saved!", life: 3000 });
                    } else {
                        toast.current.show({ severity: "error", summary: "Unsuccessful", detail: `${res.data.Message}`, life: 5000 });
                    }
                })
                .catch(() => {})
                .finally(() => {
                    setLoading(false);
                    setWaiting(false);
                });
        } else {
            if (selectedAutoValueToMap && !findEmployeeById(selectedAutoValueToMap)) {
                setInvalidEmployeeToMap("Choose valid employee id");
            } else if (selectedAutoValueToMap) {
                setLoading(true);
                setWaiting(true);
                postData(`/OperationalMasters/Massmappings/Mappemployees?Currsupervisor=${selectedAutoValueToMap}`, selectedResults, "Massmappings-Mappemployees")
                    .then((res) => {
                        if (res.data.Status === 3) {
                            toast.current.show({ severity: "success", summary: "Successful", detail: "Result Saved!", life: 3000 });
                        } else {
                            toast.current.show({ severity: "error", summary: "Unsuccessful!", detail: `${res.data.Message}`, life: 5000 });
                        }
                    })
                    .catch(() => {})
                    .finally(() => {
                        setLoading(false);
                        setWaiting(false);
                    });
            }
        }
    };
    const hideDialog = () => {
        setInvalidEmployeeToMap("");
        setSelectedResults([]);
        setSubmittedToMap(false);
        setResultDialog(false);
    };
    const editresult = (rowData) => {
        setLoading(true);
        setWaiting(true);
        getData(`/OperationalMasters/Massmappings/Getemployees?SupervisorId=${rowData.EmployeeId}`, "Massmappings-Mappemployees")
            .then((res) => {
                if (componentMouted) {
                    setResults(res.data);
                }
                return () => {
                    componentMouted.current = false;
                };
            })
            .catch((error) => {
                if (error.name === "AbortError") {
                    console.log("Request Cancled!");
                }
            });
        setLoading(false);
        setWaiting(false);
        setResultDialog(true);
    };
    const resultDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text btn-success" onClick={hideDialog} />
            {waiting ? (
                <Button label="Saving" icon="pi pi-spin pi-spinner" style={{ backgroundColor: BASE_COLOR }} disabled={true} />
            ) : (
                <Button label="Save Mapping" icon="pi pi-save" disabled={!selectedResults || !selectedResults.length} style={{ backgroundColor: BASE_COLOR }} className="btn-danger" onClick={saveMapping} />
            )}
        </>
    );
    const nameBodyTamplate = (rowData) => {
        return (
            <div className="buttonset">
                <p>{rowData.Firstname + "  " + rowData.Lastname + "  " + rowData.Middlename}</p>
            </div>
        );
    };
    const editBodyTemplate = (rowData) => {
        return (
            <div className="buttonset">
                <Button label="Map" icon="pi pi-check" className="p-button-outlined p-button-success mr-2 mb-2" onClick={() => editresult(rowData)} />
            </div>
        );
    };
    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h3 className="m-0">Employee Mass Mapping</h3>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );
    const headerDialog = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0"></h5>
            <div className="col-sm-3">
                <span className="block mt-2 md:mt-0 p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText type="search" onInput={(e) => setGlobalDialogFilter(e.target.value)} placeholder="Search..." />
                </span>
            </div>
        </div>
    );
    return (
        <>
            <div className="grid crud-demo">
                <div className="col-12">
                    <div className="card">
                        <Toast ref={toast} />
                        <DataTable
                            ref={dt}
                            value={autoValue}
                            dataKey="EmployeeId"
                            paginator
                            rows={8}
                            loading={loading}
                            rowsPerPageOptions={[8, 15, 25]}
                            className="datatable-responsive"
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Employees"
                            globalFilter={globalFilter}
                            emptyMessage="No Employees found."
                            header={header}
                            responsiveLayout="scroll"
                        >
                            <Column field="EmployeeId" header="Employee Id" sortable filter body="" headerStyle={{ width: "20%", minWidth: "10rem" }}></Column>
                            <Column field="Firstname" header="Name" sortable body={nameBodyTamplate} headerStyle={{ width: "20%", minWidth: "10rem" }}></Column>
                            <Column field="Costcntname" header="Cost center Name" body="" sortable headerStyle={{ width: "20%", minWidth: "8rem" }}></Column>
                            <Column field="Positionname" header="Position Name" sortable body="" headerStyle={{ width: "24%", minWidth: "10rem" }}></Column>
                            <Column field="Fsupervisor" header="First Supervisor" sortable body="" headerStyle={{ width: "24%", minWidth: "10rem" }}></Column>
                            <Column body={editBodyTemplate} headerStyle={{ width: "24%", minWidth: "10rem" }}></Column>
                        </DataTable>
                        <Dialog visible={resultDialog} style={{ width: "900px" }} header="" modal className="p-fluid" footer={resultDialogFooter} onHide={hideDialog}>
                            <div className="">
                                <Dropdown value={selectedAutoValueToMap || ""} required options={autoValue} onChange={(e) => searchEmployeeTo(e)} optionLabel="EmployeeId" filter filterBy="EmployeeId" placeholder="Select to whom you want to map" />
                                {submittedToMap && !selectedAutoValueToMap && <small className="p-invalid text-danger">Employee Id required. To whom you want to Map the selected Employees?</small>}
                                <span className="text-danger">{invalidEmployeeToMap}</span>
                            </div>
                            <DataTable
                                ref={dt}
                                value={results}
                                selection={selectedResults}
                                onSelectionChange={(e) => setSelectedResults(e.value)}
                                dataKey="EmployeeId"
                                paginator
                                rows={10}
                                loading={loading}
                                rowsPerPageOptions={[5, 10, 25]}
                                className="datatable-responsive"
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Employees"
                                globalFilter={globalDialogFilter}
                                emptyMessage="No Employees found."
                                header={headerDialog}
                                responsiveLayout="scroll"
                            >
                                <Column selectionMode="multiple" headerStyle={{ width: "3rem" }}></Column>
                                <Column field="EmployeeId" header="Employee Id" sortable body="" headerStyle={{ width: "24%", minWidth: "10rem" }}></Column>
                                <Column field="Firstname" header="First Name" sortable body="" headerStyle={{ width: "24%", minWidth: "10rem" }}></Column>
                                <Column field="Middlename" header="Middle Name" body="" sortable headerStyle={{ width: "24%", minWidth: "8rem" }}></Column>
                                <Column field="Lastname" header="Last Name" sortable body="" headerStyle={{ width: "24%", minWidth: "10rem" }}></Column>
                            </DataTable>
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

export default React.memo(MassMapping, comparisonFn);
