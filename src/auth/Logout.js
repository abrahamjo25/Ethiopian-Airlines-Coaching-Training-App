import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { resetStorage } from "../services/SecureService";
function Logout() {
    const history = useHistory();
    useEffect(() => {
        resetStorage();
        history.push("/user-login");
    }, []);
    return <div></div>;
}

export default Logout;
