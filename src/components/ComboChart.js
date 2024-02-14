import React, { useState, useEffect } from "react";
import { Chart } from "primereact/chart";

export default function ComboChart() {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    useEffect(() => {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue("--text-color");
        const textColorSecondary = documentStyle.getPropertyValue("--text-color-secondary");
        const surfaceBorder = documentStyle.getPropertyValue("--surface-border");
        const data = {
            labels: ["January", "February", "March", "April", "May", "June", "July", "Auguest", "September", "October", "November", "December"],
            datasets: [
                {
                    type: "line",
                    label: "Dataset 1",
                    borderColor: documentStyle.getPropertyValue("--yellow-300"),
                    borderWidth: 2,
                    fill: false,
                    tension: 0.4,
                    data: [50, 25, 12, 48, 56, 76, 42, 12, 48, 56, 76, 42],
                },
                {
                    type: "bar",
                    label: "Dataset 2",
                    backgroundColor: documentStyle.getPropertyValue("--green-300"),
                    data: [21, 84, 24, 75, 37, 65, 34, 12, 48, 56, 76, 42],
                    borderColor: "white",
                    borderWidth: 2,
                },
                {
                    type: "bar",
                    label: "Dataset 3",
                    backgroundColor: documentStyle.getPropertyValue("--blue-300"),
                    data: [41, 52, 24, 74, 23, 21, 32, 12, 48, 56, 76, 42],
                },
            ],
        };
        const options = {
            maintainAspectRatio: false,
            aspectRatio: 0.6,
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                    },
                },
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                    },
                    grid: {
                        color: surfaceBorder,
                    },
                },
                y: {
                    ticks: {
                        color: textColorSecondary,
                    },
                    grid: {
                        color: surfaceBorder,
                    },
                },
            },
        };

        setChartData(data);
        setChartOptions(options);
    }, []);

    return (
        <div className="">
            <Chart type="line" data={chartData} options={chartOptions} />
        </div>
    );
}
