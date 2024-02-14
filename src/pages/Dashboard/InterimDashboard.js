import React, { useEffect, useState } from "react";
import { Chart } from "primereact/chart";
import { getData } from "../../services/AccessAPI";
import { basicOptions } from "./ChartOption";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { CircularProgressbar } from "react-circular-progressbar";
import ProgressProvider from "../../services/ProgressProvider";
const InterimDashboard = (props) => {
    const [loading, setLoading] = useState(false);
    const [coahing, setCoaching] = useState([]);
    const year = props.year;
    const semiYear = props.semiYear;
    const selectedOption = props.selectedOption;
    const selectedDivision = props.selectedDivision;

    useEffect(() => {
        fetchData();
    }, [props.year, props.semiYear, props.selectedOption, props.selectedDivision]);
    const fetchData = () => {
        let url = "";
        let yearPath = "";

        if (year) {
            yearPath = year;
        } else {
            yearPath = `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`;
        }
        if (selectedDivision) {
            url = `/Dashboard/CoachingDashboard/InterimDashboard?Finyear=${yearPath}&Division=${selectedDivision.Divisioncode}`;
        } else {
            url = `/Dashboard/CoachingDashboard/InterimDashboard?Finyear=${yearPath}`;
        }
        if (semiYear) {
            if (selectedDivision) {
                url = `/Dashboard/CoachingDashboard/InterimDashboard?Finyear=${yearPath}&Status=${semiYear.val}&Division=${selectedDivision.Divisioncode}`;
            } else {
                url = `/Dashboard/CoachingDashboard/InterimDashboard?Finyear=${yearPath}&Status=${semiYear.val}`;
            }
        }
        if (selectedOption) {
            if (selectedDivision) {
                url = `/Dashboard/CoachingDashboard/InterimDashboard?Finyear=${yearPath}&Status=${semiYear.val}&Selectedoption=${selectedOption.val}&Division=${selectedDivision.Divisioncode}`;
            } else {
                url = `/Dashboard/CoachingDashboard/InterimDashboard?Finyear=${yearPath}&Status=${semiYear.val}&Selectedoption=${selectedOption.val}`;
            }
        }
        setLoading(true);
        getData(url, "CoachingDashboard-InterimDashboard")
            .then((res) => {
                setCoaching(res.data);
            })
            .catch((err) => {
                console.log(err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    };
    const basicData = {
        labels: coahing.map((key) => key.Status),
        datasets: [
            {
                label: "Number ",
                backgroundColor: "#42A5F5",
                data: coahing.map((key) => key.Counts),
                barPercentage: 0.5,
            },
        ],
    };

    return (
        <div>
            <h5>Interim Dashboard</h5>
            <div className="w-50">
                <ProgressProvider valueStart={0} valueEnd={(coahing.slice(1, 2).map((e) => e.Counts) / coahing.slice(0, 1).map((e) => e.Counts)) * 100}>
                    {(value) => (
                        <CircularProgressbar
                            value={value}
                            text={`${coahing.slice(0, 1).map((e) => e.Counts) > 0 ? value.toFixed(1) + "% Taken" : "No Interim Taken"} `}
                            styles={{
                                text: {
                                    fill: "#42A5F5",
                                    fontSize: "5px",
                                },
                            }}
                            strokeWidth={7}
                        />
                    )}
                </ProgressProvider>
            </div>
            <p style={{ color: "#23547b" }}>
                {selectedOption ? selectedOption.name + " View" : ""} {selectedDivision ? "in " + selectedDivision.Divisioncode + " Division" : ""}
            </p>
        </div>
    );
};
export default InterimDashboard;
