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
import GetCoaching from "./GetCoaching";

const fetchData = async () => {
    const res = await getData(`/SectionReport/SectionReport`, "SectionReport-Index");
    localStorage.setItem("specificReport", JSON.stringify(res?.data));
    return res.data;
};

export const ReportLanding = () => {
    const history = useHistory();
    const toast = useRef();
    const [loading, setLoading] = useState(true);

    const [annualPlan, setAnnualPlan] = useState(null);
    const [assessmentReport, setAssessmentReport] = useState(null);
    const [interimReport, setIterimReport] = useState(null);
    const [getCoaching, setGetCoaching] = useState(false);

    useEffect(() => {
        const storedData = localStorage.getItem("specificReport");
        if (storedData) {
            try {
                const parsedData = JSON.parse(storedData);
                updateAnnualPlanData(parsedData);
                updateInterimData(parsedData);
                updateAssessmentData(parsedData);

                setLoading(false);
            } catch (err) {
                console.log("no data stored!");
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
    }, []);

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
            if (status !== null && status !== "") {
                if (acc[status]) {
                    acc[status] += 1;
                } else {
                    acc[status] = 1;
                }
            }
            return acc;
        }, {});
        return groupedData;
    };

    const viewPLReport = () => {
        history.push({
            pathname: `/reports-developed-pl-report`,
        });
    };
    const viewAssessmentReport = () => {
        history.push({
            pathname: `/view-management-reports-assessment`,
        });
    };
    const viewAnnualPlanReport = () => {
        history.push({
            pathname: `/view-management-reports-annualplan`,
        });
    };
    const viewInterimReport = () => {
        history.push({
            pathname: `/view-management-reports-interim`,
        });
    };

    const planHeader = <Button label="Plan Summary" icon="pi pi-chevron-right" onClick={() => setGetCoaching(false)} className="p-button-raised p-button-secondary p-button-text" />;
    const resultHeader = <Button label="Coaching" icon="pi pi-chevron-right" onClick={() => setGetCoaching(true)} className="p-button-raised p-button-secondary p-button-text" />;
    return (
        <div className="">
            <Toast ref={toast} />
            <div className="text-center">
                <h4 style={{ color: "#23547b" }}>Coaching Summary</h4>
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
                        <GetCoaching groupDataByStatus={groupDataByStatus} getCoaching={getCoaching} />
                    </TabPanel>
                </TabView>
            </div>
        </div>
    );
};
