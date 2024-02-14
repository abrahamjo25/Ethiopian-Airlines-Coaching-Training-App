const SessionManager = {
    getToken() {
        const token = localStorage.getItem("idToken");
        if (token) return token;
        else return null;
    },

    setUserSession(userName, idToken, userId, userRole, userClaim) {
        localStorage.setItem("isAuthenticated", true);
        localStorage.setItem("userName", userName);
        localStorage.setItem("idToken", idToken);
        localStorage.setItem("userId", userId);
        localStorage.setItem("userRole", userRole);
        localStorage.setItem("userClaim", JSON.stringify(userClaim));
    },

    removeUserSession() {
        localStorage.setItem("isAuthenticated", false);
        localStorage.removeItem("userName");
        localStorage.removeItem("idToken");
        localStorage.removeItem("userId");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userClaim");
        localStorage.clear();
    },
};

export default SessionManager;
