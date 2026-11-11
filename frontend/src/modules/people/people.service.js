import { api } from "../../api/request";

export const list = () => api.get("/personas");
export const get = (id) => api.get(`/personas/${id}`);
export const create = (data) => api.post("/personas", data);
export const update = (id, data) => api.put(`/personas/${id}`, data);
export const remove = (id) => api.delete(`/personas/${id}`);
 