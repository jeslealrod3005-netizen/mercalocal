const { DataTypes, Model } = require("sequelize");
const bcrypt = require("bcrypt");
const { sequelize } = require("../config/database");
const Sucursal = require("./Sucursal");

/**
 * Modelo Usuario
 * ------------------------------------------------------------------
 * Corresponde al actor "Gerente general", "Encargado de sucursal" o
 * "Almacenista" definidos en el Producto 1 (sección 2.3 - Actores del
 * sistema). El campo `rol` determina los permisos del usuario dentro
 * del sistema (middleware de autorización, ver role.middleware.js).
 */
class Usuario extends Model {
  /** Compara una contraseña en texto plano contra el hash almacenado. */
  async validarPassword(passwordPlano) {
    return bcrypt.compare(passwordPlano, this.password);
  }

  /** Representación segura del usuario (sin password) para respuestas JSON. */
  toSafeJSON() {
    const { id, nombre, email, rol, sucursalId, activo, createdAt } = this;
    return { id, nombre, email, rol, sucursalId, activo, createdAt };
  }
}

Usuario.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    rol: {
      type: DataTypes.ENUM("gerente", "encargado_sucursal", "almacenista"),
      allowNull: false,
      defaultValue: "almacenista",
    },
    sucursalId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      field: "sucursal_id",
      references: { model: Sucursal, key: "id" },
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: "Usuario",
    tableName: "usuarios",
    timestamps: true,
    hooks: {
      // Cifra la contraseña automáticamente antes de insertar/actualizar
      beforeCreate: async (usuario) => {
        const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;
        usuario.password = await bcrypt.hash(usuario.password, saltRounds);
      },
      beforeUpdate: async (usuario) => {
        if (usuario.changed("password")) {
          const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;
          usuario.password = await bcrypt.hash(usuario.password, saltRounds);
        }
      },
    },
  }
);

Usuario.belongsTo(Sucursal, { foreignKey: "sucursalId", as: "sucursal" });
Sucursal.hasMany(Usuario, { foreignKey: "sucursalId", as: "usuarios" });

module.exports = Usuario;
