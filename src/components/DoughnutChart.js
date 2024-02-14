import React, { useState, useEffect } from "react";
import { Chart } from "primereact/chart";
export function DoughnutChart() {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    useEffect(() => {
        const documentStyle = getComputedStyle(document.documentElement);
        const data = {
            labels: ["A", "B", "C"],
            datasets: [
                {
                    data: [300, 50, 100],
                    backgroundColor: [documentStyle.getPropertyValue("--green-300"), documentStyle.getPropertyValue("--blue-300"), documentStyle.getPropertyValue("--yellow-300")],
                    hoverBackgroundColor: [documentStyle.getPropertyValue("--green-300"), documentStyle.getPropertyValue("--blue-300"), documentStyle.getPropertyValue("--yellow-300")],
                },
            ],
        };
        const options = {
            cutout: "60%",
        };

        setChartData(data);
        setChartOptions(options);
    }, []);

    return (
        <div className="">
            <Chart type="doughnut" data={chartData} options={chartOptions} className="w-1 md:w-30rem" />
        </div>
    );
}
