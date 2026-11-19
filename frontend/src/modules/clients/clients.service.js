import { api } from "../../api/request";

export const list = () => api.get("/clientes");
export const get = () => api.get(`/clientes/${id}`);
export const create = (data) => api.post("/clientes", data);
export const update = (id, data) => api.put(`/clientes/${id}`, data);
export const toggleStatus = (id) => api.patch(`/clientes/${id}`);
