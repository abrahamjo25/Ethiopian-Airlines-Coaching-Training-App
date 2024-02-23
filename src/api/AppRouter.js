import React from "react";
import { Route } from "react-router-dom";
import Home from "../components/Dashboard";
import Dashboard from "../pages/Dashboard/Dashboard";

import Costcenter from "../pages/GeneralMaster/Operational/Costcenter";
import Division from "../pages/GeneralMaster/Operational/Division";
import Hrspecialist from "../pages/OperationalMaster/Trainer/HrSpecialist";
import Passmarks from "../pages/CoachingMaster/Transaction/Passmarks";

import TaskCategory from "../pages/CoachingMaster/Transaction/TaskCategory";
import PLDetail from "../pages/CoachingMaster/Transaction/PlDetails";
import PlHeader from "../pages/CoachingMaster/Transaction/PlHeader";
import Interms from "../pages/GeneralMaster/Operational/Interms";

import TraineerList from "../pages/OperationalMaster/Trainer/TraineerList";

import ActionPlan from "../pages/Planning/ActionPlan/PlanCreate";
import ReplanActionPlan from "../pages/Planning/ActionPlan/ReplanAction";

import AnnulaPlans from "../pages/Planning/AnnualPlan/PlanCreate";

import TraineeSign from "../pages/Coaching/TraineeSign";
import CoachAction from "../pages/Coaching/CoachAction";

import IntrimAssessment from "../pages/Assessmet/IntrimAssessment";
import AssessingTrainee from "../pages/Assessmet/AssessingTrainee";
import OverAllCoaching from "../pages/Assessmet/OverAllResult";

import { ActionPlanReport } from "../pages/Reports/General/ActionPlanReport";
import { AnnualPlanReport } from "../pages/Reports/General/AnnualPlanReport";
import Employees from "../pages/GeneralMaster/Operational/Employees";
import PlStatus from "../pages/Reports/Status/PlStatus";
import CoachingStatus from "../pages/Reports/Status/CoachingStatus";
import CoachingStsDetail from "../pages/Reports/Status/CoachingStsDetail";
import { ReportLanding } from "../pages/Reports/Management/ReportLanding";
import { AnnualPlan } from "../pages/Reports/Management/AnnualPlan";
import { ActionReport } from "../pages/Reports/Management/ActionPlan";
import { InterimAssessment } from "../pages/Reports/Management/InterimAssessment";
import { CoachingProgress } from "../pages/Reports/Management/CoachingProgress";
import { AssessmentProgress } from "../pages/Reports/Management/AssessmentProgress";
import { AssessmentReport } from "../pages/Reports/General/AssessmentReport";
import { CoachingReport } from "../pages/Reports/General/CoachingReport";
import { InterimReport } from "../pages/Reports/General/InterimReport";
import { Landing } from "../pages/Reports/General/Landing";
import { DevelopedPL } from "../pages/Reports/General/DevelopedPL";
import { ResultSummary } from "../pages/Reports/General/ResultSummary";
import MainApproval from "../pages/OperationalMaster/Approvals/MainApproval";
import InterimDetail from "../pages/Assessmet/InterimDetail";
import Coachingdtl from "../pages/Coaching/Coachingdtl";
import Assessmentdtl from "../pages/Assessmet/Assessmentdtl";
import PlanDuration from "../pages/OperationalMaster/PlanDuration";
import MainMapping from "../pages/OperationalMaster/Mappings/MainMapping";

function AppRouter(props) {
    return (
        <div>
            <Route path="/Home-Page" exact render={() => <Home colorMode={props.scheme} location={props.location} />} />
            <Route path="/cost-center" component={Costcenter} />
            <Route path="/task-categories" component={TaskCategory} />
            <Route path="/employees" component={Employees} />
            <Route path="/divisions" component={Division} />
            <Route path="/planning-durations" component={PlanDuration} />
            <Route path="/hr-specialist" component={Hrspecialist} />
            <Route path="/pl-header" component={PlHeader} />
            <Route path="/pl-details" component={PLDetail} />
            <Route path="/interm-assessments" component={Interms} />
            <Route path="/pass-marks" component={Passmarks} />
            <Route path="/traineer-lists" component={TraineerList} />
            <Route path="/create-mapping" component={MainMapping} />
            <Route path="/annual-plans" component={AnnulaPlans} />
            <Route path="/action-plan" component={ActionPlan} />
            <Route path="/action-replan" component={ReplanActionPlan} />
            <Route path="/trainee-sign" component={TraineeSign} />
            <Route path="/coach-action" component={CoachAction} />
            <Route path="/coaching-detail" component={Coachingdtl} />
            <Route path="/re-plan" component={ReplanActionPlan} />
            <Route path="/take-interm-assessments" component={IntrimAssessment} />
            <Route path="/interm-detail" component={InterimDetail} />
            <Route path="/assessing-trainee" component={AssessingTrainee} />
            <Route path="/assessment-detail" component={Assessmentdtl} />
            <Route path="/over-all-coaching" component={OverAllCoaching} />
            <Route path="/over-all-data-analytics-reports" component={Landing} />
            <Route path="/reports-developed-pl-report" component={DevelopedPL} />
            <Route path="/reports-action-plan-report" component={ActionPlanReport} />
            <Route path="/reports-coaching-completion-report" component={CoachingReport} />
            <Route path="/reports-coaching-assessment-report" component={AssessmentReport} />
            <Route path="/reports-interim-assessment-report" component={InterimReport} />
            <Route path="/reports-annual-plan-report" component={AnnualPlanReport} />
            <Route path="/reports-result-summary" component={ResultSummary} />
            <Route path="/Dashboard-View" component={Dashboard} />
            <Route path="/view-pl-status" component={PlStatus} />
            <Route path="/view-coaching-status" component={CoachingStatus} />
            <Route path="/view-coaching-details" component={CoachingStsDetail} />
            <Route path="/view-management-reports" component={ReportLanding} />
            <Route path="/view-management-reports-annualplan" component={AnnualPlan} />
            <Route path="/view-management-reports-actionplan" component={ActionReport} />
            <Route path="/view-management-reports-interim" component={InterimAssessment} />
            <Route path="/view-management-reports-coaching" component={CoachingProgress} />
            <Route path="/view-management-reports-assessment" component={AssessmentProgress} />

            <Route path="/approvals" component={MainApproval} />
        </div>
    );
}

export default AppRouter;
