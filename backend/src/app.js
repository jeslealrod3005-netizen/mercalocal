const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const usuarioRoutes = require("./routes/usuario.routes");
const productoRoutes = require("./routes/producto.routes");
const { manejadorErrores } = require("./middlewares/error.middleware");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ ok: true, servicio: "MercaLocal API", estado: "operativo" });
});

app.use("/api/auth", authRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/productos", productoRoutes);

// Middleware de errores: SIEMPRE al final de la cadena
app.use(manejadorErrores);

module.exports = app;
