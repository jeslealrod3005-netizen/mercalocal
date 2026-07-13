const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../config/database");
const Sucursal = require("./Sucursal");

/**
 * Modelo Producto
 * ------------------------------------------------------------------
 * Representa cada artículo del inventario, con su stock por sucursal.
 * Corresponde al Sprint 2 del Producto 1: "Módulo de inventario: Alta
 * de productos, stock por sucursal, alertas de mínimos."
 */
class Producto extends Model {
  /** true si el stock actual ya alcanzó (o está por debajo de) el mínimo. */
  get stockBajo() {
    return this.stock <= this.stockMinimo;
  }
}

Producto.init(
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
    categoria: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    stockMinimo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 5,
      field: "stock_minimo",
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
    modelName: "Producto",
    tableName: "productos",
    timestamps: true,
  }
);

Producto.belongsTo(Sucursal, { foreignKey: "sucursalId", as: "sucursal" });
Sucursal.hasMany(Producto, { foreignKey: "sucursalId", as: "productos" });

module.exports = Producto;