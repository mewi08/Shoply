async function request(endpoint, options = {}) {
  const { method = "GET", data = null, params = null } = options;

  let url = `/api${endpoint}`;
  if (params) {
    const query = new URLSearchParams(params).toString();
    url += `?${query}`;
  }

  const fetchOptions = {
    method,
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  };

  if (data) fetchOptions.body = JSON.stringify(data);

  const response = await fetch(url, fetchOptions);
  const result = await response.json().catch(() => ({}));

  if (!response.ok || !result.success) {
    const error = new Error(result.message || "Error en la solicitud");
    error.status = response.status;
    throw error;
  }
  return result;
}

export const api = {
  get: (endpoint, params) => request(endpoint, { params }),
  post: (endpoint, data) => request(endpoint, { method: "POST", data }),
  put: (endpoint, data) => request(endpoint, { method: "PUT", data }),
  patch: (endpoint, data) => request(endpoint, { method: "PATCH", data }),
  delete: (endpoint) => request(endpoint, { method: "DELETE" }),
};
