const { Sequelize } = require("sequelize");
require("dotenv").config();

/**
 * Patrón SINGLETON
 * ------------------------------------------------------------------
 * Se crea UNA sola instancia de Sequelize para toda la aplicación.
 * Todos los modelos y repositorios importan esta misma instancia
 * (y por lo tanto el mismo pool de conexiones a MySQL), evitando
 * abrir conexiones redundantes cada vez que un módulo necesita
 * acceder a la base de datos.
 *
 * Justificación (Producto 1, sección 7.3 - Patrón Singleton):
 * "Garantiza que exista una sola instancia del pool de conexiones a
 *  MySQL durante toda la vida de la aplicación, evitando el
 *  agotamiento de conexiones y mejorando el rendimiento."
 */
let instance = null;

function getSequelizeInstance() {
  if (!instance) {
    instance = new Sequelize(
      process.env.DB_NAME || "mercalocal",
      process.env.DB_USER || "root",
      process.env.DB_PASSWORD || "",
      {
        host: process.env.DB_HOST || "localhost",
        port: process.env.DB_PORT || 3306,
        dialect: "mysql",
        logging: false,
        pool: {
          max: 10,
          min: 0,
          acquire: 30000,
          idle: 10000,
        },
      }
    );
  }
  return instance;
}

module.exports = { sequelize: getSequelizeInstance() };
