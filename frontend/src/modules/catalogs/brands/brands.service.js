import { api } from "../../../api/request";

export const list = () => api.get("/marcas");
export const get = (id) => api.get(`/marcas/${id}`);
export const create = (data) => api.post("/marcas", data);
export const update = (id, data) => api.put(`/marcas/${id}`, data);
export const remove = (id) => api.delete(`/marcas/${id}`);
