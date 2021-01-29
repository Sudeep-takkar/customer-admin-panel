import http from "../http-common";

const getAll = () => {
    return http.get("/instructors");
};

const get = id => {
    return http.get(`/instructors/${id}`);
};

const create = data => {
    return http.post("/instructors", data);
};

const update = (id, data) => {
    return http.put(`/instructors/${id}`, data);
};

const remove = id => {
    return http.delete(`/instructors/${id}`);
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