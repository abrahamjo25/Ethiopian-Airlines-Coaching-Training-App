import React from "react";
import { useHistory, useLocation, withRouter } from "react-router-dom";
const AppBreadcrumb = () => {
    const location = useLocation();
    const history = useHistory();

    const mainPath = location.pathname.split("?")[0];
    const paths = mainPath.split("/"); //Assessment/Process-Result

    return (
        <div className="layout-breadcrumb">
            <ul>
                <li>
                    <button type="button" className="p-link" onClick={() => history.push("/")}>
                        <i className="pi pi-home"></i>
                    </button>
                </li>
                {location.pathname === "/" ? <li>/</li> : paths.map((path, index) => <li key={index}>{path === "" ? "/" : path}</li>)}
            </ul>
        </div>
    );
};

export default withRouter(AppBreadcrumb);
