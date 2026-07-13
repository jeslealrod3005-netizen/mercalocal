const productoRepository = require("../repositories/producto.repository");

/**
 * Controlador de Inventario: ALTA, BAJA y CONSULTA de productos.
 * Sigue el mismo patrón MVC que auth.controller.js / usuario.controller.js.
 */

// ---- ALTA ----
async function crear(req, res, next) {
  try {
    const { nombre, categoria, precio, stock, stockMinimo, sucursalId } = req.body;

    if (!nombre || nombre.trim().length < 2) {
      return res.status(400).json({ ok: false, mensaje: "El nombre del producto es obligatorio." });
    }

    const producto = await productoRepository.crear({
      nombre,
      categoria,
      precio,
      stock,
      stockMinimo,
      sucursalId,
    });

    return res.status(201).json({ ok: true, mensaje: "Producto dado de alta.", producto });
  } catch (error) {
    next(error);
  }
}

// ---- CONSULTA (listado, con búsqueda opcional ?q=... y ?sucursalId=...) ----
async function listar(req, res, next) {
  try {
    const { q, sucursalId } = req.query;
    const productos = await productoRepository.listar({ q, sucursalId });

    const productosConAlerta = productos.map((p) => ({
      ...p.toJSON(),
      stockBajo: p.stock <= p.stockMinimo,
    }));

    return res.json({ ok: true, productos: productosConAlerta });
  } catch (error) {
    next(error);
  }
}

// ---- CONSULTA (uno solo) ----
async function obtenerUno(req, res, next) {
  try {
    const producto = await productoRepository.buscarPorId(req.params.id);
    if (!producto) {
      return res.status(404).json({ ok: false, mensaje: "Producto no encontrado." });
    }
    return res.json({ ok: true, producto });
  } catch (error) {
    next(error);
  }
}

// ---- ACTUALIZAR (editar datos / mover stock) ----
async function actualizar(req, res, next) {
  try {
    const producto = await productoRepository.actualizar(req.params.id, req.body);
    if (!producto) {
      return res.status(404).json({ ok: false, mensaje: "Producto no encontrado." });
    }
    return res.json({ ok: true, mensaje: "Producto actualizado.", producto });
  } catch (error) {
    next(error);
  }
}

// ---- BAJA (baja lógica, no se borra físicamente) ----
async function darDeBaja(req, res, next) {
  try {
    const producto = await productoRepository.darDeBaja(req.params.id);
    if (!producto) {
      return res.status(404).json({ ok: false, mensaje: "Producto no encontrado." });
    }
    return res.json({ ok: true, mensaje: "Producto dado de baja." });
  } catch (error) {
    next(error);
  }
}

module.exports = { crear, listar, obtenerUno, actualizar, darDeBaja };
