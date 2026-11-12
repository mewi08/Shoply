const MENSAJES = {
  pendiente: 'Tu solicitud está en revisión',
  rechazada: 'Tu solicitud fue rechazada',
  inactiva: 'Tu tienda está desactivada',
};

exports.storeBlock = (rol, tiendaEstado) => {
  if (rol === 'superadmin' || tiendaEstado === 'activa') return null;
  return MENSAJES[tiendaEstado];
};