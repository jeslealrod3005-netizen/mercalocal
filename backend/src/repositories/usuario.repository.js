const { Usuario, Sucursal } = require("../models");

/**
 * Patrón REPOSITORY
 * ------------------------------------------------------------------
 * Encapsula todas las consultas Sequelize relacionadas con Usuario.
 * Los controladores NUNCA llaman a Usuario.findAll(...) directamente:
 * siempre pasan por este repositorio, tal como se justifica en el
 * Producto 1 (sección 7.2 - Patrón Repository):
 * "Permite cambiar el ORM o la base de datos en el futuro sin
 *  modificar la lógica de negocio. Simplifica las pruebas unitarias
 *  al poder sustituir el repositorio por un mock."
 */
class UsuarioRepository {
  async crear(datosUsuario) {
    return Usuario.create(datosUsuario);
  }

  async buscarPorEmail(email) {
    return Usuario.findOne({
      where: { email },
      include: [{ model: Sucursal, as: "sucursal" }],
    });
  }

  async buscarPorId(id) {
    return Usuario.findByPk(id, {
      include: [{ model: Sucursal, as: "sucursal" }],
    });
  }

  async listarTodos({ sucursalId } = {}) {
    const where = {};
    if (sucursalId) where.sucursalId = sucursalId;
    return Usuario.findAll({
      where,
      include: [{ model: Sucursal, as: "sucursal" }],
      order: [["createdAt", "DESC"]],
    });
  }

  async actualizar(id, cambios) {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) return null;
    return usuario.update(cambios);
  }

  async desactivar(id) {
    return this.actualizar(id, { activo: false });
  }

  async existeEmail(email) {
    const usuario = await Usuario.findOne({ where: { email } });
    return Boolean(usuario);
  }
}

// Se exporta una única instancia (uso conjunto con el Singleton de Sequelize)
module.exports = new UsuarioRepository();
