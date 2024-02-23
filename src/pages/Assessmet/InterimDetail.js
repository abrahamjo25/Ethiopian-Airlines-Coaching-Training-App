import React, { useState, useEffect, useRef } from "react";
import { BASE_COLOR } from "../../services/Settings";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { getData, postData } from "../../services/AccessAPI";
import "../../assets/css/style.css";
import moment from "moment/moment";
import { useLocation } from "react-router-dom";
import "../../assets/css/DataTableDemo.css";

const InterimDetail = () => {
    const location = useLocation();
    const { id, fullName } = location.state;
    let emptyResult = {
        annualPlanId: id,
        interimId: null,
        isPerformed: false,
    };
    const [result, setResult] = useState(emptyResult);
    const [results, setResults] = useState(null);
    const [intrims, setIntrims] = useState(null);
    const [waiting, setWaiting] = useState(false);
    const [loading, setLoading] = useState(false);
    const [dialogLoading, setDialogLoading] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [selectedResults, setSelectedResults] = useState(null);
    const [intrimDialog, setIntrimDialog] = useState(false);

    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        setLoading(true);
        fetchData();
    }, []);
    const fetchData = () => {
        getData(`/MonthlyInterim/GetByAnnualPlanId?annualPlanId=${id}`, "Interim-Assessment")
            .then((res) => {
                if (res) {
                    setResults(res.data);
                }
            })
            .catch((error) => {})
            .finally(() => {
                setLoading(false);
            });
    };
    const intrimDialogHide = () => {
        setIntrimDialog(false);
        setSelectedResults(null);
    };
    const postIntrim = async () => {
        if (selectedResults !== null) {
            setWaiting(true);
            let data = await postData(`/MonthlyInterim/Create`, result, "Interim-Assessment");
            if (data) {
                fetchData();
            }

            intrimDialogHide();
            setWaiting(false);
        }
    };
    const onSelectedResultsChange = (selectedItems) => {
        setSelectedResults(selectedItems);
        const updatedResult = result.map((res) => ({
            ...res,
            isPerformed: selectedItems.some((selected) => selected.id === res.interimId),
        }));

        setResult(updatedResult);
    };

    const takeIntrim = () => {
        setIntrimDialog(true);
        setDialogLoading(true);
        getData(`/Interim/GetAll`, "Interim-Assessment")
            .then((res) => {
                setIntrims(res.data);
                const updatedIntrims = res.data?.map((item) => ({
                    annualPlanId: id,
                    interimId: item.id,
                    isPerformed: false,
                }));
                setResult(updatedIntrims);
            })
            .catch(() => {})
            .finally(() => {
                setDialogLoading(false);
            });
    };
    const takenBody = (data) => {
        return <span>{moment(data?.assessmentDate).format("MMM Do YY")}</span>;
    };
    const isPerformedBody = (data) => {
        return <>{data.isPerformed ? <span className="customer-badge record-status-Active"> True</span> : <span className="customer-badge record-status-InActive"> False</span>}</>;
    };
    const intrimDialogFooter = () => {
        return (
            <>
                <Button label="Cancel" icon="pi pi-times" className="p-button-text btn-success" onClick={intrimDialogHide} />
                {waiting ? <Button label="Saving.." disabled={true} style={{ backgroundColor: BASE_COLOR }} /> : <Button label="Save" icon="pi pi-check" style={{ backgroundColor: BASE_COLOR }} onClick={postIntrim} />}
            </>
        );
    };
    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <Button label="Take New" icon="pi pi-plus" style={{ backgroundColor: BASE_COLOR }} onClick={takeIntrim} />
            <h4 className="m-0">{fullName}</h4>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    return (
        <>
            <div className="datatable-responsive-demo grid crud-demo">
                <div className="col-12">
                    <div className="card">
                        <Toast ref={toast} />
                        <DataTable
                            ref={dt}
                            value={results}
                            dataKey="id"
                            paginator
                            loading={loading}
                            rows={8}
                            rowsPerPageOptions={[5, 10, 25]}
                            className="p-datatable-responsive-demo "
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} resultss"
                            globalFilter={globalFilter}
                            emptyMessage="No resultss found."
                            header={header}
                            rowGroupMode="rowspan"
                            groupRowsBy="assessmentDate"
                        >
                            <Column field="assessmentDate" header="Taken on" body={takenBody} className="p-column-title"></Column>
                            <Column field="interim" header="Interim" className="p-column-title"></Column>
                            <Column field="isPerformed" header="is Performed" body={isPerformedBody} className="p-column-title"></Column>
                        </DataTable>
                        <Dialog visible={intrimDialog} style={{ width: "1000px" }} maximizable footer={intrimDialogFooter} onHide={intrimDialogHide}>
                            <DataTable
                                ref={dt}
                                value={intrims}
                                selection={selectedResults}
                                onSelectionChange={(e) => onSelectedResultsChange(e.value)}
                                dataKey="id"
                                paginator
                                rows={5}
                                loading={dialogLoading}
                                rowsPerPageOptions={[5, 10, 25]}
                                className="datatable-responsive"
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Employees"
                                emptyMessage="No Resultss found."
                                responsiveLayout="scroll"
                            >
                                <Column selectionMode="multiple"></Column>
                                <Column field="category" header="Category"></Column>
                                <Column field="description" header="Description"></Column>
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

export default React.memo(InterimDetail, comparisonFn);
