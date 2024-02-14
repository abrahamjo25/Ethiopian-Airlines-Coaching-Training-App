import React from "react";
import { useHistory } from "react-router-dom";
import { Button } from "primereact/button";
import { BASE_COLOR } from "../../services/Settings";
function Error() {
    const history = useHistory();

    const goDashboard = () => {
        history.goBack();
    };

    return (
        <div className="exception-body error-body">
            <div className="exception-container">
                <img src="assets/layout/images/logo-dark.png" alt="apollo-layout" />
                <h2 className="text-danger">Oops! Connection Timed out</h2>
                <p>Contact the network administrator</p>

                <Button label="Go To Dashboard" style={{ backgroundColor: BASE_COLOR }} icon="pi pi-arrow-left" onClick={goDashboard} />
            </div>
        </div>
    );
}

export default Error;
