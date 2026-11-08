exports.scoped = (query, user) => {
  return user.rol === "superadmin"
    ? query
    : query.where({ idtienda: user.idtienda });
};
