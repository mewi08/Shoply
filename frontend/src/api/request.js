async function request(endpoint, method = "GET", data) {
  const options = {
    method,
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  };

  if (data) options.body = JSON.stringify(data);

  const response = await fetch(`/api${endpoint}`, options);
  const result = await response.json().catch(() => ({}));

  if (!response.ok || !result.success) {
    const error = new Error(result.message || "Error en la solicitud");
    error.status = response.status;
    throw error;
  }
  return result;
}

export const api = {
  get: (endpoint) => request(endpoint),
  post: (endpoint, data) => request(endpoint, "POST", data),
  put: (endpoint, data) => request(endpoint, "PUT", data),
  patch: (endpoint, data) => request(endpoint, "PATCH", data),
  delete: (endpoint) => request(endpoint, "DELETE"),
};
