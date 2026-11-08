import { api } from "../../../api/request";

export const list = () => api.get("/categorias");
export const get = (id) => api.get(`/categorias/${id}`);
export const create = (data) => api.post("/categorias", data);
export const update = (id, data) => api.put(`/categorias/${id}`, data);
export const remove = (id) => api.delete(`/categorias/${id}`);
