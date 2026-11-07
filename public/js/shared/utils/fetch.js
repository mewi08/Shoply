export async function request(endpoint, method = "GET", data) {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "/pages/login.html";
    throw new Error("Debe iniciar sesión");
  }

  const options = {
    method: method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  if (data) options.body = JSON.stringify(data);

  const response = await fetch(`/api${endpoint}`, options);

  if (response.status == 401) {
    localStorage.removeItem("token");
    window.location.href = "/pages/login.html";
    throw new Error("Sesión expirada");
  }

  const result = await response.json();
  if (!result.ok) throw new Error(result.message);

  return result;
}
