import React, { useEffect, useState } from "react";
import { Chart } from "primereact/chart";
import { getData } from "../../services/AccessAPI";
import { basicOptions } from "./ChartOption";
import ChartDataLabels from "chartjs-plugin-datalabels";

const Assessment = (props) => {
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
            url = `/Dashboard/CoachingDashboard/AssessmentResultSummary?Finyear=${yearPath}&Division=${selectedDivision.Divisioncode}`;
        } else {
            url = `/Dashboard/CoachingDashboard/AssessmentResultSummary?Finyear=${yearPath}`;
        }
        if (semiYear) {
            if (selectedDivision) {
                url = `/Dashboard/CoachingDashboard/AssessmentResultSummary?Finyear=${yearPath}&Status=${semiYear.val}&Division=${selectedDivision.Divisioncode}`;
            } else {
                url = `/Dashboard/CoachingDashboard/AssessmentResultSummary?Finyear=${yearPath}&Status=${semiYear.val}`;
            }
        }
        if (selectedOption) {
            if (selectedDivision) {
                url = `/Dashboard/CoachingDashboard/AssessmentResultSummary?Finyear=${yearPath}&Status=${semiYear.val}&Selectedoption=${selectedOption.val}&Division=${selectedDivision.Divisioncode}`;
            } else {
                url = `/Dashboard/CoachingDashboard/AssessmentResultSummary?Finyear=${yearPath}&Status=${semiYear.val}&Selectedoption=${selectedOption.val}`;
            }
        }
        setLoading(true);
        getData(url, "CoachingDashboard-AssessmentResultSummary", "CoachingDashboard-AssessmentResultSummary")
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
        labels: coahing.map((key) => key.Keyvalues),
        datasets: [
            {
                label: "Number ",
                backgroundColor: ["#42A5F5","#6495ED","#B8860B","#008B8B","#FF8C00","#2F4F4F","#CD5C5C"],
                data: coahing.map((key) => key.Counts),
                barPercentage: 0.5,
            },
        ],
    };

    return (
        <div>
            <h5>Assessment Result Dashboard</h5>
            <Chart type="bar" data={basicData}  options={basicOptions} plugins={[ChartDataLabels]} />
            {selectedOption ? selectedOption.name + " View" : ""} {selectedDivision ? "in " + selectedDivision.Divisioncode + " Division" : ""}
        </div>
    );
};
export default Assessment;
