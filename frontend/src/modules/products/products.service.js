import { api } from "../../api/request";

export const list = () => api.get("/productos");
export const get = (id) => api.get(`/productos/${id}`);
export const create = (data) => api.post("/productos", data);
export const update = (id, data) => api.put(`/productos/${id}`, data);
export const toggleStatus = (id) => api.patch(`/productos/${id}/estado`);

export const listBrands = () => api.get("/marcas");
export const listCategories = () => api.get("/categorias");
export const listUnits = () => api.get("/unidades-medida");