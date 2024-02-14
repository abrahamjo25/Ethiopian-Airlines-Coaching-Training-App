import React from "react";
export const statusDetailTamplate = (rowData) => {
    let statusDetail = "";
    if (rowData.Status === "Expired") {
        statusDetail = "customer-badge status-renewal";
    }
    if (rowData.Status === "Completed") {
        statusDetail = "customer-badge status-qualified";
    }
    if (rowData.Status === "On_Progress") {
        statusDetail = "customer-badge status-proposal";
    }
    if (rowData.Status === "Not_Started") {
        statusDetail = "customer-badge status-unqualified";
    }
    return <span className={statusDetail}>{rowData.Status}</span>;
};
