import React from "react";
import { Route, Redirect, useHistory, useLocation } from "react-router";
import { getToken } from "../services/SecureService";

export function PrivateRoute({ children, ...rest }) {
    let history = useHistory();
    let location = useLocation();
    let url = location.pathname;
    let role = url.split("/").pop();

    return (
        <Route
            {...rest}
            render={({ location }) =>
                localStorage.getItem("idToken")
                    ? children
                    : history.push({
                          pathname: "/login",
                          state: { from: location },
                      })
            }
        />
    );
}
