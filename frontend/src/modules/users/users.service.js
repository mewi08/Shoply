import { api } from "../../api/request";

export const list = () => api.get("/usuarios");
export const get = (id) => api.get(`/usuarios/${id}`);
export const create = (data) => api.post("/usuarios", data);
export const update = (id, data) => api.put(`/usuarios/${id}`, data );
export const remove = (id) => api.delete(`/usuarios/${id}`);
export const updateMe = (data) => api.patch("/usuarios/me", data);
export const changePassword = (data) => api.patch("/usuarios/me/password", data);
