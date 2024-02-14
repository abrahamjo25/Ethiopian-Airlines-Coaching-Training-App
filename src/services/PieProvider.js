export const pieOptions = {
    // indexAxis: "y",
    aspectRatio: 1.33,
    animation: {
        duration: 0,
    },
    plugins: {
        datalabels: {
            color: "white",
            font: {
                size: 13,
            },
        },
        pieArcLabels: {
            rotation: -180,
        },
        labels: {
            render: (args) => {
                return args.value;
            },
        },
    },
    legend: {
        labels: {
            fontColor: "#ffff",
        },
    },
};
