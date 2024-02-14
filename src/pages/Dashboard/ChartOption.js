export const basicOptions = {
    animation: {
        duration: 0,
    },
    plugins: {
        datalabels: {
            display: true,
            color: "black",
            formatter: Math.round,
            anchor: "end",
            offset: -20,
            align: "start",
            // color:"#C71585"
        },
        legend: {
            display: false,
        },
    },
    legend: {
        labels: {
            fontColor: "#495057",
        },
    },
    scales: {
        x: {
            // ticks: {
            //     fontColor: "#495057",
            // },
            grid: {
                display: false,
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
