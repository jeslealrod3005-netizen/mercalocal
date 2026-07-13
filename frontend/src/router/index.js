import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth.store";
import Login from "../views/Login.vue";
import Dashboard from "../views/Dashboard.vue";
import Productos from "../views/Productos.vue";

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", name: "login", component: Login },
  {
    path: "/dashboard",
    name: "dashboard",
    component: Dashboard,
    meta: { requiereAuth: true },
  },
  { path: "/productos", name: "productos", component: Productos, meta: { requiereAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Guard de navegación: protege rutas que requieren sesión iniciada
router.beforeEach((to) => {
  const auth = useAuthStore();
  if (to.meta.requiereAuth && !auth.estaAutenticado) {
    return { name: "login" };
  }
  return true;
});

export default router;
