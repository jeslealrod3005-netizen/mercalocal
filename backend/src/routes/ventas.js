const express = require('express');
const router = express.Router();
const ventaController = require('../controllers/ventaController');

router.post('/', ventaController.registrarVenta);
router.get('/', ventaController.obtenerVentas);
router.get('/:id', ventaController.obtenerVenta);

module.exports = router;