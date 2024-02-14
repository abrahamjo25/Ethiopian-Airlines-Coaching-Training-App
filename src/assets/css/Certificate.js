import React, { useRef, useState } from "react";
import "../../assets/css/Certificate.css";
import CertificateBg from "../../assets/images/CertificateBg.png";
import { exportComponentAsPNG } from "react-component-export-image";
import { useLocation } from "react-router-dom";
export const Certificate = () => {
    const certificateWrapper = useRef();
    const location = useLocation();
    console.log(location.state.data);
    return (
        <div className="App">
            <div className="card">
                <div className="Meta">
                    <h1>Ethiopian Aviation University Certificate</h1>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            exportComponentAsPNG(certificateWrapper, {
                                html2CanvasOptions: { backgroundColor: null },
                            });
                        }}
                    >
                        Print
                    </button>
                </div>
            </div>

            <div id="downloadWrapper" ref={certificateWrapper}>
                <div id="certificateWrapper">
                    <p className="owner-name">Mr. {location.state.data.Firstname + " " + location.state.data.Middlename}</p>
                    <p className="owner-id">
                        ID Number: {location.state.data.EmployeeId}, Position: {location.state.data.Pldescription}
                    </p>
                    <p className="owner-body">Has Seccessfully Completed</p>
                    <p className="owner-pl">
                        PL (Practical Log Book) of <u className="text-success">{location.state.data.Plcodes}</u>{" "}
                    </p>
                    <span className="date">Date issued {new Date(location.state.data.Assessmentend).toLocaleString().split(",")[0]}</span>
                    <img src={CertificateBg} alt="Certificate" />
                </div>
            </div>
        </div>
    );
};
