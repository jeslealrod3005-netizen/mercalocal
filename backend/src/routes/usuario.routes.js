const { Router } = require("express");
const usuarioController = require("../controllers/usuario.controller");
const { verificarToken } = require("../middlewares/auth.middleware");
const { permitirRoles } = require("../middlewares/role.middleware");

const router = Router();

// Cadena de middlewares: autenticación -> autorización (solo gerente) -> controlador
router.get("/", verificarToken, permitirRoles("gerente"), usuarioController.listar);
router.get("/:id", verificarToken, permitirRoles("gerente"), usuarioController.obtenerUno);
router.put("/:id", verificarToken, permitirRoles("gerente"), usuarioController.actualizar);
router.delete("/:id", verificarToken, permitirRoles("gerente"), usuarioController.desactivar);

module.exports = router;
