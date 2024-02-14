export const resetStorage = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("user");
    localStorage.clear();
};
export const getToken = () => {
    if (JSON.parse(localStorage.getItem("user")).idToken) {
        return true;
    } else {
        return false;
    }
};
