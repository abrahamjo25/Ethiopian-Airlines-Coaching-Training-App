import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
function Loading() {
    const [loading, setLoadning] = useState(true);
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoadning(false);
        }, 5000000);
        return () => clearTimeout(timer);
    }, []);
    return (
        <>
            {loading ? (
                <div className="loading-modal">
                    <div className="">
                        <div class="loader">
                            <div>
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <Redirect to="/catch-connection-error" />
            )}
        </>
    );
}

export default Loading;
