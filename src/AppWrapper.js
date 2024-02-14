import React, { useEffect } from "react";
import { Route, withRouter, useLocation } from "react-router-dom";
import App from "./App";
import Logout from "./auth/Logout";
import Error from "./pages/Defaults/Error";
import ForgotePassword from "./auth/ForgotePassword";
import ChangePassword from "./auth/ChangePassword";
import ServerError from "./auth/ServerError";
import { Unauthorized } from "./auth/Unauthorized";
import { AuthProvider } from "./auth/Auth";
import Login from "./auth/Login";
import { Suspense } from "react";
import Loading from "./pages/Defaults/Loading";
import { HelpCenter } from "./Help/HelpCenter";
import Docs from "./pages/Docs";
import CreateDocs from "./pages/Docs/Create";
const AppWrapper = (props) => {
    let location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    switch (props.location.pathname) {
        case "/user-login":
            return <Route path="/user-login" component={Login} />;
        case "/user-session-logout":
            return <Route path="/user-session-logout" component={Logout} />;
        case "/forgote-password":
            return <Route path="/forgote-password" component={ForgotePassword} />;
        case "/reset-password":
            return <Route path="/reset-password" component={ChangePassword} />;
        case "/catch-connection-error":
            return <Route path="/catch-connection-error" component={Error} />;
        case "/Unauthorized-Request":
            return <Route path="/Unauthorized-Request" component={Unauthorized} />;
        case "/Network-Error":
            return <Route path="/Network-Error" component={ServerError} />;
        case "/Help-Center":
            return <Route path="/Help-Center" component={HelpCenter} />;
        case "/documentation":
            return <Route path="/documentation" component={Docs} />;
        case "/create-documentation":
            return <Route path="/create-documentation" component={CreateDocs} />;
        default:
            return (
                <Suspense fallback={Loading}>
                    <AuthProvider>
                        <App />
                    </AuthProvider>
                </Suspense>
            );
    }
};

export default withRouter(AppWrapper);
