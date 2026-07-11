const jwt = require("jsonwebtoken");
const usuarioRepository = require("../repositories/usuario.repository");

/**
 * Patrón MVC — Controller
 * ------------------------------------------------------------------
 * Recibe la petición HTTP ya validada por los middlewares, invoca al
 * repositorio (nunca a Sequelize directamente) y devuelve la respuesta
 * en formato JSON que consumirá la "Vista" (la SPA de Vue.js).
 */

function generarToken(usuario) {
  return jwt.sign(
    { id: usuario.id, rol: usuario.rol, sucursalId: usuario.sucursalId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "8h" }
  );
}

async function registrar(req, res, next) {
  try {
    const { nombre, email, password, rol, sucursalId } = req.body;

    const yaExiste = await usuarioRepository.existeEmail(email);
    if (yaExiste) {
      return res.status(409).json({ ok: false, mensaje: "El email ya está registrado." });
    }

    // password se cifra automáticamente en el hook beforeCreate del modelo
    const nuevoUsuario = await usuarioRepository.crear({
      nombre,
      email,
      password,
      rol,
      sucursalId,
    });

    return res.status(201).json({
      ok: true,
      mensaje: "Usuario registrado correctamente.",
      usuario: nuevoUsuario.toSafeJSON(),
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const usuario = await usuarioRepository.buscarPorEmail(email);
    if (!usuario || !usuario.activo) {
      return res.status(401).json({ ok: false, mensaje: "Credenciales inválidas." });
    }

    const passwordValido = await usuario.validarPassword(password);
    if (!passwordValido) {
      return res.status(401).json({ ok: false, mensaje: "Credenciales inválidas." });
    }

    const token = generarToken(usuario);

    return res.json({
      ok: true,
      mensaje: "Inicio de sesión exitoso.",
      token,
      usuario: usuario.toSafeJSON(),
    });
  } catch (error) {
    next(error);
  }
}

async function perfil(req, res, next) {
  try {
    const usuario = await usuarioRepository.buscarPorId(req.usuario.id);
    if (!usuario) {
      return res.status(404).json({ ok: false, mensaje: "Usuario no encontrado." });
    }
    return res.json({ ok: true, usuario: usuario.toSafeJSON() });
  } catch (error) {
    next(error);
  }
}

module.exports = { registrar, login, perfil };
