const usuarioRepository = require("../repositories/usuario.repository");

/**
 * Controlador de gestión de usuarios (CRUD), restringido al rol
 * 'gerente' mediante el middleware permitirRoles('gerente') en las rutas.
 */

async function listar(req, res, next) {
  try {
    const { sucursalId } = req.query;
    const usuarios = await usuarioRepository.listarTodos({ sucursalId });
    return res.json({ ok: true, usuarios: usuarios.map((u) => u.toSafeJSON()) });
  } catch (error) {
    next(error);
  }
}

async function obtenerUno(req, res, next) {
  try {
    const usuario = await usuarioRepository.buscarPorId(req.params.id);
    if (!usuario) {
      return res.status(404).json({ ok: false, mensaje: "Usuario no encontrado." });
    }
    return res.json({ ok: true, usuario: usuario.toSafeJSON() });
  } catch (error) {
    next(error);
  }
}

async function actualizar(req, res, next) {
  try {
    const cambios = { ...req.body };
    delete cambios.email; // el email no se permite modificar por esta ruta

    const usuarioActualizado = await usuarioRepository.actualizar(req.params.id, cambios);
    if (!usuarioActualizado) {
      return res.status(404).json({ ok: false, mensaje: "Usuario no encontrado." });
    }
    return res.json({ ok: true, usuario: usuarioActualizado.toSafeJSON() });
  } catch (error) {
    next(error);
  }
}

async function desactivar(req, res, next) {
  try {
    const usuario = await usuarioRepository.desactivar(req.params.id);
    if (!usuario) {
      return res.status(404).json({ ok: false, mensaje: "Usuario no encontrado." });
    }
    return res.json({ ok: true, mensaje: "Usuario desactivado correctamente." });
  } catch (error) {
    next(error);
  }
}

module.exports = { listar, obtenerUno, actualizar, desactivar };
