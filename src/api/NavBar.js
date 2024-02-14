const AppNavs = [
    {
        label: "Corporate Coaching",
        icon: "",
        to: "/",
        items: [
            {
                label: "General Master",
                icon: "pi pi-folder-open text-success",
                claim: "General-Master",
                items: [
                    {
                        label: "Costcenters",
                        icon: "pi pi-cog text-success",
                        claim: "Costcenters-Index",
                        to: "/cost-center",
                    },
                    {
                        label: "Divisions",
                        icon: "pi pi-book text-info",
                        claim: "Divisions-Index",
                        to: "/divisions",
                    },
                    {
                        label: "Employees",
                        icon: "pi pi-users text-success",
                        claim: "Employee-Index",
                        to: "/employees",
                    },
                    {
                        label: "Interim Data",
                        icon: "pi pi-window-maximize text-info text-sm",
                        claim: "Interims-Index",
                        to: "/interm-assessments",
                    },
                ],
            },
            {
                label: "Coaching Master",
                icon: "pi pi-folder-open text-info",
                claim: "Pl-Master",
                items: [
                    {
                        label: "PL Header",
                        icon: "pi pi-chevron-circle-up text-primary",
                        claim: "Plheader-Index",
                        to: "/pl-header",
                    },
                    {
                        label: "Task Category",
                        icon: "pi pi-discord text-primary",
                        claim: "TaskCategories-Index",
                        to: "/task-categories",
                    },
                    {
                        label: "Pass Marks",
                        icon: "pi pi-bolt text-primary",
                        claim: "Passingmarks-Index",
                        to: "/pass-marks",
                    },
                ],
            },
            {
                label: "Operational",
                icon: "pi pi-cog text-success",
                claim: "Operational-Master",
                items: [
                    {
                        label: "Plan duration",
                        icon: "pi pi-clock text-success",
                        claim: "Operational-Master",
                        to: "/planning-durations",
                    },
                    {
                        label: "Trainer",
                        icon: "pi pi-discord text-primary",
                        claim: "Operational-Master",
                        to: "/traineer-lists",
                    },
                    {
                        label: "HR Specialist",
                        icon: "pi pi-user text-warning",
                        claim: "Hrspecialistdtl-Index",
                        to: "/hr-specialist",
                    },
                    {
                        label: "Approvals",
                        icon: "pi pi-check-circle text-info",
                        claim: "Hrspecialistdtl-Index",
                        to: "/approvals",
                    },
                ],
            },
            {
                label: "Planning",
                icon: "pi pi-compass text-primary",
                claim: "Operational-Master",
                items: [
                    {
                        label: "Annual Plan",
                        icon: "pi pi-arrow-circle-right text-info",
                        claim: "Operational-Master",
                        to: "/annual-plans",
                    },
                    {
                        label: "Action Plan",
                        icon: "pi pi-arrow-circle-right text-info",
                        claim: "Operational-Master",
                        to: "/action-plan",
                    },
                ],
            },
            {
                label: "Coaching",
                icon: "pi pi-list text-info",
                claim: "Operational-Master",
                items: [
                    {
                        label: "Trainee Sign",
                        icon: "pi pi-arrow-circle-right text-info",
                        claim: "Operational-Master",
                        to: "/trainee-sign",
                    },
                    {
                        label: "Coach Sign",
                        icon: "pi pi-arrow-circle-right text-info",
                        claim: "Operational-Master",
                        to: "/coach-action",
                    },
                ],
            },
            {
                label: "Assessment",
                icon: "pi pi-chevron-circle-up text-primary",
                claim: "Operational-Master",
                items: [
                    {
                        label: "Assessment",
                        icon: "pi pi-arrow-circle-right text-info",
                        claim: "Operational-Master",
                        to: "/assessing-trainee",
                    },
                    {
                        label: "Interim",
                        icon: "pi pi-arrow-circle-right text-info",
                        claim: "Operational-Master",
                        to: "/take-interm-assessments",
                    },
                ],
            },
            {
                label: "Report",
                icon: "pi pi-book text-success",
                claim: "Operational-Master",
                items: [
                    {
                        label: "Result",
                        icon: "pi pi-arrow-circle-right text-info",
                        claim: "Operational-Master",
                        to: "/over-all-coaching",
                    },
                    {
                        label: "S.Report",
                        icon: "pi pi-book text-info",
                        claim: "Operational-Master",
                        to: "/view-management-reports",
                    },
                    {
                        label: "G.Report",
                        icon: "pi pi-palette text-warning",
                        claim: "Operational-Master",
                        to: "/over-all-data-analytics-reports",
                    },
                ],
            },
        ],
        // items: [
        //     // {
        //     //     label: "Account Management",
        //     //     icon: "pi pi-lock text-success text-xl",
        //     //     claim: "Planning-Master",
        //     //     to: "/",
        //     // },
        //     {
        //         label: "Master Data",
        //         icon: "pi pi-clone text-primary text-xl",
        //         claim: "Master-Data",
        //         items: [
        //             {
        //                 label: "General Master",
        //                 icon: "pi pi-folder-open text-success",
        //                 claim: "General-Master",
        //                 items: [
        //                     {
        //                         label: "ATA Chapters",
        //                         icon: "pi pi-file text-info",
        //                         claim: "ATAChapters-Index",
        //                         to: "/ATAChapters",
        //                     },
        //                     {
        //                         label: "Costcenters",
        //                         icon: "pi pi-cog text-success",
        //                         claim: "Costcenters-Index",
        //                         to: "/cost-center",
        //                     },
        //                     {
        //                         label: "Divisions",
        //                         icon: "pi pi-book text-danger",
        //                         claim: "Divisions-Index",
        //                         to: "/divisions",
        //                     },
        //                     {
        //                         label: "Departments",
        //                         icon: "pi pi-building text-success",
        //                         claim: "Departments-Index",
        //                         to: "/departments",
        //                     },
        //                     {
        //                         label: "Employees",
        //                         icon: "pi pi-users text-info",
        //                         claim: "Employee-Index",
        //                         to: "/employees",
        //                     },
        //                     {
        //                         label: "Passing Marks",
        //                         icon: "pi pi-bolt text-danger",
        //                         claim: "Passingmarks-Index",
        //                         to: "/pass-marks",
        //                     },
        //                     {
        //                         label: "Interim Data",
        //                         icon: "pi pi-window-maximize text-info text-sm",
        //                         claim: "Interims-Index",
        //                         to: "/interm-assessments",
        //                     },
        //                     {
        //                         label: "Task Category",
        //                         icon: "pi pi-discord text-primary",
        //                         claim: "TaskCategories-Index",
        //                         to: "/task-categories",
        //                     },
        //                 ],
        //             },
        //             {
        //                 label: "PL Related Master",
        //                 icon: "pi pi-folder-open text-info",
        //                 claim: "Pl-Master",
        //                 items: [
        //                     {
        //                         label: "PL Header",
        //                         icon: "pi pi-chevron-circle-up text-primary",
        //                         claim: "Plheader-Index",
        //                         to: "/pl-header",
        //                     },
        //                     {
        //                         label: "PL Details",
        //                         icon: "pi pi-list text-info",
        //                         claim: "Pldetails-Index",
        //                         to: "/pl-details",
        //                     },
        //                     {
        //                         label: "Planning Duration",
        //                         icon: "pi pi-clock text-danger",
        //                         claim: "Plduration-Index",
        //                         to: "/planning-durations",
        //                     },
        //                     {
        //                         label: "Question Limit",
        //                         icon: "pi pi-eject text-primary ",
        //                         claim: "MaxAssessmentqns-Index",
        //                         to: "/assessment-question-limit",
        //                     },
        //                     {
        //                         label: "Daily task sign",
        //                         icon: "pi pi-angle-double-right text-warning",
        //                         claim: "Tasksigning-Index",
        //                         to: "/task-signing",
        //                     },
        //                     {
        //                         label: "Assesment Item",
        //                         icon: "pi pi-check-circle text-info",
        //                         claim: "Assessmentitems-Index",
        //                         to: "/assesment-item",
        //                     },
        //                 ],
        //             },
        //         ],
        //     },
        //     {
        //         label: "Operationals",
        //         icon: "pi pi-th-large text-success text-lg",
        //         claim: "Operational-Master",
        //         items: [
        //             {
        //                 label: "Trainer Master",
        //                 icon: "pi pi-id-card text-primary",
        //                 claim: "Traineer-Master",
        //                 items: [
        //                     {
        //                         label: "Trainer Create",
        //                         icon: "pi pi-plus text-info",
        //                         claim: "Activecoachass-GetCoachAssList",
        //                         to: "/traineer-lists",
        //                     },
        //                     {
        //                         label: "Available Trainer",
        //                         icon: "pi pi-bookmark text-info",
        //                         claim: "Activecoachass-GetActivecoachasses",
        //                         to: "/coaches-limits-approval",
        //                     },
        //                     {
        //                         label: "Extra Trainee",
        //                         icon: "pi pi-eject text-primary",
        //                         claim: "Activecoachass-Getforextralst",
        //                         to: "/traineer-limits-approval",
        //                     },
        //                 ],
        //             },
        //             {
        //                 label: "Limit Masters",
        //                 icon: "pi pi-check-circle text-primary",
        //                 claim: "Limit-Master",
        //                 items: [
        //                     {
        //                         label: "Authorized on PL",
        //                         icon: "pi pi-clock text-primary",
        //                         claim: "Authorizedonpl-GetAuthorizedonpl",
        //                         to: "/authorized-onpl",
        //                     },
        //                     {
        //                         label: "HR Specialist",
        //                         icon: "pi pi-user text-warning",
        //                         claim: "Hrspecialistdtl-Index",
        //                         to: "/hr-specialist",
        //                     },
        //                     {
        //                         label: "PL Trainer Max",
        //                         icon: "pi pi-window-maximize text-info text-sm",
        //                         claim: "MaxAssignment-GetIndex",
        //                         to: "/coach-assessor-for-trainee",
        //                     },
        //                 ],
        //             },
        //             {
        //                 label: "Mapping",
        //                 icon: "pi pi-sitemap text-primary",
        //                 claim: "Mapping-Master",
        //                 items: [
        //                     {
        //                         label: "PL Mapping",
        //                         icon: "pi pi-map text-success",
        //                         claim: "Plmappings-Index",
        //                         to: "/pl-mappings",
        //                     },
        //                     {
        //                         label: "Mass Mapping",
        //                         icon: "pi pi-inbox text-danger",
        //                         claim: "Massmappings-Index",
        //                         to: "/employee-mass-mapping",
        //                     },
        //                     {
        //                         label: "Temporary Maping",
        //                         icon: "pi pi-sitemap text-info",
        //                         claim: "Employees-TempMapping",
        //                         to: "/temporary-mapping",
        //                     },
        //                 ],
        //             },
        //             {
        //                 label: "Approvals",
        //                 icon: "pi pi-check-circle text-primary",
        //                 claim: "Pl-Approval",
        //                 items: [
        //                     {
        //                         label: "PL Approval",
        //                         icon: "pi pi-arrow-circle-right text-info",
        //                         claim: "Plapprovals-Secondapprovals",
        //                         to: "/pl-second-approval",
        //                     },
        //                     {
        //                         label: "Planning Approval",
        //                         icon: "pi pi-arrow-circle-right text-info",
        //                         claim: "Coachingplans-Listofapprovedpln",
        //                         to: "/annual-plan-approval",
        //                     },
        //                     {
        //                         label: "Replan Approval",
        //                         icon: "pi pi-arrow-circle-right text-info",
        //                         claim: "PlanningRequests-Index",
        //                         to: "/annual-replan-request",
        //                     },
        //                     {
        //                         label: "Trainer Approval",
        //                         icon: "pi pi-arrow-circle-right text-info",
        //                         claim: "ActiveCoachAss-HRApproval",
        //                         to: "/coaches-second-approval",
        //                     },
        //                 ],
        //             },
        //         ],
        //     },
        //     {
        //         label: "Plannings",
        //         icon: "pi pi-compass text-info text-lg",
        //         claim: "Planning-Master",
        //         items: [
        //             {
        //                 label: "Annual Planning",
        //                 icon: "pi pi-ticket text-success",
        //                 claim: "Annual-Plans",
        //                 items: [
        //                     {
        //                         label: "Create Plan",
        //                         icon: "pi pi-plus text-primary",
        //                         claim: "Coachingplans-Employeelist",
        //                         to: "/annual-plans",
        //                     },
        //                     {
        //                         label: "Plan Detail",
        //                         icon: "pi pi-list text-info",
        //                         claim: "Coachingplans-Listofplannedtrn",
        //                         to: "/annual-plan-details",
        //                     },
        //                 ],
        //             },
        //             {
        //                 label: "Action Planning",
        //                 icon: "pi pi-directions text-danger",
        //                 claim: "Action-Plans",
        //                 items: [
        //                     {
        //                         label: "Create Plan",
        //                         icon: "pi pi-arrow-circle-right text-success",
        //                         claim: "Actionplans-Getemployees",
        //                         to: "/action-plan",
        //                     },
        //                     {
        //                         label: "Re-Plan Action",
        //                         icon: "pi pi-arrow-circle-right text-success",
        //                         claim: "Replanaction-Getplannedaction",
        //                         to: "/re-plan",
        //                     },
        //                 ],
        //             },
        //             {
        //                 label: "Re Planning",
        //                 icon: "pi pi-refresh text-info",
        //                 claim: "Annual-Plans",
        //                 items: [
        //                     {
        //                         label: "Coaching Re plan",
        //                         icon: "pi pi-arrow-circle-right text-success",
        //                         claim: "Coachingreplans-Getplannedemployees",
        //                         to: "/annual-plan-replan",
        //                     },
        //                 ],
        //             },
        //         ],
        //     },
        //     {
        //         label: "My Activities",
        //         icon: "pi pi-discord text-lg text-yellow-700",
        //         claim: "My-Activity",
        //         items: [
        //             {
        //                 label: "Coaching",
        //                 icon: "pi pi-chevron-circle-up text-primary",
        //                 claim: "Coach-Action",
        //                 items: [
        //                     {
        //                         label: "Coaching Trainee",
        //                         icon: "pi pi-arrow-circle-right text-success",
        //                         claim: "Coachactions-Populatetrntasksigned",
        //                         to: "/coach-action",
        //                     },
        //                     {
        //                         label: "Process Result",
        //                         icon: "pi pi-arrow-circle-right text-success",
        //                         claim: "Coachactions-Getlistofcompcoaching",
        //                         to: "/coach-result",
        //                     },
        //                     // {
        //                     //     label: "Re Coaching",
        //                     //     icon: "pi pi-undo text-warning",
        //                     //     claim: "Coachactions-GetRecoachlists",
        //                     //     to: "/re-coach-action",
        //                     // },
        //                 ],
        //             },
        //             {
        //                 label: "Assessing",
        //                 icon: "pi pi-chevron-circle-up text-primary",
        //                 claim: "Assessment-Master",
        //                 items: [
        //                     {
        //                         label: "Assessing Trainee",
        //                         icon: "pi pi-arrow-circle-right text-success",
        //                         claim: "Assessingplans-Getcoachedtrainees",
        //                         to: "/assessing-trainee",
        //                     },
        //                     {
        //                         label: "Process Assessments",
        //                         icon: "pi pi-arrow-circle-right text-success",
        //                         claim: "Assessingplans-Getlistofcompassessments",
        //                         to: "/assessment-result",
        //                     },
        //                     {
        //                         label: "View Result & Report",
        //                         icon: "pi pi-arrow-circle-right text-success",
        //                         claim: "Assessingplans-GetAssesmentResult",
        //                         to: "/view-assessment-result",
        //                     },
        //                     {
        //                         label: "Take Interims",
        //                         icon: "pi pi-arrow-circle-right text-success",
        //                         claim: "InterimAssessment-MonthlyInterimAssesment",
        //                         to: "/intrim-assessment",
        //                     },
        //                     // {
        //                     //     label: "Re Assessment",
        //                     //     icon: "pi pi-chevron-circle-up text-primary",
        //                     //     claim: "Assessingplans-GetReAssesslists",
        //                     //     to: "/re-assessment",
        //                     // },
        //                 ],
        //             },
        //             {
        //                 label: "My Activity",
        //                 icon: "pi pi-chevron-circle-up text-primary",
        //                 claim: "Self-Activities",
        //                 items: [
        //                     {
        //                         label: "My Action",
        //                         icon: "pi pi-arrow-circle-right text-success",
        //                         claim: "Traineeactions-Populatetrntasksign",
        //                         to: "/trainee-action",
        //                     },
        //                     {
        //                         label: "View Status",
        //                         icon: "pi pi-arrow-circle-right text-success",
        //                         claim: "Coachactions-Getlistofcompcoaching",
        //                         to: "/coach-result",
        //                     },
        //                     {
        //                         label: "Feedback",
        //                         icon: "pi pi-arrow-circle-right text-success",
        //                         claim: "Traineeactions-ViewTraineefeedbacks",
        //                         to: "/trainee-feedback",
        //                     },
        //                 ],
        //             },
        //         ],
        //     },
        //     {
        //         label: "Final Reports",
        //         icon: "pi pi-print text-primary text-lg",
        //         claim: "Final-Reports",
        //         items: [
        //             {
        //                 label: "Result Overview",
        //                 icon: "pi pi-chevron-circle-up text-primary",
        //                 claim: "Result-Overview",
        //                 items: [
        //                     {
        //                         label: "Over All Coaching",
        //                         icon: "pi pi-arrow-circle-right text-success",
        //                         claim: "Coachingresults-ViewoverallCoachingdetails",
        //                         to: "/over-all-coaching",
        //                     },
        //                     // {
        //                     //     label: "Report Final Result",
        //                     //     icon: "pi pi-book text-info",
        //                     //     claim: "Processresults-Getcompletedcoaching",
        //                     //     to: "/report-final-result",
        //                     // },
        //                     {
        //                         label: "Take Final Action",
        //                         icon: "pi pi-arrow-circle-right text-success",
        //                         claim: "Processresults-Completedcoaching",
        //                         to: "/take-final-action",
        //                     },
        //                     {
        //                         label: "PL Status",
        //                         icon: "pi pi-arrow-circle-right text-success",
        //                         claim: "PLStatus-GetplList",
        //                         to: "/view-pl-status",
        //                     },
        //                     {
        //                         label: "Coaching Status",
        //                         icon: "pi pi-arrow-circle-right text-success",
        //                         claim: "PLStatus-Coachingsts",
        //                         to: "/view-coaching-status",
        //                     },
        //                 ],
        //             },
        //             {
        //                 label: "Report",
        //                 icon: "pi pi-chevron-circle-up text-primary",
        //                 claim: "Report-View",
        //                 items: [
        //                     {
        //                         label: "Section Reports",
        //                         icon: "pi pi-arrow-circle-right text-info",
        //                         claim: "ManagerReport-Landing",
        //                         to: "/view-management-reports",
        //                     },
        //                     {
        //                         label: "General Reports",
        //                         icon: "pi pi-arrow-circle-right text-info",
        //                         claim: "Generate-Report",
        //                         to: "/over-all-data-analytics-reports",
        //                     },
        //                     {
        //                         label: "Generate Certificate",
        //                         icon: "pi pi-file-pdf text-success",
        //                         claim: "Certificates-GetCompletedPl",
        //                         to: "/certificate",
        //                     },
        //                     {
        //                         label: "Dashboard",
        //                         icon: "pi pi-palette text-warning",
        //                         claim: "Dashboard-View",
        //                         to: `/Dashboard-View`,
        //                     },
        //                 ],
        //             },
        //         ],
        //     },
        // ],
    },
];
export default AppNavs;
