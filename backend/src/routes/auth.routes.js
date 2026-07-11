const { Router } = require("express");
const authController = require("../controllers/auth.controller");
const { verificarToken } = require("../middlewares/auth.middleware");
const { validarRegistro, validarLogin } = require("../middlewares/validation.middleware");

const router = Router();

// Cadena de middlewares: validación -> controlador
router.post("/registro", validarRegistro, authController.registrar);
router.post("/login", validarLogin, authController.login);

// Cadena de middlewares: autenticación -> controlador
router.get("/perfil", verificarToken, authController.perfil);

module.exports = router;
