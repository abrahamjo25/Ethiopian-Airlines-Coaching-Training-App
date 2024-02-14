import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import React, { useEffect, useState } from "react";
import { deleteData, getData, postData } from "../../../services/AccessAPI";
import { Button } from "primereact/button";
import { BASE_COLOR } from "../../../services/Settings";
import { Dialog } from "primereact/dialog";

export default function Assessors({ invoked, annualplanId, plCode, onClose }) {
    let emptyResult = {
        annualPlanId: annualplanId,
        trainerId: [],
    };

    const [result, setResult] = useState(emptyResult);
    const [dialogLoading, setDialogLoading] = useState(false);
    const [waiting, setWaiting] = useState(false);
    const [existAssessors, setExistAssessors] = useState([]);
    const [newAssessors, setNewAssessors] = useState(null);
    const [removeTrainerId, setRemoveTrainerId] = useState(null);

    useEffect(() => {
        const fetchAssessors = () => {
            setDialogLoading(true);
            getData(`/AnnualPlan/GetAssignedAssessors?id=${annualplanId}`, "AnnualPlan-Index")
                .then((res) => {
                    if (res) {
                        setExistAssessors(res.data);
                    }
                })
                .catch(() => {})
                .finally(() => {
                    setDialogLoading(false);
                });
        };
        const fetchNewAssessors = () => {
            setDialogLoading(true);
            getData(`/Trainer/GetAssessorsByPlcode?plCode=${plCode}`, "AnnualPlan-Index")
                .then((res) => {
                    if (res) {
                        setNewAssessors(res.data);
                    }
                })
                .catch(() => {})
                .finally(() => {
                    setDialogLoading(false);
                });
        };
        if (invoked) {
            fetchAssessors();
            fetchNewAssessors();
        }
    }, []);
    const saveResult = async () => {
        if (annualplanId && existAssessors?.length > 0) {
            setWaiting(true);
            let data = await postData(`/AnnualPlan/AddAssessor`, result, "AnnualPlan-Index");
            if (data) {
                // setExistAssessors((prev) => [...prev, data]);
                setResult(emptyResult);
                onClose();
            }

            setWaiting(false);
        }
    };
    const findAssessor = (id) => {
        for (let i = 0; i < existAssessors?.length; i++) {
            if (existAssessors[i]?.id === id) {
                return true;
            }
        }
        return false;
    };
    const findUnsavedAssessor = (id) => {
        let _result = result?.trainerId;
        for (let i = 0; i < _result?.length; i++) {
            if (_result[i] === id) {
                return true;
            }
        }
        return false;
    };
    const onDropdownAssessorChange = (e) => {
        if (!findAssessor(e.value.id)) {
            setExistAssessors((oldArray) => [...oldArray, e.value]);
            setResult((prev) => ({
                ...prev,
                trainerId: [...prev.trainerId, e.value.id],
            }));
        }
    };
    const removeAssessor = (rowData) => {
        if (findUnsavedAssessor(rowData.id)) {
            let _Assessor = existAssessors?.filter((val) => val.id !== rowData.id);
            setExistAssessors(_Assessor);
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
            setExistAssessors(existAssessors.filter((item) => item.id !== data?.id));
            setRemoveTrainerId(null);
        }
        setWaiting(false);
    };
    const removeAssessorBodyTemplate = (rowData) => {
        return (
            <div className="buttonset">
                <Button label="Remove" icon="pi pi-trash" className="p-button-outlined p-button-danger mr-2 mb-2" onClick={() => removeAssessor(rowData)} />
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
            <h4>Assessors</h4>
            <DataTable value={existAssessors} dataKey="Id" className="datatable-responsive" rows={5} loading={dialogLoading} responsiveLayout="scroll" emptyMessage="No Available choaches selected.">
                <Column field="employeeId" header="Employee Id" className="p-column-title"></Column>
                <Column field="fullName" header="Name" className="p-column-title"></Column>
                <Column body={removeAssessorBodyTemplate} headerStyle={{ width: "24%", minWidth: "10rem" }}></Column>
            </DataTable>
            <div className="grid formgrid justify-content-between mt-8 mb-6">
                <div className="col-12 lg:col-4 lg:mb-0">
                    <Dropdown options={newAssessors} onChange={(e) => onDropdownAssessorChange(e)} optionLabel="employeeId" filter filterBy="employeeId" emptyMessage="No authorized assessor found for this PL" placeholder="Choose Assessor Id" />
                </div>
                <div className="col-12 lg:col-6 lg:mb-0">
                    <Button label="Cancle" icon="pi pi-times" className="p-button-secondary p-button-text" onClick={onClose} />
                    {waiting ? <Button label="Saving..." disabled={true} icon="pi pi-check" text /> : <Button label="Save" icon="pi pi-save" disabled={result?.trainerId?.length > 0 ? false : true} text onClick={saveResult} />}
                </div>
            </div>
            <Dialog visible={removeTrainerId} style={{ width: "450px" }} header="Confirm" modal footer={removeTrainerIdFooter} onHide={hideRemoveTrainerId}>
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                    <span>Are you sure you want to delete?</span>
                </div>
            </Dialog>
        </div>
    );
}
