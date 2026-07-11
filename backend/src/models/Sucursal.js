const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../config/database");

/**
 * Modelo Sucursal
 * Representa cada una de las 3 tiendas físicas de MercaLocal.
 * Se define primero porque Usuario depende de ella (FK sucursal_id).
 */
class Sucursal extends Model {}

Sucursal.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    direccion: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    activa: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: "Sucursal",
    tableName: "sucursales",
    timestamps: true,
  }
);

module.exports = Sucursal;
