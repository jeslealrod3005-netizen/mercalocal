<template>
  <div class="ventas">
    <header>
      <h1>MercaLocal — Ventas</h1>
      <RouterLink to="/dashboard" class="link-volver">← Volver al Dashboard</RouterLink>
    </header>

    <main>
      <!-- ===== Registrar venta ===== -->
      <section class="bloque">
        <h2>Registrar venta</h2>

        <div class="agregar-item">
          <select v-model="productoSeleccionado">
            <option disabled value="">Selecciona un producto...</option>
            <option v-for="p in productos" :key="p.id" :value="p.id">
              {{ p.nombre }} — ${{ Number(p.precio).toFixed(2) }} (stock: {{ p.stock }})
            </option>
          </select>
          <input v-model.number="cantidad" type="number" min="1" placeholder="Cantidad" />
          <button @click="agregarAlCarrito">+ Agregar</button>
        </div>

        <table v-if="carrito.length" class="tabla-carrito">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio</th>
              <th>Subtotal</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, idx) in carrito" :key="idx">
              <td>{{ item.nombre }}</td>
              <td>{{ item.cantidad }}</td>
              <td>${{ item.precio.toFixed(2) }}</td>
              <td>${{ (item.precio * item.cantidad).toFixed(2) }}</td>
              <td><button class="btn-quitar" @click="quitarDelCarrito(idx)">✕</button></td>
            </tr>
          </tbody>
        </table>

        <p v-if="carrito.length" class="total">Total: ${{ totalCarrito.toFixed(2) }}</p>

        <button v-if="carrito.length" class="btn-registrar" @click="registrarVenta" :disabled="registrando">
          {{ registrando ? "Registrando..." : "Registrar venta" }}
        </button>

        <p v-if="mensaje" class="mensaje">{{ mensaje }}</p>
      </section>

      <!-- ===== Ticket de la última venta ===== -->
      <section v-if="ultimoTicket" class="bloque ticket">
        <h2>🧾 Ticket {{ ultimoTicket.folio }}</h2>
        <ul>
          <li v-for="(item, idx) in ultimoTicket.items" :key="idx">
            {{ item.cantidad }} x {{ item.nombre }} — ${{ (item.precio * item.cantidad).toFixed(2) }}
          </li>
        </ul>
        <p class="total">Total: ${{ Number(ultimoTicket.total).toFixed(2) }}</p>
      </section>

      <!-- ===== Historial ===== -->
      <section class="bloque">
        <h2>Historial de ventas ({{ historial.length }})</h2>
        <table v-if="historial.length" class="tabla-historial">
          <thead>
            <tr>
              <th>Folio</th>
              <th>Fecha</th>
              <th>Total</th>
              <th>Productos</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="v in historial" :key="v.id">
              <td>{{ v.folio }}</td>
              <td>{{ new Date(v.fecha).toLocaleString() }}</td>
              <td>${{ Number(v.total).toFixed(2) }}</td>
              <td>{{ v.detalles ? v.detalles.length : 0 }} producto(s)</td>
              <td>{{ v.estado }}</td>
            </tr>
          </tbody>
        </table>
        <p v-else class="vacio">Todavía no hay ventas registradas.</p>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import api from "../services/api";

const productos = ref([]);
const productoSeleccionado = ref("");
const cantidad = ref(1);
const carrito = ref([]);
const mensaje = ref("");
const registrando = ref(false);
const ultimoTicket = ref(null);
const historial = ref([]);

const totalCarrito = computed(() =>
  carrito.value.reduce((acc, item) => acc + item.precio * item.cantidad, 0)
);

async function cargarProductos() {
  const { data } = await api.get("/productos");
  productos.value = data.productos;
}

async function cargarHistorial() {
  const { data } = await api.get("/ventas");
  historial.value = data; // la API de Amy devuelve el arreglo directo
}

function agregarAlCarrito() {
  if (!productoSeleccionado.value || cantidad.value < 1) return;
  const producto = productos.value.find((p) => p.id === productoSeleccionado.value);
  if (!producto) return;

  carrito.value.push({
    productoId: producto.id,
    nombre: producto.nombre,
    precio: Number(producto.precio),
    cantidad: cantidad.value,
  });

  productoSeleccionado.value = "";
  cantidad.value = 1;
}

function quitarDelCarrito(idx) {
  carrito.value.splice(idx, 1);
}

async function registrarVenta() {
  mensaje.value = "";
  registrando.value = true;
  try {
    const productosParaEnviar = carrito.value.map((i) => ({
      productoId: i.productoId,
      cantidad: i.cantidad,
    }));

    const { data } = await api.post("/ventas", { productos: productosParaEnviar });

    // El backend de Amy solo regresa folio/total; armamos el ticket con lo que ya
    // teníamos en el carrito (nombre y precio de cada producto).
    ultimoTicket.value = {
      folio: data.venta.folio,
      total: data.venta.total,
      items: carrito.value,
    };

    carrito.value = [];
    mensaje.value = `Venta ${data.venta.folio} registrada correctamente.`;
    await Promise.all([cargarProductos(), cargarHistorial()]);
  } catch (err) {
    mensaje.value = err.response?.data?.error || "No se pudo registrar la venta.";
  } finally {
    registrando.value = false;
  }
}

onMounted(async () => {
  await Promise.all([cargarProductos(), cargarHistorial()]);
});
</script>

<style scoped>
.ventas {
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
.agregar-item {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.agregar-item select {
  flex: 1;
  padding: 0.5rem;
}
.agregar-item input {
  width: 100px;
  padding: 0.5rem;
}
.agregar-item button {
  background: #548135;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
}
th, td {
  text-align: left;
  padding: 0.5rem;
  border-bottom: 1px solid #eee;
  font-size: 0.9rem;
}
.btn-quitar {
  background: transparent;
  border: none;
  color: #c0392b;
  cursor: pointer;
  font-weight: bold;
}
.total {
  font-weight: bold;
  color: #1f4e79;
  font-size: 1.1rem;
}
.btn-registrar {
  background: #1f4e79;
  color: white;
  border: none;
  padding: 0.7rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
}
.btn-registrar:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.mensaje {
  margin-top: 0.75rem;
  color: #1f4e79;
  font-size: 0.9rem;
}
.ticket {
  border: 2px dashed #548135;
}
.ticket ul {
  list-style: none;
  padding: 0;
}
.ticket li {
  padding: 0.25rem 0;
  border-bottom: 1px dotted #ccc;
}
.vacio {
  color: #777;
}
</style>