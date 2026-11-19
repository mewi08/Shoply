import { api } from "../../api/request";

export const list = () => api.get("/lotes");
export const get = (id) => api.get(`/lotes/${id}`);
export const create = (data) => api.post("/lotes", data);
export const update = (id, data) => api.put(`/lotes/${id}`, data);
export const remove = (id) => api.delete(`/lotes/${id}`);