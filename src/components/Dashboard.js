import React from "react";
import { TabView, TabPanel } from "primereact/tabview";
import homeBackground from "../assets/images/ETG_Home.jpg";

const Dashboard = () => {
    return (
        <>
            <div className="surface-ground py-3 md:px-8 lg:px-8">
                <div style={{ display: "block", width: "100%", padding: 30 }}>
                    <h5 className="text-center text-4xl">Welcome to ETG Coaching System</h5>
                    <TabView className="surface-ground">
                        <TabPanel header="Home">
                            <div className="text-center">
                                <img src={homeBackground} alt="" className="img-fluid" width={800} />
                                <h5 className="text-center py-5 text-2xl">Sharing of Skills, Knowledge and Experience </h5>
                            </div>
                        </TabPanel>
                        <TabPanel header="My Activities">
                            <p className="m-0 p-3">No latest activities found yet!</p>
                        </TabPanel>
                    </TabView>
                </div>
            </div>
        </>
    );
};

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname && prevProps.colorMode === nextProps.colorMode;
};

export default React.memo(Dashboard, comparisonFn);
