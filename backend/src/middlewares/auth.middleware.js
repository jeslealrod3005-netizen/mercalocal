const jwt = require("jsonwebtoken");

/**
 * Patrón MIDDLEWARE / CHAIN OF RESPONSIBILITY
 * ------------------------------------------------------------------
 * Cada middleware resuelve UNA responsabilidad y pasa el control al
 * siguiente eslabón mediante next(). Este middleware verifica que la
 * petición incluya un token JWT válido (Producto 1, sección 7.5).
 */
function verificarToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      ok: false,
      mensaje: "Token no proporcionado. Incluye 'Authorization: Bearer <token>'.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = payload; // { id, rol, sucursalId }
    next();
  } catch (error) {
    return res.status(401).json({
      ok: false,
      mensaje: "Token inválido o expirado.",
    });
  }
}

module.exports = { verificarToken };
