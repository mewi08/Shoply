export function Alert({ type = "info", id, children }) {
  if (type === "error" && !children) return null;

  return (
    <p
      id={id}
      role={type === "error" ? "alert" : "status"}
      className={`alert alert-${type}`}
    >
      {children}
    </p>
  );
}
