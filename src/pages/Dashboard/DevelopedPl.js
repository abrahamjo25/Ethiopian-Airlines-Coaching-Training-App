import React, { useEffect, useState } from "react";
import { Chart } from "primereact/chart";
import { getData } from "../../services/AccessAPI";
import { basicOptions } from "./ChartOption";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { CircularProgressbar } from "react-circular-progressbar";
import ProgressProvider from "../../services/ProgressProvider";
const PLDashboard = (props) => {
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
            url = `/Dashboard/CoachingDashboard/PLDashboard?Finyear=${yearPath}&Division=${selectedDivision.Divisioncode}`;
        } else {
            url = `/Dashboard/CoachingDashboard/PLDashboard?Finyear=${yearPath}`;
        }
        if (semiYear) {
            if (selectedDivision) {
                url = `/Dashboard/CoachingDashboard/PLDashboard?Finyear=${yearPath}&Status=${semiYear.val}&Division=${selectedDivision.Divisioncode}`;
            } else {
                url = `/Dashboard/CoachingDashboard/PLDashboard?Finyear=${yearPath}&Status=${semiYear.val}`;
            }
        }
        if (selectedOption) {
            if (selectedDivision) {
                url = `/Dashboard/CoachingDashboard/PLDashboard?Finyear=${yearPath}&Status=${semiYear.val}&Selectedoption=${selectedOption.val}&Division=${selectedDivision.Divisioncode}`;
            } else {
                url = `/Dashboard/CoachingDashboard/PLDashboard?Finyear=${yearPath}&Status=${semiYear.val}&Selectedoption=${selectedOption.val}`;
            }
        }
        setLoading(true);
        getData(url,"CoachingDashboard-PLDashboard")
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
        labels: coahing.map((key) => key.PlTypes),
        datasets: [
            {
                label: "Number ",
                backgroundColor: "#42A5F5",
                data: coahing.map((key) => key.Count),
                barPercentage: 0.5,
            },
        ],
    };

    return (
        <div>
            <h5>Developed PL Dashboard</h5>
            <div className="w-50">
                <ProgressProvider valueStart={0} valueEnd={(coahing.slice(1, 2).map((e) => e.Count) / coahing.slice(0, 1).map((e) => e.Count)) * 100}>
                    {(value) => (
                        <CircularProgressbar
                            value={value}
                            text={`${coahing.slice(0, 1).map((e) => e.Count) > 0 ? value.toFixed(1)+"% Revised" : "No PL Found"}`}
                            styles={{
                                text: {
                                    fill: "#f88",
                                    fontSize: "5px",
                                },
                            }}
                            strokeWidth={7}
                        />
                    )}
                </ProgressProvider>
            </div>
            {selectedOption ? selectedOption.name + " View" : ""} {selectedDivision ? "in " + selectedDivision.Divisioncode + " Division" : ""}
        </div>
    );
};
export default PLDashboard;
