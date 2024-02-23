import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import React, { useEffect, useRef, useState } from "react";
import { Toast } from "react-bootstrap";
import { BASE_COLOR } from "../../../services/Settings";
import { Button } from "primereact/button";
import { getData, putData } from "../../../services/AccessAPI";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";

const MainMapping = () => {
    let costcenterToSup = {
        mappedCostcenters: null,
        supervisorId: null,
    };
    let employeeToSup = {
        mappedCostcenters: null,
        employees: null,
        supervisorId: null,
    };
    let acting = {
        fromSupervisor: null,
        toSupervisor: null,
    };
    const [result1, setResult1] = useState(costcenterToSup);
    const [result2, setResult2] = useState(employeeToSup);
    const [result3, setResult3] = useState(acting);
    const [employees, setEmployee] = useState(null);
    const [costcenters, setCostcenters] = useState(null);
    const [submitted1, setSubmitted1] = useState(false);
    const [submitted2, setSubmitted2] = useState(false);
    const [submitted3, setSubmitted3] = useState(false);
    const [waiting1, setWaiting1] = useState(false);
    const [waiting2, setWaiting2] = useState(false);
    const [waiting3, setWaiting3] = useState(false);
    const [loading, setLoading] = useState(false);

    const [selectedCost, setSelectedCost] = useState(null);
    const [selectedEmp, setSelectedEmp] = useState(null);
    const toast = useRef();
    useEffect(() => {
        fetchCostcenter();
    }, []);
    const fetchCostcenter = async () => {
        setLoading(true);
        await getData(`/CostCenter/GetAll`, "Mapping-Index")
            .then((res) => {
                if (res) {
                    setCostcenters(res.data);
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
    const getEmployee = async (e) => {
        setEmployee(null);
        let _result = { ...result2 };
        _result["mappedCostcenters"] = e.value?.costCenterCode;
        setResult2(_result);
        setLoading(true);
        await getData(`/Employees/GetByCostCenterId?costCenterCode=${e.value?.costCenterCode}`, "Mapping-Index")
            .then((res) => {
                if (res) {
                    setEmployee(res.data);
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
    const onInputChange1 = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _result1 = { ...result1 };
        _result1[`${name}`] = val;
        setResult1(_result1);
    };
    const onInputChange2 = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _result2 = { ...result2 };
        _result2[`${name}`] = val;
        setResult2(_result2);
    };
    const onInputChange3 = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _result3 = { ...result3 };
        _result3[`${name}`] = val;
        setResult3(_result3);
    };
    const saveResult1 = async () => {
        setSubmitted1(true);
        if (result1.supervisorId && selectedCost) {
            let result = [];
            selectedCost?.map((key) => {
                result.push(key?.costCenterCode);
            });
            let data = {
                mappedCostcenters: result,
                supervisorId: result1?.supervisorId,
            };
            setWaiting1(true);
            await putData("Employees/MappByCostCenter", data, "Mapping-Index");
            setWaiting1(false);
        }
    };
    const saveResult2 = async () => {
        setSubmitted2(true);
        if (result2.supervisorId && selectedEmp) {
            let result = [];
            selectedEmp?.map((key) => {
                result.push(key?.employeeId);
            });
            let data = {
                employees: result,
                supervisorId: result2?.supervisorId,
            };
            setWaiting2(true);
            await putData("Employees/MappByEmployee", data, "Mapping-Index");
            setWaiting2(false);
        }
    };
    const saveResult3 = async () => {
        setSubmitted3(true);
        if (result3.fromSupervisor && result3.toSupervisor) {
            setWaiting3(true);
            await putData("Employees/MapActing", result3, "Mapping-Index");
            setWaiting3(false);
        }
    };
    return (
        <div className="py-5">
            <Toast ref={toast} />
            <div className="grid dashboard row">
                <div className="col-12 md:col-12">
                    <div className="card">
                        <h5> Create Mappings </h5>
                    </div>
                </div>
            </div>
            <div className="dashboard row">
                <div className="grid">
                    <div className="md:col-4 col-12">
                        <div className="card">
                            <h5>Map by Cost center </h5>
                            <div className="p-fluid" style={{ borderColor: BASE_COLOR }}>
                                <br />
                                <div className="formgrid grid">
                                    <div className="field col">
                                        <label htmlFor="costCenterCode">Cost center</label>

                                        <MultiSelect value={selectedCost} onChange={(e) => setSelectedCost(e.value)} options={costcenters} filter optionLabel="costCenterCode" placeholder="Select Cost center" className="md:w-30rem" />

                                        {submitted1 && !selectedCost && <small className="p-invalid text-danger">Costcenter is required.</small>}
                                        <br />
                                        <label htmlFor="supervisorId">Supervisor Id</label>
                                        <InputText id="supervisorId" value={result1.supervisorId || ""} onChange={(e) => onInputChange1(e, "supervisorId")} required className={classNames({ "p-invalid": submitted1 && !result1.supervisorId })} />
                                        {submitted1 && !result1.supervisorId && <small className="p-invalid text-danger">Supervisor Id is required.</small>}
                                    </div>
                                </div>
                                <div className="py-5">
                                    {waiting1 ? <Button label="Saving" icon="pi pi-spin pi-spinner btn-sm" style={{ backgroundColor: BASE_COLOR }} disabled={true} /> : <Button label="Save" icon="pi pi-save" style={{ backgroundColor: BASE_COLOR }} className="btn-sm " onClick={saveResult1} />}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 md:col-4">
                        <div className="card">
                            <h5>Map by Employees</h5>
                            <div className="p-fluid" style={{ borderColor: BASE_COLOR }}>
                                <br />
                                <div className="formgrid grid">
                                    <div className="field col">
                                        <label htmlFor="mappedCostcenters">Cost center</label>
                                        <Dropdown
                                            id="mappedCostcenters"
                                            value={result2.mappedCostcenters || ""}
                                            options={costcenters}
                                            onChange={(e) => getEmployee(e)}
                                            optionLabel="costCenterCode"
                                            filter
                                            multiple
                                            filterBy="costCenterCode"
                                            placeholder={loading ? "Loading..." : result2.mappedCostcenters || "Select cost center"}
                                        />
                                        <label htmlFor="employees">Supervisor</label>

                                        <MultiSelect value={selectedEmp} onChange={(e) => setSelectedEmp(e.value)} options={employees} optionLabel="employeeId" placeholder="Select Employee" className="md:w-30rem" />

                                        {submitted2 && !selectedEmp && <small className="p-invalid text-danger">Supervisor is required.</small>}
                                        <br />
                                        <label htmlFor="supervisorId">Supervisor Id</label>
                                        <InputText id="supervisorId" value={result2.supervisorId || ""} onChange={(e) => onInputChange2(e, "supervisorId")} required className={classNames({ "p-invalid": submitted2 && !result2.supervisorId })} />
                                        {submitted2 && !result2.supervisorId && <small className="p-invalid text-danger">Supervisor Id is required.</small>}
                                    </div>
                                </div>
                                <div className="py-5">
                                    {waiting2 ? <Button label="Saving" icon="pi pi-spin pi-spinner btn-sm" style={{ backgroundColor: BASE_COLOR }} disabled={true} /> : <Button label="Save" icon="pi pi-save" style={{ backgroundColor: BASE_COLOR }} className="btn-sm " onClick={saveResult2} />}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="md:col-4 col-12">
                        <div className="card">
                            <h5>Acting</h5>
                            <div className="p-fluid" style={{ borderColor: BASE_COLOR }}>
                                <br />
                                <div className="formgrid grid">
                                    <div className="field col">
                                        <label htmlFor="costCenterCode">Supervisor</label>

                                        <InputText id="employees" value={result3.fromSupervisor || ""} onChange={(e) => onInputChange3(e, "fromSupervisor")} required className={classNames({ "p-invalid": submitted3 && !result3.fromSupervisor })} />
                                        {submitted3 && !result3.fromSupervisor && <small className="p-invalid text-danger">Supervisor Id is required.</small>}
                                        <br />
                                        <label htmlFor="toSupervisor">Acting Id</label>
                                        <InputText id="toSupervisor" value={result3.toSupervisor || ""} onChange={(e) => onInputChange3(e, "toSupervisor")} required className={classNames({ "p-invalid": submitted3 && !result3.toSupervisor })} />
                                        {submitted3 && !result3.toSupervisor && <small className="p-invalid text-danger">Acting Id is required.</small>}
                                    </div>
                                </div>
                                <div className="py-5">
                                    {waiting3 ? <Button label="Saving" icon="pi pi-spin pi-spinner btn-sm" style={{ backgroundColor: BASE_COLOR }} disabled={true} /> : <Button label="Save" icon="pi pi-save" style={{ backgroundColor: BASE_COLOR }} className="btn-sm " onClick={saveResult3} />}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(MainMapping, comparisonFn);
