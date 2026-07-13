const { Producto, Sucursal } = require("../models");
const { Op } = require("sequelize");

/**
 * Patrón REPOSITORY (igual que usuario.repository.js)
 * Encapsula todas las consultas Sequelize relacionadas con Producto.
 */
class ProductoRepository {
  async crear(datosProducto) {
    return Producto.create(datosProducto);
  }

  async buscarPorId(id) {
    return Producto.findByPk(id, {
      include: [{ model: Sucursal, as: "sucursal" }],
    });
  }

  /** Consulta general con filtros opcionales de búsqueda y sucursal. */
  async listar({ q, sucursalId, soloActivos = true } = {}) {
    const where = {};
    if (soloActivos) where.activo = true;
    if (sucursalId) where.sucursalId = sucursalId;
    if (q) where.nombre = { [Op.like]: `%${q}%` };

    return Producto.findAll({
      where,
      include: [{ model: Sucursal, as: "sucursal" }],
      order: [["nombre", "ASC"]],
    });
  }

  async actualizar(id, cambios) {
    const producto = await Producto.findByPk(id);
    if (!producto) return null;
    return producto.update(cambios);
  }

  /** "Baja" lógica: no se borra el registro, solo se marca inactivo. */
  async darDeBaja(id) {
    return this.actualizar(id, { activo: false });
  }
}

module.exports = new ProductoRepository();
