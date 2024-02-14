export const barOptions = {
    aspectRatio: 1.33,
    animation: {
        duration: 0,
    },
    plugins: {
        datalabels: {
            display: true,
            color: "white",
            formatter: Math.round,
            anchor: "end",
            // offset: -20,
            align: "start",
            font: {
                size: 13,
            },
        },
    },
    legend: {
        labels: {
            fontColor: "#495057",
        },
    },
    scales: {
        x: {
            ticks: {
                fontColor: "#495057",
            },
        },
        y: {
            ticks: {
                stepSize: 3,
            },
            grid: {
                display: false,
            },
        },
    },
};
