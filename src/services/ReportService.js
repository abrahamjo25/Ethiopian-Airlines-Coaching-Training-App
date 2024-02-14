import { getData } from "./AccessAPI";

export const getPlReport = async (url) => {
    return getData(url, "Numberofdevelopedpls-Getoveralldevelopedpl");
};
export const getAnualPlanReport = async (url) => {
    return getData(url, "Coachingcompstatus-AnnualPlansStatus");
};
export const getActionPlanReport = async (url) => {
    return getData(url, "ActionplanReports-GetplannedTasks");
};
export const getCoachingReport = async (url) => {
    return getData(url, "Coachingcompstatus-GetCoachingcompstatus");
};
export const getAssessmentReport = async (url) => {
    return getData(url, "Coachingcompstatus-GetAssessmentStatus");
};
export const getInterimReport = async (url) => {
    return getData(url, "Coachingcompstatus-GetInterimAssessmentStatus");
};
export const getOverAllReport = async (url) => {
    return getData(url, "ResultSummary-GetResultSummary");
};
