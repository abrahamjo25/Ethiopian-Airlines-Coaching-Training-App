export const dateFormate = (props) => {
    const date = new Date(props);
    const monthNumber = date.getMonth();
    date.setMonth(monthNumber); // starts with 0, so 0 is January
    return date.toLocaleString("en-EN", { month: "long" });
};
