const ventaRepository = require('../repositories/ventaRepository');
const Producto = require('../models/Producto');

exports.registrarVenta = async (req, res) => {
  try {
    const { productos } = req.body;
    
    if (!productos || productos.length === 0) {
      return res.status(400).json({ error: 'Debe incluir al menos un producto' });
    }
    
    const folio = `VENTA-${Date.now()}`;
    let total = 0;
    const detalles = [];
    
    for (const item of productos) {
      const producto = await Producto.findByPk(item.productoId);
      if (!producto) {
        return res.status(404).json({ error: `Producto ${item.productoId} no encontrado` });
      }
      
      const subtotal = producto.precio * item.cantidad;
      total += subtotal;
      
      detalles.push({
        productoId: item.productoId,
        cantidad: item.cantidad,
        precio_unitario: producto.precio,
        subtotal: subtotal
      });
    }
    
    const venta = await ventaRepository.crearVentaConDetalles(
      { folio, total },
      detalles
    );
    
    res.status(201).json({
      message: 'Venta registrada exitosamente',
      venta
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.obtenerVentas = async (req, res) => {
  try {
    const ventas = await ventaRepository.obtenerVentasConDetalles();
    res.json(ventas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.obtenerVenta = async (req, res) => {
  try {
    const { id } = req.params;
    const venta = await ventaRepository.obtenerVentaPorId(id);
    
    if (!venta) {
      return res.status(404).json({ error: 'Venta no encontrada' });
    }
    
    res.json(venta);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};