/**
 * Middleware de AUTORIZACIÓN
 * ------------------------------------------------------------------
 * Se coloca en la cadena DESPUÉS de verificarToken. Recibe la lista de
 * roles permitidos para una ruta y corta la cadena con 403 si el rol
 * del usuario autenticado no está permitido.
 *
 * Uso: router.get('/reportes', verificarToken, permitirRoles('gerente'), ...)
 */
function permitirRoles(...rolesPermitidos) {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({ ok: false, mensaje: "No autenticado." });
    }

    if (!rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({
        ok: false,
        mensaje: `El rol '${req.usuario.rol}' no tiene permiso para esta acción.`,
      });
    }

    next();
  };
}

module.exports = { permitirRoles };
