export const HasRoles = (props) => {
    let index = false;
    let user = JSON.parse(localStorage.getItem("user"));
    if (user) {
        const roles = user.roles;
        if (roles) {
            const filteredRoles = roles.map((key) => key.claims.filter((index) => index.clientId === 29));
            filteredRoles.map((key) => {
                for (let i = 0; i < key.length; i++) {
                    if (key[i].claim === props) {
                        index = true;
                        break;
                    }
                }
            });
        }
    }
    return index;
};
