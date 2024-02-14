import { ProgressBar } from "primereact/progressbar";
import React from "react";

function ChartLoading() {
    return <div className="loading-modal">{<ProgressBar mode="indeterminate" style={{ height: "3px" }}></ProgressBar>}</div>;
}

export default ChartLoading;
