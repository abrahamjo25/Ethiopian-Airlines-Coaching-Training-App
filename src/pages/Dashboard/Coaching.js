import React, { useEffect, useState } from "react";
import { Chart } from "primereact/chart";
import { getData } from "../../services/AccessAPI";
import Loading from "../Defaults/Loading";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { basicOptions } from "./ChartOption";

const Coaching = (props) => {
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
            url = `/Dashboard/CoachingDashboard/CoachingCompStatus?Finyear=${yearPath}&Division=${selectedDivision.Divisioncode}`;
        } else {
            url = `/Dashboard/CoachingDashboard/CoachingCompStatus?Finyear=${yearPath}`;
        }
        if (semiYear) {
            if (selectedDivision) {
                url = `/Dashboard/CoachingDashboard/CoachingCompStatus?Finyear=${yearPath}&Status=${semiYear.val}&Division=${selectedDivision.Divisioncode}`;
            } else {
                url = `/Dashboard/CoachingDashboard/CoachingCompStatus?Finyear=${yearPath}&Status=${semiYear.val}`;
            }
        }
        if (selectedOption) {
            if (selectedDivision) {
                url = `/Dashboard/CoachingDashboard/CoachingCompStatus?Finyear=${yearPath}&Status=${semiYear.val}&Selectedoption=${selectedOption.val}&Division=${selectedDivision.Divisioncode}`;
            } else {
                url = `/Dashboard/CoachingDashboard/CoachingCompStatus?Finyear=${yearPath}&Status=${semiYear.val}&Selectedoption=${selectedOption.val}`;
            }
        }
        getData(url, "CoachingDashboard-CoachingCompStatus")
            .then((res) => {
                setCoaching(res.data);
            })
            .catch((err) => {
                console.log(err.message);
            })
            .finally(() => {
                props.onStatusChange();
            });
    };
    const basicData = {
        labels: coahing.map((key) => key.Status),
        datasets: [
            {
                label: "Number ",
                backgroundColor: ["#42A5F5", "#6495ED", "#B8860B", "#008B8B", "#FF8C00", "#2F4F4F", "#CD5C5C"],
                data: coahing.map((key) => key.Coachingresult),
                barPercentage: 0.5,
            },
        ],
    };
    return (
        <div>
            <h5>Coaching Completion Dashboard</h5>
            <Chart type="bar" data={basicData} options={basicOptions} plugins={[ChartDataLabels]} />
            {selectedOption ? selectedOption.name + " View" : ""} {selectedDivision ? "in " + selectedDivision.Divisioncode + " Division" : ""}
        </div>
    );
};
export default Coaching;
