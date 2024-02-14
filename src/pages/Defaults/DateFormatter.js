export const DateFormatter = (props) => {
    let today = new Date(props);
    let month = today.getMonth();
    let year = today.getFullYear();
    let prevMonth = month === 0 ? 11 : month - 1;
    let prevYear = prevMonth === 11 ? year - 1 : year;
    let nextMonth = month === 11 ? 0 : month + 1;
    let nextYear = nextMonth === 0 ? year + 1 : year;

    let minDate = new Date(props);
    minDate.setMonth(prevMonth);
    minDate.setFullYear(prevYear);

    let maxDate = new Date(props);
    maxDate.setMonth(nextMonth);
    maxDate.setFullYear(nextYear);
};
