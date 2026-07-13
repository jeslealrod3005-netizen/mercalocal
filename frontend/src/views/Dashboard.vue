<template>
  <div class="dashboard">
    <header>
      <h1>MercaLocal</h1>
      <button @click="salir">Cerrar sesión</button>
    </header>

    <main>
      <h2>Bienvenido/a, {{ auth.usuario?.nombre }}</h2>
      <p>
        Rol: <strong>{{ auth.rol }}</strong>
      </p>
      <p class="nota">
        Este es el punto de entrada tras el login. Los módulos de inventario,
        ventas y reportes (Sprints 2 a 4) se integrarán aquí como nuevas
        rutas protegidas del router.
      </p>
      <RouterLink to="/productos" class="link-modulo">Ir a Inventario →</RouterLink>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth.store";

const auth = useAuthStore();
const router = useRouter();

function salir() {
  auth.cerrarSesion();
  router.push("/login");
}
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: #f4f6f8;
}
header {
  background: #1f4e79;
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
header button {
  background: white;
  color: #1f4e79;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
}
main {
  padding: 2rem;
}
.nota {
  color: #555;
  max-width: 500px;
}
</style>
