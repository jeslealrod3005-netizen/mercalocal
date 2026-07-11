/**
 * Middleware de MANEJO DE ERRORES
 * ------------------------------------------------------------------
 * Último eslabón de la cadena: captura cualquier error no controlado
 * lanzado por los controladores (throw / next(error)) y responde con
 * un formato JSON uniforme, evitando exponer stack traces en producción.
 */
function manejadorErrores(err, req, res, next) {
  console.error("[ERROR]", err);

  if (err.name === "SequelizeUniqueConstraintError") {
    return res.status(409).json({
      ok: false,
      mensaje: "Ya existe un registro con esos datos únicos (por ejemplo, el email).",
    });
  }

  if (err.name === "SequelizeValidationError") {
    return res.status(400).json({
      ok: false,
      errores: err.errors.map((e) => e.message),
    });
  }

  return res.status(err.status || 500).json({
    ok: false,
    mensaje: err.message || "Error interno del servidor.",
  });
}

module.exports = { manejadorErrores };
