import { defineStore } from "pinia";
import api from "../services/api";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    usuario: JSON.parse(localStorage.getItem("mercalocal_usuario") || "null"),
    token: localStorage.getItem("mercalocal_token") || null,
    error: null,
    cargando: false,
  }),

  getters: {
    estaAutenticado: (state) => Boolean(state.token),
    rol: (state) => state.usuario?.rol || null,
  },

  actions: {
    async iniciarSesion(email, password) {
      this.cargando = true;
      this.error = null;
      try {
        const { data } = await api.post("/auth/login", { email, password });
        this.token = data.token;
        this.usuario = data.usuario;
        localStorage.setItem("mercalocal_token", data.token);
        localStorage.setItem("mercalocal_usuario", JSON.stringify(data.usuario));
        return true;
      } catch (err) {
        this.error = err.response?.data?.mensaje || "No fue posible iniciar sesión.";
        return false;
      } finally {
        this.cargando = false;
      }
    },

    cerrarSesion() {
      this.usuario = null;
      this.token = null;
      localStorage.removeItem("mercalocal_token");
      localStorage.removeItem("mercalocal_usuario");
    },
  },
});
