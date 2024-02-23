import { Chart } from "primereact/chart";
import React, { useEffect, useState } from "react";
import { PulseLoader } from "react-spinners";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useHistory } from "react-router-dom";
import { getData } from "../../../services/AccessAPI";
import { pieOptions } from "../../../services/PieProvider";
import { BASE_COLOR } from "../../../services/Settings";
const fetchData = async () => {
    const res = await getData(`/GeneralReport/GetCoachingReportByDivision`, "GeneralReport-Index");
    localStorage.setItem("generalCoachingReport", JSON.stringify(res?.data));
    return res.data;
};

const ActionAndCoaching = ({ groupDataByStatus, getCoaching, costCenterCode }) => {
    const [loading, setLoading] = useState(true);
    const [coachingStatus, setCoachingStatus] = useState(null);
    const [actionPlan, setActionPlan] = useState(null);

    const history = useHistory();
    useEffect(() => {
        const storedData = localStorage.getItem("generalCoachingReport");
        if (storedData) {
            try {
                const parsedData = JSON.parse(storedData);
                setLoading(false);
                if (costCenterCode) {
                    let result = parsedData.filter((item) => item.costcenterCode.toLowerCase() === costCenterCode.toLowerCase());
                    getLocalData(result);
                } else {
                    getLocalData(parsedData);
                }
            } catch (err) {
                console.log("no stroed data");
            }
        }

        getCoaching && !costCenterCode &&
        fetchData()
            .then((data) => {
                updateActionPlanData(data);
                updateCoachingData(data);
            })
            .catch((error) => {
                // Handle any errors
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);
    const getLocalData = (data) => {
        updateActionPlanData(data);
        updateCoachingData(data);
    };
    const updateCoachingData = (data) => {
        const labels = ["Completed", "On_Progress", "Not_Started", "Expired"];
        const annualPlanData = groupDataByStatus(data, "coachingStatus");
        const datas = labels.map((label) => annualPlanData[label] || 0);
        setCoachingStatus({
            labels: labels,
            datasets: [
                {
                    backgroundColor: ["#008080", "#36A2EB", "#FFA726", "#FF6384"],
                    hoverBackgroundColor: ["#008080", "#36A2EB", "#FFA726", "#FF6384"],
                    data: datas,
                },
            ],
        });
    };
    const updateActionPlanData = (data) => {
        const labels = ["Taken", "Not_Taken"];
        const actionPlanData = groupDataByStatus(data, "actionplanStatus");
        const datas = labels.map((label) => actionPlanData[label] || 0);
        setActionPlan({
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
    const viewCoachingReport = () => {
        history.push(`/reports-coaching-completion-report`);
    };
    const viewActionPlanReport = () => {
        history.push(`/reports-action-plan-report`);
    };
    return (
        <div className="grid">
            <div className="md:col-4 col-12">
                <div className="overview-box ">
                    <h5>Action Plan Summary</h5>
                    {actionPlan ? (
                        <>
                            <Chart type="pie" data={actionPlan} options={pieOptions} plugins={[ChartDataLabels]} />
                            <button type="button" className="btn btn-outline-success float-end" onClick={viewActionPlanReport}>
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
                            <button type="button" disabled={true} className="btn btn-outline-success float-end">
                                <i className="pi pi-eye"></i> View Detail
                            </button>
                        </>
                    )}
                </div>
            </div>
            <div className="col-12 md:col-4">
                <div className="overview-box ">
                    <h5>Coaching Progress Summary </h5>
                    {coachingStatus ? (
                        <>
                            <Chart type="pie" data={coachingStatus} options={pieOptions} plugins={[ChartDataLabels]} />
                            <button type="button" className="btn btn-outline-success float-end" onClick={viewCoachingReport}>
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
                            <button type="button" disabled={true} className="btn btn-outline-success float-end">
                                <i className="pi pi-eye"></i> View Detail
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ActionAndCoaching;
