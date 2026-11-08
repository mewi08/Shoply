import { api } from "../../../api/request";

export const list = () => api.get("/unidades-medida");
export const get = (id) => api.get(`/unidades-medida/${id}`);
export const create = (data) => api.post("/unidades-medida", data);
export const update = (id, data) => api.put(`/unidades-medida/${id}`, data);
export const remove = (id) => api.delete(`/unidades-medida/${id}`);
