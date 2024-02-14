import React, { useEffect, useRef, useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { getData } from "../../services/AccessAPI";
import { Toast } from "primereact/toast";
import Coaching from "./Coaching";
import Assessment from "./Assessment";
import PLDashboard from "./DevelopedPl";
import InterimDashboard from "./InterimDashboard";
import ChartLoading from "../Defaults/ChartLoading";

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [year, setYear] = useState(null);
    const [yearDropdown, setYearDropdown] = useState(null);
    const [semiYear, setSemiyear] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [statusDropdown, setStatusDropdown] = useState(null);
    const [divisions, setDivisions] = useState([]);
    const [selectedDivision, setSelectedDivision] = useState(null);
    const toast = useRef(null);
    const period = [
        {
            num: 1,
            name: "Semi Annual",
            val: "S",
            minor: [
                { name: "First semi-annual", val: "1" },
                { name: "Second semi-annual", val: "2" },
            ],
        },
        {
            num: 2,
            name: "Quarter",
            val: "Q",
            minor: [
                { name: "First Quarter", val: "1" },
                { name: "Second Quarter", val: "2" },
                { name: "Third Quarter", val: "3" },
                { name: "Fourth Quarter", val: "4" },
            ],
        },
        {
            num: 3,
            name: "Monthly",
            val: "M",
            minor: [
                { name: "Juanary", val: "1" },
                { name: "February", val: "2" },
                { name: "March", val: "3" },
                { name: "April", val: "4" },
                { name: "May", val: "5" },
                { name: "June", val: "6" },
                { name: "Julay", val: "7" },
                { name: "August", val: "8" },
                { name: "September", val: "9" },
                { name: "October", val: "10" },
                { name: "November", val: "11" },
                { name: "December", val: "12" },
            ],
        },
    ];
    useEffect(() => {
        getData(`/GeneralMasters/Divisions/Index`, `Divisions-Index`)
            .then((res) => {
                setDivisions(res.data);
            })
            .catch(() => {});
        let currentYear = new Date().getFullYear();
        let currentMonth = new Date().getMonth();
        let finYear = "";
        if (currentMonth < 6) {
            finYear = `${currentYear - 1}-${currentYear}`;
        } else {
            finYear = `${currentYear}-${currentYear + 1}`;
        }
        setYear(finYear);
    }, []);
    const finyearGen = () => {
        let option = [];
        let startYear = 2022;
        let thisYear = new Date().getFullYear();
        let currentMonth = new Date().getMonth() + 1;
        if (currentMonth > 6) {
            thisYear++;
        }
        let diffYear = parseInt(thisYear) - parseInt(startYear);
        for (let i = 0; i < diffYear; i++) {
            let obj = { name: thisYear - 1 + "-" + thisYear, val: thisYear - 1 + "-" + thisYear };
            option.push(obj);
            thisYear--;
        }
        return option;
    };
    const finYear = finyearGen();
    const optionMethod = () => {
        let view = period.filter((e) => e.num === statusDropdown);
        let option = [];
        if (view.length > 0 && view[0].minor) {
            option = view[0].minor;
        }
        return option;
    };

    const optionVar = optionMethod();
    const onDrpdownChange = (e) => {
        setSelectedOption(null);
        setSemiyear(e.target.value);
        setStatusDropdown(e.target.value.num);
    };
    const onYearChange = (e) => {
        setSelectedOption(null);
        setSemiyear(null);
        setYearDropdown(e.target.value);
        setYear(e.target.value.val);
    };
    const onStatusChange = () => {
        setLoading(false);
    };
    return (
        <div className="surface-ground py-3 md:px-6 lg:px-4">
            <Toast ref={toast} />
            <div className="card">
                <div className="grid">
                    <div className="md:col-2 col-12">
                        <Dropdown placeholder={year} options={finYear} optionLabel="name" value={year} onChange={(e) => onYearChange(e)} />
                    </div>
                    <div className="md:col-2 col-12">
                        <Dropdown placeholder="Financial Period" options={period} optionLabel="name" value={semiYear} onChange={(e) => onDrpdownChange(e)} />
                    </div>
                    <div className="md:col-2 col-12">
                        <Dropdown placeholder="Selected Status" options={optionVar} optionLabel="name" value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)} />
                    </div>
                    <div className="md:col-2 col-12">
                        <Dropdown placeholder="Division" options={divisions} optionLabel="Divisioncode" filter value={selectedDivision} onChange={(e) => setSelectedDivision(e.target.value)} />
                    </div>
                </div>
            </div>
            {loading ? <ChartLoading /> : ""}
            <div className="grid">
                <div className="md:col-6 col-12">
                    <div className="card">
                        <Coaching year={year} semiYear={semiYear} selectedOption={selectedOption} selectedDivision={selectedDivision} onStatusChange={onStatusChange} />
                    </div>
                </div>
                <div className="md:col-6 col-12">
                    <div className="card">
                        <Assessment year={year} semiYear={semiYear} selectedOption={selectedOption} selectedDivision={selectedDivision} />
                    </div>
                </div>
                {/* <div className="md:col-6 col-12">
                    <div className="card">
                        <PLDashboard year={year} semiYear={semiYear} selectedOption={selectedOption} selectedDivision={selectedDivision} />
                    </div>
                </div>
                <div className="md:col-6 col-12">
                    <div className="card">
                        <InterimDashboard year={year} semiYear={semiYear} selectedOption={selectedOption} selectedDivision={selectedDivision} />
                    </div>
                </div> */}
            </div>
        </div>
    );
};
export default Dashboard;
