<template>
  <div class="productos">
    <header>
      <h1>MercaLocal — Inventario</h1>
      <RouterLink to="/dashboard" class="link-volver">← Volver al Dashboard</RouterLink>
    </header>

    <main>
      <!-- ===== CONSULTA: buscador ===== -->
      <section class="bloque">
        <h2>Consultar productos</h2>
        <input
          v-model="busqueda"
          @input="buscar"
          type="text"
          placeholder="Buscar producto por nombre..."
          class="input-busqueda"
        />
      </section>

      <!-- ===== ALTA: formulario para agregar producto ===== -->
      <section class="bloque">
        <h2>Dar de alta un producto</h2>
        <form @submit.prevent="darDeAlta" class="form-alta">
          <input v-model="nuevo.nombre" type="text" placeholder="Nombre del producto" required />
          <input v-model="nuevo.categoria" type="text" placeholder="Categoría (opcional)" />
          <input v-model.number="nuevo.precio" type="number" step="0.01" placeholder="Precio" required />
          <input v-model.number="nuevo.stock" type="number" placeholder="Stock inicial" required />
          <input v-model.number="nuevo.stockMinimo" type="number" placeholder="Stock mínimo" />
          <button type="submit">+ Agregar</button>
        </form>
        <p v-if="mensaje" class="mensaje">{{ mensaje }}</p>
      </section>

      <!-- ===== CONSULTA: tabla de productos + BAJA ===== -->
      <section class="bloque">
        <h2>Productos registrados ({{ productos.length }})</h2>
        <table v-if="productos.length">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in productos" :key="p.id" :class="{ alerta: p.stockBajo }">
              <td>{{ p.nombre }}</td>
              <td>{{ p.categoria || "—" }}</td>
              <td>${{ Number(p.precio).toFixed(2) }}</td>
              <td>{{ p.stock }}</td>
              <td>
                <span v-if="p.stockBajo" class="badge-bajo">Stock bajo</span>
                <span v-else class="badge-ok">OK</span>
              </td>
              <td>
                <button class="btn-baja" @click="darDeBaja(p)">Dar de baja</button>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-else class="vacio">No hay productos registrados todavía.</p>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../services/api";

const productos = ref([]);
const busqueda = ref("");
const mensaje = ref("");

const nuevo = ref({
  nombre: "",
  categoria: "",
  precio: null,
  stock: null,
  stockMinimo: 5,
});

// ---- CONSULTA ----
async function cargarProductos() {
  try {
    const { data } = await api.get("/productos", {
      params: busqueda.value ? { q: busqueda.value } : {},
    });
    productos.value = data.productos;
  } catch (err) {
    mensaje.value = "No se pudieron cargar los productos.";
  }
}

let debounceTimer = null;
function buscar() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(cargarProductos, 300);
}

// ---- ALTA ----
async function darDeAlta() {
  mensaje.value = "";
  try {
    await api.post("/productos", nuevo.value);
    mensaje.value = `Producto "${nuevo.value.nombre}" agregado correctamente.`;
    nuevo.value = { nombre: "", categoria: "", precio: null, stock: null, stockMinimo: 5 };
    await cargarProductos();
  } catch (err) {
    mensaje.value = err.response?.data?.mensaje || "No se pudo dar de alta el producto.";
  }
}

// ---- BAJA ----
async function darDeBaja(producto) {
  const confirmar = window.confirm(`¿Dar de baja "${producto.nombre}"?`);
  if (!confirmar) return;
  try {
    await api.delete(`/productos/${producto.id}`);
    await cargarProductos();
  } catch (err) {
    mensaje.value = "No se pudo dar de baja el producto.";
  }
}

onMounted(cargarProductos);
</script>

<style scoped>
.productos {
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
.link-volver {
  color: white;
  text-decoration: none;
  font-size: 0.9rem;
}
main {
  padding: 2rem;
  max-width: 900px;
  margin: 0 auto;
}
.bloque {
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}
.bloque h2 {
  margin-top: 0;
  color: #1f4e79;
  font-size: 1.1rem;
}
.input-busqueda {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  box-sizing: border-box;
}
.form-alta {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}
.form-alta input {
  padding: 0.6rem;
  border: 1px solid #ccc;
  border-radius: 6px;
}
.form-alta button {
  grid-column: span 2;
  padding: 0.7rem;
  background: #548135;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
}
.mensaje {
  margin-top: 0.75rem;
  color: #1f4e79;
  font-size: 0.9rem;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  text-align: left;
  padding: 0.6rem;
  border-bottom: 1px solid #eee;
  font-size: 0.9rem;
}
tr.alerta {
  background: #fff3f3;
}
.badge-bajo {
  background: #c0392b;
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
}
.badge-ok {
  background: #548135;
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
}
.btn-baja {
  background: #c0392b;
  color: white;
  border: none;
  padding: 0.4rem 0.7rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
}
.vacio {
  color: #777;
}
</style>
