import React from "react";
import { Timeline } from "primereact/timeline";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
export const TimeLine = ({ name, code,date }) => {
    let message = "Ready " + name;
    const events = [
        { status: <p>{message}</p>, icon: "pi pi-users", color: "#419544" },
        { status: "On Progress", icon: "pi pi-cog", color: "#673AB7" },
        { status: "Completed", icon: "pi pi-inbox", color: "#FF9800" },
        { status: "Cancelled", icon: "pi pi-times", color: "#1c80cf" },
    ];

    const customizedMarker = (item) => {
        return (
            <span className="custom-marker p-shadow-2" style={{ backgroundColor: item.color }}>
                <i className={item.icon}></i>
            </span>
        );
    };

    const customizedContent = (item) => {
        return (
            <Card title={item.status} subTitle={getMonthName(new Date(date).getMonth()) + " " + new Date(date).getFullYear()}>
                <p>This report gives summary of the status of Coaching Training Plans maintained in the system. It summarizes Coaching Training Plans data by the respective status & cost center,</p>
                <Button label="Show More" className="p-button-text"></Button>
            </Card>
        );
    };

    return (
        <div className="timeline-demo">
            <div className="card">
                <h5 style={{ color: "#00a0b4" }}>{getMonthName(new Date(date).getMonth()) + " " + new Date(date).getFullYear()} {name} Timeline</h5>
                <Timeline value={events} align="alternate" className="customized-timeline" marker={customizedMarker} content={customizedContent} />
            </div>
        </div>
    );
};
export const getMonthName = (monthNumber) => {
    const date = new Date();
    date.setMonth(monthNumber); // starts with 0, so 0 is January
    return date.toLocaleString("en-EN", { month: "long" });
};
