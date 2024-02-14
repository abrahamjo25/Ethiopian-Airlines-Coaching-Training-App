import React from "react";
import { helpData } from "./helpData";
export const HelpCenter = (props) => {
    const { state } = props?.location;
    const topic = state?.data;
    const data = helpData.find((i) => i.topic === topic);
    return (
        <div className="surface-ground py-3 md:px-8 lg:px-8">
            <div className="md:col-6">
                <h1>Help Center</h1>
                <h5>Welcome to our help center. Here you can find answers to common questions and issues.</h5>
                <div className="py-5">
                    <p className="text-2xl">#{topic}</p>
                    <p className="text-lg">
                        <span className="text-3xl">👉</span> {data?.content}
                    </p>
                </div>
            </div>
        </div>
    );
};
