import { TabPanel, TabView } from "primereact/tabview";
import React, { useEffect, useState } from "react";
import PlApproval from "./PlApproval";
import Planning from "./Planning";
import Trainer from "./Trainer";

const MainApproval = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    useEffect(() => {
        const storedActiveIndex = localStorage.getItem("activeTabIndex");
        if (storedActiveIndex !== null) {
            setActiveIndex(parseInt(storedActiveIndex, 10));
        }
    }, []);

    const onIndexChange = (index) => {
        setActiveIndex(index);
        localStorage.setItem("activeTabIndex", index.toString());
    };

    return (
        <div className="tabview-demo">
            <div className="card  px-8 py-8">
                <h5>Approvals</h5>

                <TabView activeIndex={activeIndex} onTabChange={(e) => onIndexChange(e.index)}>
                    <TabPanel header="PL">
                        <PlApproval />
                    </TabPanel>
                    <TabPanel header="Planning">
                        <Planning />
                    </TabPanel>
                    <TabPanel header="Trainer">
                        <Trainer />
                    </TabPanel>
                </TabView>
            </div>
        </div>
    );
};

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(MainApproval, comparisonFn);
