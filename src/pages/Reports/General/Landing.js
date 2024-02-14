import React, { useRef, useState, useEffect } from "react";
import { Chart } from "primereact/chart";
import { useHistory } from "react-router";
import { TabView, TabPanel } from "primereact/tabview";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import "react-circular-progressbar/dist/styles.css";
import { barOptions } from "../../../services/BarProvider";
import { pieOptions } from "../../../services/PieProvider";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { PulseLoader } from "react-spinners";
import { BASE_COLOR } from "../../../services/Settings";
import ChartLoading from "../../Defaults/ChartLoading";
import { getData } from "../../../services/AccessAPI";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import ActionAndCoaching from "./ActionAndCoaching";

const fetchData = async () => {
    const res = await getData(`/GeneralReport/GetReport`, "GeneralReport-Index");
    localStorage.setItem("generalReport", JSON.stringify(res?.data));
    return res.data;
};

export const Landing = () => {
    const history = useHistory();
    const toast = useRef();
    const [loading, setLoading] = useState(true);

    const [annualPlan, setAnnualPlan] = useState(null);
    const [assessmentReport, setAssessmentReport] = useState(null);
    const [interimReport, setIterimReport] = useState(null);
    const [selectedCostcenter, setSelectedCostcenter] = useState(null);
    const [selectedDivision, setSelectedDivision] = useState(null);
    const [division, setDivision] = useState(null);
    const [getCoaching, setGetCoaching] = useState(false);

    useEffect(() => {
        const storedData = localStorage.getItem("generalReport");
        if (storedData) {
            try {
                const parsedData = JSON.parse(storedData);
                setLoading(false);
                getLocalData(parsedData);
            } catch (err) {
                console.log("no stroed data");
            }
        }

        fetchData()
            .then((data) => {
                updateAnnualPlanData(data);
                updateInterimData(data);
                updateAssessmentData(data);
            })
            .catch((error) => {
                // Handle any errors
            })
            .finally(() => {
                setLoading(false);
            });
        getDivision();
    }, []);
    const getDivision = () => {
        getData(`/Division/GetAll`, "GeneralReport-Index")
            .then((res) => {
                if (res) {
                    setDivision(res.data);
                }
            })
            .catch(() => {});
    };
    const getLocalData = (data) => {
        updateAnnualPlanData(data);
        updateInterimData(data);
        updateAssessmentData(data);
    };
    const updateAnnualPlanData = (data) => {
        const labels = ["On_Progress", "Waiting", "Expired"];
        const annualPlanData = groupDataByStatus(data, "annualplanStatus");
        const datas = labels.map((label) => annualPlanData[label] || 0);
        setAnnualPlan({
            labels: labels,
            datasets: [
                {
                    backgroundColor: ["#36A2EB", "#FFA726", "#FF6384"],
                    hoverBackgroundColor: ["#36A2EB", "#FFA726", "#FF6384"],
                    data: datas,
                },
            ],
        });
    };
    const updateInterimData = (data) => {
        const labels = ["Taken", "Not_Taken"];
        const actionPlanData = groupDataByStatus(data, "interimStatus");
        const datas = labels.map((label) => actionPlanData[label] || 0);
        setIterimReport({
            labels: labels,
            datasets: [
                {
                    backgroundColor: ["#36A2EB", "#FFA726"],
                    hoverBackgroundColor: ["#36A2EB", "#FFA726"],
                    data: datas,
                },
            ],
        });
    };
    const updateAssessmentData = (data) => {
        const labels = ["On_Progress", "Waiting", "Not_Started", "Expired"];
        const annualPlanData = groupDataByStatus(data, "assessmentStatus");
        const datas = labels.map((label) => annualPlanData[label] || 0);
        setAssessmentReport({
            labels: labels,
            datasets: [
                {
                    backgroundColor: ["#36A2EB", "#FFA726", "#A52A2A", "#FF6384"],
                    hoverBackgroundColor: ["#36A2EB", "#FFA726", "#A52A2A", "#FF6384"],
                    data: datas,
                },
            ],
        });
    };
    // Function to group data by annualplanStatus and get count
    const groupDataByStatus = (data, filter) => {
        const groupedData = data?.reduce((acc, curr) => {
            const status = curr[filter];
            if (acc[status]) {
                acc[status] += 1;
            } else {
                acc[status] = 1;
            }
            return acc;
        }, {});
        return groupedData;
    };
    const getReportByDiv = (divisionCode) => {
        const storedData = localStorage.getItem("generalReport");
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            const result = parsedData?.filter((key) => key.divisionCode.toLowerCase() === divisionCode.toLowerCase());
            getLocalData(result);
        }
    };
    const getReportByCost = (costcenterCode) => {
        const storedData = localStorage.getItem("generalReport");
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            const result = parsedData.filter((item) => item.costcenterCode.toLowerCase() === costcenterCode.toLowerCase());
            getLocalData(result);
        }
    };

    const viewPLReport = () => {
        history.push(`reports-developed-pl-report`);
    };
    const viewAssessmentReport = () => {
        history.push(`/reports-coaching-assessment-report`);
    };

    const viewAnnualPlanReport = () => {
        history.push(`/reports-annual-plan-report`);
    };
    const viewInterimReport = () => {
        history.push(`/reports-interim-assessment-report`);
    };
    const onDivisionChange = (e) => {
        let val = (e.target && e.target.value) || "";
        setSelectedDivision(val);
        getReportByDiv(val.divisionCode);
    };
    const onInputChange = (e) => {
        const val = (e.target && e.target.value) || "";
        setSelectedCostcenter(val);
    };
    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center py-3">
            <h5 className="m-0">Report Analytics {selectedDivision?.divisionCode ? `[${selectedDivision?.divisionCode}]` : ""}</h5>
            <div className="grid gap-2">
                <Dropdown value={selectedDivision} filter options={division} optionLabel="divisionCode" onChange={(e) => onDivisionChange(e)} placeholder="Filter by Division" />
                <InputText value={selectedCostcenter ? selectedCostcenter : ""} onChange={(e) => onInputChange(e)} placeholder="Search by Cost center" />
                <Button label="Search" className="p-button-raised p-button" disabled={selectedCostcenter ? false : true} onClick={() => getReportByCost(selectedCostcenter)} />
            </div>
        </div>
    );
    const planHeader = <Button label="Plan Summary" icon="pi pi-chevron-right" onClick={() => setGetCoaching(false)} className="p-button-raised p-button-secondary p-button-text" />;
    const resultHeader = <Button label="Coaching & Assessment" icon="pi pi-chevron-right" onClick={() => setGetCoaching(true)} className="p-button-raised p-button-secondary p-button-text" />;
    return (
        <div className="">
            <Toast ref={toast} />
            <div className="grid dashboard row">
                <div className="col-12 md:col-12">
                    <div className="overview-box">{header}</div>
                </div>
            </div>
            {loading ? <ChartLoading /> : ""}
            <div className="dashboard row">
                <TabView className="surface-ground">
                    <TabPanel header={planHeader}>
                        <div className="grid">
                            <div className="md:col-4 col-12">
                                <div className="overview-box ">
                                    <h5>Annual Plan Summary</h5>
                                    {annualPlan ? (
                                        <>
                                            <Chart type="pie" data={annualPlan} options={pieOptions} plugins={[ChartDataLabels]} />
                                            <button type="button" className="btn btn-outline-success float-end" onClick={viewAnnualPlanReport}>
                                                <i className="pi pi-eye"></i> View Detail
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <div className="">
                                                <Chart type="bar" data={annualPlan} options={barOptions} />
                                                <span className="position-absolute top-50 offset-5" style={{ color: "#23547b" }}>
                                                    {loading ? <PulseLoader color={BASE_COLOR} speedMultiplier={0.5} /> : "No summary"}
                                                </span>
                                            </div>
                                            <button type="button" disabled={true} className="btn btn-outline-success float-end" onClick={viewPLReport}>
                                                <i className="pi pi-eye"></i> View Detail
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="col-12 md:col-4">
                                <div className="overview-box ">
                                    <h5>Assessment Progress Summary </h5>
                                    {assessmentReport ? (
                                        <>
                                            <Chart type="pie" data={assessmentReport} options={pieOptions} plugins={[ChartDataLabels]} />
                                            <button type="button" className="btn btn-outline-success float-end" onClick={viewAssessmentReport}>
                                                <i className="pi pi-eye"></i> View Detail
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <div className="">
                                                <Chart type="pie" options={pieOptions} />
                                                <span className="position-absolute top-50 offset-5" style={{ color: "#23547b" }}>
                                                    {loading ? <PulseLoader color={BASE_COLOR} speedMultiplier={0.5} /> : "No summary"}
                                                </span>
                                            </div>
                                            <button type="button" disabled={true} className="btn btn-outline-success float-end" onClick={viewPLReport}>
                                                <i className="pi pi-eye"></i> View Detail
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="md:col-4 col-12">
                                <div className="overview-box ">
                                    <h5>Interim Assessment</h5>
                                    {interimReport ? (
                                        <>
                                            <Chart type="pie" data={interimReport} options={pieOptions} plugins={[ChartDataLabels]} />
                                            <button type="button" className="btn btn-outline-success float-end" onClick={viewInterimReport}>
                                                <i className="pi pi-eye"></i> View Detail
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <div className="">
                                                <Chart type="pie" options={pieOptions} />
                                                <span className="position-absolute top-50 offset-5" style={{ color: "#23547b" }}>
                                                    {loading ? <PulseLoader color={BASE_COLOR} speedMultiplier={0.5} /> : "No summary"}
                                                </span>
                                            </div>
                                            <button type="button" disabled={true} className="btn btn-outline-success float-end" onClick={viewPLReport}>
                                                <i className="pi pi-eye"></i> View Detail
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </TabPanel>
                    <TabPanel header={resultHeader}>
                        <ActionAndCoaching groupDataByStatus={groupDataByStatus} getCoaching={getCoaching} />
                    </TabPanel>
                </TabView>
            </div>
        </div>
    );
};
