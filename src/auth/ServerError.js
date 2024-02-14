import React from "react";

const ServerError = () => {
    return (
        <div className="p-7">
            <h2 className="text-center text-danger">500</h2>
            <h2 className="text-center text-danger">Internal Server Error</h2>
            <p className="text-center">Please contact the IT admin.</p>
        </div>
    );
};

export default ServerError;
