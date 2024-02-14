import moment from "moment";
import React, { useState } from "react";

const PlanAlert = ({ duration, loading }) => {
    const [visible, setVisible] = useState(true);
    let message = "";
    let startDate = null;
    let endDate = null;
    if (duration) {
        startDate = moment(duration?.durationFrom).format("ll");
        endDate = moment(duration?.durationTo).format("ll");
        if (new Date(startDate) <= new Date() && new Date(endDate) >= new Date()) {
            message = `Creating annual plan allowed between [${startDate} - ${endDate}]. ${moment.duration(moment().diff(endDate)).humanize()} Ramaining.`;
        } else if (new Date(startDate) >= new Date()) {
            message = `Creating annual plan allowed between [${startDate} - ${endDate}]. It will open after ${moment.duration(moment().diff(startDate)).humanize()}.`;
        } else if (new Date(endDate) <= new Date()) {
            message = `Creating annual plan allowed between [${startDate} - ${endDate}]. Closed ${moment.duration(moment().diff(endDate)).humanize()} ago.`;
        }
    } else {
        message = `There is no defined annual planning duration for this year.`;
    }
    return visible && !loading ? (
        <div className="alert alert-warning d-flex justify-content-between" role="alert">
            <div className="">
                <h5 className="alert-headeing">Planning Duration</h5>
                <p className="text-lg">{message}</p>
            </div>
            <i className="pi pi-times" onClick={() => setVisible(false)}></i>
        </div>
    ) : (
        ""
    );
};

export default PlanAlert;
