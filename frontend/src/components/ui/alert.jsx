export function Alert(props) {
  const { type = "info", children } = props;

  return (
    <p
      role={type === "error" ? "alert" : "status"}
      className={`alert alert-${type}`}
    >
      {children}
    </p>
  );
}
