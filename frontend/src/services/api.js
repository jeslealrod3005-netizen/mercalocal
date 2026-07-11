import axios from "axios";

/**
 * Instancia centralizada de Axios.
 * Todas las peticiones al backend pasan por aquí, incluyendo el
 * interceptor que adjunta automáticamente el token JWT guardado
 * tras un login exitoso.
 */
const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("mercalocal_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("mercalocal_token");
      localStorage.removeItem("mercalocal_usuario");
    }
    return Promise.reject(error);
  }
);

export default api;
