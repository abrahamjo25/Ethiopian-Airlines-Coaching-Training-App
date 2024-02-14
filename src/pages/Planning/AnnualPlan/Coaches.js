import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import React, { useEffect, useState } from "react";
import { deleteData, getData, postData } from "../../../services/AccessAPI";
import { Button } from "primereact/button";
import { BASE_COLOR } from "../../../services/Settings";
import { Dialog } from "primereact/dialog";

export default function Coaches({ invoked, annualplanId, plCode, onClose }) {
    let emptyResult = {
        annualPlanId: annualplanId,
        trainerId: [],
    };

    const [result, setResult] = useState(emptyResult);
    const [dialogLoading, setDialogLoading] = useState(false);
    const [waiting, setWaiting] = useState(false);
    const [existCoaches, setExistCoaches] = useState([]);
    const [newCoaches, setNewCoaches] = useState(null);
    const [removeTrainerId, setRemoveTrainerId] = useState(null);

    useEffect(() => {
        const fetchCoaches = () => {
            setDialogLoading(true);
            getData(`/AnnualPlan/GetAssignedCoaches?id=${annualplanId}`, "AnnualPlan-Index")
                .then((res) => {
                    if (res) {
                        setExistCoaches(res.data);
                    }
                })
                .catch(() => {})
                .finally(() => {
                    setDialogLoading(false);
                });
        };
        const fetchNewCoaches = () => {
            setDialogLoading(true);
            getData(`/Trainer/GetCoachesByPlcode?plCode=${plCode}`, "AnnualPlan-Index")
                .then((res) => {
                    if (res) {
                        setNewCoaches(res.data);
                    }
                })
                .catch(() => {})
                .finally(() => {
                    setDialogLoading(false);
                });
        };
        if (invoked) {
            fetchCoaches();
            fetchNewCoaches();
        }
    }, []);
    const saveResult = async () => {
        if (annualplanId && existCoaches?.length > 0) {
            setWaiting(true);
            let data = await postData(`/AnnualPlan/AddCoach`, result, "AnnualPlan-Index");
            if (data) {
                // setExistCoaches((prev) => [...prev, data]);
                setResult(emptyResult);
                onClose();
            }
            setWaiting(false);
        }
    };
    const findCoach = (id) => {
        for (let i = 0; i < existCoaches?.length; i++) {
            if (existCoaches[i]?.id === id) {
                return true;
            }
        }
        return false;
    };
    const findUnsavedCoach = (id) => {
        let _result = result?.trainerId;
        for (let i = 0; i < _result?.length; i++) {
            if (_result[i] === id) {
                return true;
            }
        }
        return false;
    };

    const onDropdownCoachChange = (e) => {
        if (!findCoach(e.value.id)) {
            setExistCoaches((oldArray) => [...oldArray, e.value]);
            setResult((prev) => ({
                ...prev,
                trainerId: [...prev.trainerId, e.value.id],
            }));
        }
    };
    const removeCoach = (rowData) => {
        debugger;

        if (findUnsavedCoach(rowData.id)) {
            let _coach = existCoaches?.filter((val) => val.id !== rowData.id);
            setExistCoaches(_coach);
            setResult((prev) => ({
                ...prev,
                trainerId: prev.trainerId?.filter((key) => key !== rowData.id),
            }));
        } else {
            setRemoveTrainerId(rowData.id);
        }
    };
    const removeTrainer = async () => {
        setWaiting(true);
        let data = await deleteData(`/AnnualPlan/RemoveTrainer?id=${removeTrainerId}`, "AnnualPlan-Index");
        if (data) {
            setExistCoaches(existCoaches.filter((item) => item.id !== data?.id));
            setRemoveTrainerId(null);
        }
        setWaiting(false);
    };
    const removeCoachBodyTemplate = (rowData) => {
        return (
            <div className="buttonset">
                <Button label="Remove" icon="pi pi-trash" className="p-button-outlined p-button-danger mr-2 mb-2" onClick={() => removeCoach(rowData)} />
            </div>
        );
    };
    const hideRemoveTrainerId = () => {
        setRemoveTrainerId(null);
    };
    const removeTrainerIdFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideRemoveTrainerId} />
            {waiting ? <Button label="Deleting" icon="pi pi-spin pi-spinner" style={{ backgroundColor: BASE_COLOR }} disabled={true} /> : <Button label="Yes" icon="pi pi-check" style={{ backgroundColor: BASE_COLOR }} className="" onClick={removeTrainer} />}
        </>
    );
    return (
        <div>
            <h4>Coaches</h4>
            <DataTable value={existCoaches} dataKey="Id" className="datatable-responsive" rows={5} loading={dialogLoading} responsiveLayout="scroll" emptyMessage="No Available choaches selected.">
                <Column field="employeeId" header="Employee Id" className="p-column-title"></Column>
                <Column field="fullName" header="Name" className="p-column-title"></Column>
                <Column body={removeCoachBodyTemplate} headerStyle={{ width: "24%", minWidth: "10rem" }}></Column>
            </DataTable>
            <div className="grid formgrid justify-content-between mt-8 mb-6">
                <div className="col-12 lg:col-4 lg:mb-0">
                    <Dropdown options={newCoaches} onChange={(e) => onDropdownCoachChange(e)} optionLabel="employeeId" filter filterBy="employeeId" emptyMessage="No Authorized Coach found for this PL" placeholder="Choose Coach Id" />
                </div>
                <div className="col-12 lg:col-6 lg:mb-0">
                    <Button label="Cancle" icon="pi pi-times" className="p-button-secondary p-button-text" onClick={onClose} />
                    {waiting ? <Button label="Saving..." disabled={true} icon="pi pi-check" text /> : <Button label="Save" icon="pi pi-save" disabled={result?.trainerId?.length > 0 ? false : true} text onClick={saveResult} />}
                </div>
            </div>
            <Dialog visible={removeTrainerId} style={{ width: "450px" }} header="Confirm" modal footer={removeTrainerIdFooter} onHide={hideRemoveTrainerId}>
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                    <span>Are you sure you want to remove?</span>
                </div>
            </Dialog>
        </div>
    );
}
