import React, { Component } from "react";
import { withRouter } from "react-router-dom";

const parseJwt = (token) => {
    try {
        return JSON.parse(window.atob(token.split(".")[1]));
    } catch (e) {
        return null;
    }
};

class AuthVerify extends Component {
    constructor(props) {
        super(props);

        props.history.listen(() => {
            const accessToken = localStorage.getItem("idToken");
            if (accessToken) {
                const decodedJwt = parseJwt(accessToken);
                if (decodedJwt) {
                    if (decodedJwt.exp * 1000 < Date.now()) {
                        props.logOut();
                    }
                }
            }
        });
    }

    render() {
        return <div></div>;
    }
}

export default withRouter(AuthVerify);
