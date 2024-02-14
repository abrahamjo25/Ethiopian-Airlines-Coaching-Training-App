import React from "react";
import { Chart } from "primereact/chart";

export const PieChart = ({ persent }) => {
    console.log(persent[0].persent);
    const chartData = {
        labels: ["Ready", "On Progress", "Complleted", "Cancelled"],
        datasets: [
            {
                data: [persent[0].persent, persent[1].persent, persent[2].persent, persent[3].persent],
                backgroundColor: ["#66BB6A", "#FFA726", "#42A5F5", "#00a0b4"],
                hoverBackgroundColor: ["#81C784", "#FFB74D", "#64B5F6", "#00a0b4"],
            },
        ],
    };

    const lightOptions = {
        legend: {
            labels: {
                fontColor: "#495057",
            },
        },
    };

    return (
        <div className="card">
            <Chart type="pie" data={chartData} options={lightOptions} />
        </div>
    );
};
