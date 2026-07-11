/**
 * Middleware de VALIDACIÓN DE ENTRADA
 * ------------------------------------------------------------------
 * Verifica que el body de la petición de registro/login tenga el
 * formato mínimo esperado antes de llegar al controlador. Mantiene la
 * validación separada de la lógica de negocio (Single Responsibility).
 */
function validarRegistro(req, res, next) {
  const { nombre, email, password, rol } = req.body;
  const errores = [];

  if (!nombre || nombre.trim().length < 3) {
    errores.push("El nombre debe tener al menos 3 caracteres.");
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errores.push("El email no tiene un formato válido.");
  }
  if (!password || password.length < 8) {
    errores.push("La contraseña debe tener al menos 8 caracteres.");
  }
  const rolesValidos = ["gerente", "encargado_sucursal", "almacenista"];
  if (rol && !rolesValidos.includes(rol)) {
    errores.push(`El rol debe ser uno de: ${rolesValidos.join(", ")}.`);
  }

  if (errores.length > 0) {
    return res.status(400).json({ ok: false, errores });
  }

  next();
}

function validarLogin(req, res, next) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      ok: false,
      mensaje: "Email y password son obligatorios.",
    });
  }
  next();
}

module.exports = { validarRegistro, validarLogin };
