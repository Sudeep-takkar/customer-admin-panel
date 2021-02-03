import http from "../http-common";

const login = data => {
    return http.post("/users/login", data);
};

const register = data => {
    return http.post("/users/register", data);
};

export default {
    login,
    register
};