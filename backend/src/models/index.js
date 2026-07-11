const { sequelize } = require("../config/database");
const Sucursal = require("./Sucursal");
const Usuario = require("./Usuario");

/**
 * Punto único de exportación de modelos + utilidad de sincronización.
 * Se usa desde server.js para verificar la conexión y (en desarrollo)
 * sincronizar las tablas con la base de datos MySQL.
 */
async function conectarBaseDeDatos() {
  await sequelize.authenticate();
  console.log("✅ Conexión a MySQL establecida correctamente (Sequelize).");

  if (process.env.NODE_ENV !== "production") {
    await sequelize.sync({ alter: true });
    console.log("🔄 Modelos sincronizados con la base de datos (modo desarrollo).");
  }
}

module.exports = { sequelize, Sucursal, Usuario, conectarBaseDeDatos };
