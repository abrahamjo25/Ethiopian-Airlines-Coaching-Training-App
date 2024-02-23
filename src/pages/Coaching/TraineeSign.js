import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { getData, putData } from "../../services/AccessAPI";
import "../../assets/css/style.css";
import { Tooltip } from "primereact/tooltip";

const TraineeSign = () => {
    let emptyResult = {
        id: null,
        coachingAction: "",
        tsfn: null,
        ataChapter: null,
    };

    const [loading, setLoading] = useState(true);
    const [waiting, setWaiting] = useState(false);
    const [message, setMessage] = useState("");
    const [results, setResults] = useState(null);
    const [result, setResult] = useState(emptyResult);
    const [submitted, setSubmitted] = useState(false);
    const [TraineeDialog, setTraineeDialog] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        fetchData();
    }, []);
    const fetchData = () => {
        getData(`/Coaching/GetForTrainee`, "TraineSign-Index")
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
    const hideTraineeDialog = () => {
        setMessage("");
        setResult(emptyResult);
        setTraineeDialog(false);
    };
    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _result = { ...result };
        _result[`${name}`] = val;
        setResult(_result);
    };
    const takeTraineeAction = async (res) => {
        setSubmitted(true);
        if (result.coachingAction) {
            if (result?.RequireReference && !result?.ataChapter) {
                toast.current.show({ severity: "error", summary: "Fill required fields", life: 2000 });
            } else if (result?.RequireTSFN && !result?.tsfn) {
                toast.current.show({ severity: "error", summary: "Fill required fields", life: 2000 });
            } else {
                setSubmitted(false);
                setWaiting(true);
                let res = await putData("/Coaching/TraineeAction", result, "TraineSign-Index");
                if (res) {
                    setResults((prev) =>
                        prev?.map((item) => {
                            if (item?.id === res.id) {
                                return { ...item, traineeApproval: "TraineeAction" };
                            } else {
                                return item;
                            }
                        })
                    );
                }
                hideTraineeDialog();
                setWaiting(false);
            }
        }
    };
    const TraineeSignAction = (res) => {
        let _result = { ...result };
        _result[`id`] = res?.id;
        setResult(_result);
        setTraineeDialog(true);
    };
    const editSignAction = (res) => {
        fetchData();
        let _result = { ...res };
        setResult(_result);
        setTraineeDialog(true);
    };
    const signAction = (rowData) => {
        return <> {waiting ? <Button label="Signing.." icon="pi pi-spin pi-spinner" disabled={true} /> : <Button label="Sign" icon="pi pi-check" onClick={() => takeTraineeAction(rowData)} />}</>;
    };
    const traineeAction = (rowData) => {
        if (rowData?.coachApproval === "Rejected") {
            return (
                <>
                    <Button label="Edit" icon="pi pi-pencil" className="p-button-outlined p-button-success " style={{ backgroundColor: "white", color: "#2e7d32" }} onClick={() => editSignAction(rowData)} />
                </>
            );
        } else if (rowData?.traineeApproval === "Ready") {
            return (
                <>
                    <Button label="Take Action" className="p-button-outlined p-button-success " style={{ backgroundColor: "white", color: "#2e7d32" }} onClick={() => TraineeSignAction(rowData)} />
                </>
            );
        } else if (rowData?.traineeApproval === "TraineeAction") {
            return (
                <>
                    <Button label="Signed" disabled={true} />
                </>
            );
        }
    };
    const statusBody = (rowData) => {
        if (rowData?.coachApproval === "CoachAction") {
            return <span className={"customer-badge " + rowData?.coachApproval}>Accepted</span>;
        } else {
            return (
                <>
                    <Tooltip target=".customer-badge" position="top" />
                    <span className={"customer-badge " + rowData?.coachApproval} data-pr-tooltip={rowData?.remark}>
                        {rowData?.coachApproval}
                    </span>
                </>
            );
        }
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
            <h4 className="m-0">Trainee sign</h4>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
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
                            value={results}
                            dataKey="Id"
                            paginator
                            loading={loading}
                            rows={10}
                            rowsPerPageOptions={[5, 10, 25]}
                            className="datatable-responsive"
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} results"
                            globalFilter={globalFilter}
                            emptyMessage="No results found."
                            header={header}
                            responsiveLayout="scroll"
                            rowGroupMode="rowspan"
                            groupRowsBy="plCode"
                            sortMode="single"
                        >
                            <Column field="plCode" headerStyle={{ width: "10%", minWidth: "4rem" }} className="p-column-title"></Column>
                            <Column field="" header="No" body={rowCount} className="p-column-title"></Column>
                            <Column field="taskCode" header="Task Code" className="p-column-title"></Column>
                            <Column field="task" header="Description" className="p-column-title"></Column>
                            <Column field="coachApproval" header="Status" body={statusBody} className="p-column-title"></Column>
                            <Column header="Take Action" body={traineeAction} className="p-column-title"></Column>
                        </DataTable>
                        <Dialog visible={TraineeDialog} style={{ width: "600px" }} header="" modal className="p-fluid" footer={signAction} onHide={hideTraineeDialog}>
                            <div className="card p-fluid">
                                <h4 className="text-center">Sign the Action Plan</h4>
                                <span className="text-danger text-center">{message}</span>
                                <br />
                                <div className="user-card">
                                    <div className="formgrid grid">
                                        <div className="field col">
                                            <label htmlFor="coachingAction">Trainee Remarks </label>
                                            <InputTextarea
                                                id="coachingAction"
                                                cols={25}
                                                rows={5}
                                                placeholder="Write your remark"
                                                value={result.coachingAction}
                                                onChange={(e) => onInputChange(e, "coachingAction")}
                                                autoResize
                                                required
                                                className={classNames({ "p-invalid": submitted && !result.coachingAction })}
                                            />
                                            {submitted && !result.coachingAction && <span className="text-danger">This field is required!</span>}
                                        </div>
                                    </div>
                                    <div className="formgrid grid">
                                        {result?.RequireReference && (
                                            <div className="field col">
                                                <label htmlFor="ataChapter">ATA Number</label>
                                                <InputText id="ataChapter" value={result.ataChapter} onChange={(e) => onInputChange(e, "ataChapter")} placeholder="Enter Reference" />
                                                {submitted && result?.RequireReference && !result.ataChapter && <span className="text-danger">This field is required!</span>}
                                            </div>
                                        )}
                                        {result?.RequireTSFN && (
                                            <div className="field col">
                                                <label htmlFor="TSFNNumbers">TSFN Number</label>
                                                <InputText id="TSFNNumbers" value={result.tsfn} onChange={(e) => onInputChange(e, "tsfn")} placeholder="Enter TSFN" />
                                                {submitted && result?.RequireTSFN && !result.tsfn && <span className="text-danger">This field is required!</span>}
                                            </div>
                                        )}
                                    </div>
                                </div>
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

export default React.memo(TraineeSign, comparisonFn);
