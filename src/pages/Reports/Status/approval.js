import React from "react";
export const approvalStatusTamplate = (rowData, approval) => {
    let status = "";
    let style = "";
    switch (rowData[`${approval}`]) {
        case 1:
            status = "Ready";
            style = "customer-badge status-renewal";
            break;
        case 2:
            status = "Waiting HR";
            style = "customer-badge status-proposal";
            break;
        case 3:
            status = "HR Approved";
            style = "customer-badge status-qualified";
            break;
        case 4:
            status = "Closed";
            style = "customer-badge status-new";
            break;
        case 5:
            status = "Cancelled";
            style = "customer-badge status-unqualified";
            break;
        case 6:
            status = "Removed";
            style = "customer-badge status-unqualified";
            break;
        case 7:
            status = "Rejected";
            style = "customer-badge status-unqualified";
            break;
        default:
            status = "";
            style = "";
    }
    return (
        <>
            <span className={style}>{status}</span>
        </>
    );
};
export const coachingStatusTamplate = (rowData, sts) => {
    let status = "";
    let style = "";
    switch (rowData[`${sts}`]) {
        case 1:
            status = "Inactive";
            style = "customer-badge status-renewal";
            break;
        case 2:
            status = "On progress";
            style = "customer-badge status-proposal";
            break;
        case 3:
            status = "Coaching Completed";
            style = "customer-badge status-qualified";
            break;
        case 4:
            status = "Assessment Completed";
            style = "customer-badge status-new";
            break;
        case 5:
            status = "Cancelled";
            style = "customer-badge status-unqualified";
            break;
        default:
            status = "";
            style = "";
    }
    return (
        <>
            <span className={style}>{status}</span>
        </>
    );
};
