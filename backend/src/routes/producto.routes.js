const { Router } = require("express");
const productoController = require("../controllers/producto.controller");
const { verificarToken } = require("../middlewares/auth.middleware");

const router = Router();

// Todas las rutas requieren sesión iniciada (cualquier rol autenticado puede consultar)
router.get("/", verificarToken, productoController.listar);
router.get("/:id", verificarToken, productoController.obtenerUno);
router.post("/", verificarToken, productoController.crear);
router.put("/:id", verificarToken, productoController.actualizar);
router.delete("/:id", verificarToken, productoController.darDeBaja);

module.exports = router;
