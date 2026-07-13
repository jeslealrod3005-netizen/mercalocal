const { sequelize } = require('../config/database');
const Venta = require('../models/Venta');
const VentaDetalle = require('../models/VentaDetalle');
const Producto = require('../models/Producto');

class VentaRepository {
  async crearVentaConDetalles(datosVenta, detalles) {
    const transaction = await sequelize.transaction();
    
    try {
      const venta = await Venta.create(datosVenta, { transaction });
      
      for (const detalle of detalles) {
        await VentaDetalle.create({
          ventaId: venta.id,
          productoId: detalle.productoId,
          cantidad: detalle.cantidad,
          precio_unitario: detalle.precio_unitario,
          subtotal: detalle.subtotal
        }, { transaction });
        
        const producto = await Producto.findByPk(detalle.productoId, { transaction });
        if (!producto) {
          throw new Error(`Producto ${detalle.productoId} no encontrado`);
        }
        
        if (producto.stock < detalle.cantidad) {
          throw new Error(`Stock insuficiente para producto ${producto.nombre}`);
        }
        
        producto.stock -= detalle.cantidad;
        await producto.save({ transaction });
      }
      
      await transaction.commit();
      return venta;
      
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
  
  async obtenerVentasConDetalles() {
    return await Venta.findAll({
      include: [{
        model: VentaDetalle,
        as: 'detalles'
      }],
      order: [['fecha', 'DESC']]
    });
  }
  
  async obtenerVentaPorId(id) {
    return await Venta.findByPk(id, {
      include: [{
        model: VentaDetalle,
        as: 'detalles'
      }]
    });
  }
}

module.exports = new VentaRepository();