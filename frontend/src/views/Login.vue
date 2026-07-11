<template>
  <div class="login-container">
    <div class="login-card">
      <h1>MercaLocal</h1>
      <p class="subtitulo">Inicia sesión para continuar</p>

      <form @submit.prevent="manejarSubmit">
        <label for="email">Correo electrónico</label>
        <input id="email" v-model="email" type="email" required placeholder="tu@correo.com" />

        <label for="password">Contraseña</label>
        <input id="password" v-model="password" type="password" required placeholder="••••••••" />

        <p v-if="auth.error" class="error">{{ auth.error }}</p>

        <button type="submit" :disabled="auth.cargando">
          {{ auth.cargando ? "Ingresando..." : "Iniciar sesión" }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth.store";

const email = ref("");
const password = ref("");
const auth = useAuthStore();
const router = useRouter();

async function manejarSubmit() {
  const exito = await auth.iniciarSesion(email.value, password.value);
  if (exito) {
    router.push("/dashboard");
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #f4f6f8;
}
.login-card {
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 360px;
}
h1 {
  margin: 0;
  color: #1f4e79;
}
.subtitulo {
  color: #666;
  margin-bottom: 1.5rem;
}
label {
  display: block;
  font-size: 0.85rem;
  margin-top: 1rem;
  margin-bottom: 0.25rem;
  color: #333;
}
input {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  box-sizing: border-box;
}
button {
  margin-top: 1.5rem;
  width: 100%;
  padding: 0.7rem;
  background: #1f4e79;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
}
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.error {
  color: #c0392b;
  font-size: 0.85rem;
  margin-top: 0.75rem;
}
</style>
