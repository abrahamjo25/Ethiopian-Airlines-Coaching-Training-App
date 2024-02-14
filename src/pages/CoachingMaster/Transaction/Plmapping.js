import React, { useState, useEffect } from "react";
import { Dropdown } from "primereact/dropdown";
import { getData, postData } from "../../../services/AccessAPI";
import { Button } from "primereact/button";

export const PLMapping = ({ invoked, myPL, onClose, updateData }) => {
    let emptyResult = {
        plCode: "",
        toCostcenter: "",
    };
    const [loading, setLoading] = useState(true);
    const [waiting, setWaiting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [results, setResults] = useState(null);
    const [costcenter, setCostcenter] = useState(null);
    const [result, setResult] = useState(emptyResult);

    useEffect(() => {
        const fetchPLData = () => {
            setLoading(true);
            getData(`/PlHeader/GetAll`, "PlHeader-Index")
                .then((res) => {
                    if (res) {
                        var myplCodes = myPL.map((item) => item.plCode);
                        var newPlCodes = res?.data?.filter((item) => !myplCodes.includes(item.plCode) && item.aproval === "Second_Approval");

                        setResults(newPlCodes);
                    }
                })
                .catch(() => {})
                .finally(() => {
                    setLoading(false);
                });
        };
        const fetchCostcenterData = () => {
            setLoading(true);
            getData(`/CostCenter/GetAll`, "PlHeader-Index")
                .then((res) => {
                    if (res) {
                        setCostcenter(res.data);
                    }
                })
                .catch(() => {})
                .finally(() => {
                    setLoading(false);
                });
        };
        if (invoked) {
            fetchPLData();
            fetchCostcenterData();
        }
    }, []);
    const saveResult = async () => {
        setSubmitted(true);
        if (result.plCode && result.toCostcenter) {
            let _result = { ...result };
            setWaiting(true);
            let data = await postData(`/PlHeader/MapPl`, _result, "PlHeader-Index");
            if (data) {
                updateData(data);
                setResult(emptyResult);
                setSubmitted(false);
                onClose();
            }
            setWaiting(false);
        }
    };
    const onPLChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _result = { ...result };
        _result[`${name}`] = val.plCode;
        setResult(_result);
    };
    const onCostcenterChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _result = { ...result };
        _result[`${name}`] = val.costCenterCode;
        setResult(_result);
    };
    return (
        <>
            <div className="grid crud-demo">
                <div className="col-12">
                    <div className="card mb-5">
                        <h4 className="text-center">PL Mapping</h4>
                        <br />
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="plCode">PL Code </label>
                                <Dropdown value={result?.plCode} options={results} onChange={(e) => onPLChange(e, "plCode")} optionLabel="plCode" filter filterBy="plCode" placeholder={loading ? "Loading..." : result?.plCode || "Select PL"} />
                                {submitted && !result.plCode && <small className="p-invalid text-danger">PL is required.</small>}
                            </div>
                        </div>
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="toCostcenter">To Cost center</label>
                                <Dropdown
                                    value={result.toCostcenter || ""}
                                    options={costcenter}
                                    onChange={(e) => onCostcenterChange(e, "toCostcenter")}
                                    optionLabel="costCenterCode"
                                    filter
                                    filterBy="costCenterCode"
                                    placeholder={loading ? "Loading..." : result?.toCostcenter || "Select Cost center"}
                                />
                                {submitted && !result.toCostcenter && <small className="p-invalid text-danger">Costcenter is required.</small>}
                            </div>
                        </div>
                        <div className="grid formgrid justify-content-between mt-4">
                            <div className="col-12 lg:col-3 lg:mb-0">
                                <Button label="Cancle" icon="pi pi-times" className="p-button-secondary p-button-text" onClick={onClose} />
                            </div>
                            <div className="col-12 lg:col-3 lg:mb-0">{waiting ? <Button label="Saving..." disabled={true} icon="pi pi-check" text /> : <Button label="Save" icon="pi pi-save" text onClick={saveResult} />}</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
