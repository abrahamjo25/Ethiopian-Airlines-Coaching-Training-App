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
                claim: "Coaching-Master",
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
                        claim: "PlanDuration-Index",
                        to: "/planning-durations",
                    },
                    {
                        label: "Trainer",
                        icon: "pi pi-discord text-primary",
                        claim: "Trainer-Index",
                        to: "/traineer-lists",
                    },
                    {
                        label: "HR Specialist",
                        icon: "pi pi-user text-warning",
                        claim: "HRSpecialist-Index",
                        to: "/hr-specialist",
                    },
                    {
                        label: "Mapping",
                        icon: "pi pi-cog text-warning",
                        claim: "Mapping-Index",
                        to: "/create-mapping",
                    },
                    {
                        label: "Approvals",
                        icon: "pi pi-check-circle text-info",
                        claim: "HR-Approvals",
                        to: "/approvals",
                    },
                ],
            },
            {
                label: "Planning",
                icon: "pi pi-compass text-primary",
                claim: "Planning-Master",
                items: [
                    {
                        label: "Annual Plan",
                        icon: "pi pi-arrow-circle-right text-info",
                        claim: "AnnualPlan-Index",
                        to: "/annual-plans",
                    },
                    {
                        label: "Action Plan",
                        icon: "pi pi-arrow-circle-right text-info",
                        claim: "ActionPlan-Index",
                        to: "/action-plan",
                    },
                ],
            },
            {
                label: "Coaching",
                icon: "pi pi-list text-info",
                claim: "Coaching-Signing",
                items: [
                    {
                        label: "Trainee Sign",
                        icon: "pi pi-arrow-circle-right text-info",
                        claim: "TraineSign-Index",
                        to: "/trainee-sign",
                    },
                    {
                        label: "Coach Sign",
                        icon: "pi pi-arrow-circle-right text-info",
                        claim: "Coaching-Sign",
                        to: "/coach-action",
                    },
                ],
            },
            {
                label: "Assessment",
                icon: "pi pi-chevron-circle-up text-primary",
                claim: "Assessment-Master",
                items: [
                    {
                        label: "Assessment",
                        icon: "pi pi-arrow-circle-right text-info",
                        claim: "Assessment-Sign",
                        to: "/assessing-trainee",
                    },
                    {
                        label: "Interim",
                        icon: "pi pi-arrow-circle-right text-info",
                        claim: "Interim-Assessment",
                        to: "/take-interm-assessments",
                    },
                ],
            },
            {
                label: "Report",
                icon: "pi pi-book text-success",
                claim: "Report-Master",
                items: [
                    {
                        label: "Result",
                        icon: "pi pi-arrow-circle-right text-info",
                        claim: "Result-Index",
                        to: "/over-all-coaching",
                    },
                    {
                        label: "S.Report",
                        icon: "pi pi-book text-info",
                        claim: "SectionReport-Index",
                        to: "/view-management-reports",
                    },
                    {
                        label: "G.Report",
                        icon: "pi pi-palette text-warning",
                        claim: "GeneralReport-Index",
                        to: "/over-all-data-analytics-reports",
                    },
                ],
            },
        ],
    },
];
export default AppNavs;
