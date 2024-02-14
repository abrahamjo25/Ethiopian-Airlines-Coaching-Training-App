import React, { useState, useEffect, useRef } from "react";
import { BASE_COLOR } from "../../services/Settings";
import { classNames } from "primereact/utils";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { getData, postData } from "../../services/AccessAPI";
import Loading from "../Defaults/Loading";

const Tempmapping = () => {
    let emptyResult = {
        SupervisorId: "",
        ActingsuperId: "",
        Actingfrmdat: "",
        Actingtodat: "",
    };
    const [loading, setLoading] = useState(true);
    const [waiting, setWaiting] = useState(false);
    const [results, setResults] = useState(null);
    const [result, setResult] = useState(emptyResult);
    const [submitted, setSubmitted] = useState(false);
    const [dateError, setDateError] = useState("");
    const toast = useRef(null);

    useEffect(() => {
        getData(`/GeneralMasters/Employees/TempMapping`, "Employees-TempMapping")
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
    }, []);
    const saveResult = () => {
        setSubmitted(true);
        if (result.Actingfrmdat > result.Actingtodat) {
            setDateError("Acting to Date must Greater than Acting from Date!");
        } else if (result.SupervisorId && result.ActingsuperId && result.Actingfrmdat && result.Actingtodat) {
            let _result = { ...result };
            setWaiting(true);
            postData(`/GeneralMasters/Employees/TempMapping`, _result, "Employees-TempMapping")
                .then((res) => {
                    setSubmitted(false);
                    if (res.data.Status === 3) {
                        setResults(results);
                        setResult(emptyResult);
                        toast.current.show({ severity: "success", summary: "Successful", detail: "Result Saved!", life: 3000 });
                    } else if (res.data.Status === 5) {
                        toast.current.show({ severity: "error", summary: "Unsuccessful", detail: "Record already Exist", life: 3000 });
                    } else {
                        toast.current.show({ severity: "error", summary: "Oops!", detail: "Something went wrong or Superviser Id is not found!", life: 3000 });
                    }
                })
                .catch(() => {})
                .finally(() => {
                    setWaiting(false);
                });
        }
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _result = { ...result };
        _result[`${name}`] = val;
        setResult(_result);
    };

    const resultDialogFooter = (
        <>{waiting ? <Button label="Saving.." icon="pi pi-save" style={{ backgroundColor: BASE_COLOR }} className="btn-danger" disabled={true} /> : <Button label="Save Change" icon="pi pi-save" style={{ backgroundColor: BASE_COLOR }} className="btn-danger" onClick={saveResult} />}</>
    );
    return (
        <div className="position-absolute start-50 translate-middle col-7" style={{ top: "400px" }}>
            <div className="grid crud-demo">
                <div className="col-12">
                    <div className="card">
                        <Toast ref={toast} />
                        {loading ? <Loading /> : ""}
                        <>
                            <h4>Mapping Employees Temporarly</h4>
                            <div className="card p-fluid" style={{ borderColor: BASE_COLOR }}>
                                <div className=" col-sm-12 row">
                                    <div className="field col">
                                        <label htmlFor="SupervisorId">Supervisor Id </label>
                                        <InputText id="SupervisorId" value={result.SupervisorId} onChange={(e) => onInputChange(e, "SupervisorId")} required className={classNames({ "p-invalid": submitted && !result.SupervisorId })} />
                                        {submitted && !result.SupervisorId && <small className="p-invalid text-danger">Supervisor Id is required.</small>}
                                    </div>
                                    <div className="field col">
                                        <label htmlFor="ActingsuperId">Acting supervisor Id</label>
                                        <InputText id="ActingsuperId" value={result.ActingsuperId} onChange={(e) => onInputChange(e, "ActingsuperId")} required className={classNames({ "p-invalid": submitted && !result.ActingsuperId })} />
                                        {submitted && !result.ActingsuperId && <small className="p-invalid text-danger ">Acting supervisor Id is required.</small>}
                                    </div>
                                </div>
                                <div className=" col-sm-12 row">
                                    <div className="field col">
                                        <label htmlFor="Actingfrmdat">Acting from Date</label>
                                        <InputText id="Actingfrmdat" type="date" value={result.Actingfrmdat} onChange={(e) => onInputChange(e, "Actingfrmdat")} required className={classNames({ "p-invalid": submitted && !result.Actingfrmdat })} />

                                        {submitted && !result.Actingfrmdat && <small className="p-invalid text-danger">Acting from date is required.</small>}
                                    </div>
                                    <div className="field col">
                                        <label htmlFor="Actingtodat">
                                            Acting to Date <span className="text-danger">{dateError}</span>
                                        </label>
                                        <InputText id="Actingtodat" type="date" value={result.Actingtodat} onChange={(e) => onInputChange(e, "Actingtodat")} required className={classNames({ "p-invalid": submitted && !result.Actingtodat })} />

                                        {submitted && !result.Actingtodat && <small className="p-invalid text-danger ">Acting to date is required.</small>}
                                    </div>
                                </div>
                                <br />
                            </div>
                            <br />
                            <br />
                            <div className="text-right">
                                <span className="justify-content-md-end"> {resultDialogFooter}</span>
                            </div>
                        </>
                    </div>
                </div>
            </div>
        </div>
    );
};

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(Tempmapping, comparisonFn);
