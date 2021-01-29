import http from "../http-common";

const getAll = () => {
    return http.get("/programs");
};

const get = id => {
    return http.get(`/programs/${id}`);
};

const create = data => {
    return http.post("/programs", data);
};

const update = (id, data) => {
    return http.put(`/programs/${id}`, data);
};

const remove = id => {
    return http.delete(`/programs/${id}`);
};

// const removeAll = () => {
//     return http.delete(`/tutorials`);
// };

// const findByTitle = title => {
//     return http.get(`/tutorials?title=${title}`);
// };

export default {
    getAll,
    get,
    create,
    update,
    remove
};