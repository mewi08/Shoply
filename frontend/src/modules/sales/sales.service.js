import { api } from "../../api/request";

export const list = () => api.get("/ventas");
export const get = (id) => api.get(`/ventas/${id}`);
export const create = (data) => api.post("/ventas", data);
export const cancel = (id) => api.patch(`/ventas/${id}/anular`);