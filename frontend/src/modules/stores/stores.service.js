import { api } from "../../api/request";

export const list = () => api.get("/tiendas");
export const getMyStore = () => api.get("/tiendas/mi-tienda");
export const update = (id, data) => api.put(`/tiendas/${id}`, data);
export const updateMyStore = (data) => api.put("/tiendas/mi-tienda", data);
export const approve = (id) => api.patch(`/tiendas/${id}/aprobar`);
export const reject = (id) => api.patch(`/tiendas/${id}/rechazar`);
export const deactivate = (id) => api.patch(`/tiendas/${id}/desactivar`);
export const reactivate = (id) => api.patch(`/tiendas/${id}/reactivar`);