# MercaLocal — Sistema Web de Gestión de Ventas, Inventario y Proveedores

Proyecto académico desarrollado para la Universidad Tecnológica de Puebla,
materia de **Desarrollo Web Integral**.

Cadena de tiendas de abarrotes (3 sucursales) que requiere digitalizar sus
procesos de ventas, inventario y proveedores actualmente realizados de forma
manual (ver `Producto 1 — Caso de estudio y arquitectura`).

## Equipo

| Rol Scrum      | Integrante                          |
|----------------|--------------------------------------|
| Product Owner  | Amy Salazar Castillo                 |
| Scrum Master   | Andrea Arely Calderón González       |
| Developer      | Jeshua Abraham Rodríguez Leal         |

## Arquitectura

Cliente-Servidor con Backend Monolítico Modular. Ver `Producto 1` para el
detalle completo de la arquitectura, patrones de diseño y justificación
tecnológica.

- **Frontend:** Vue.js 3 + Vite + Axios + Vue Router
- **Backend:** Node.js + Express.js
- **ORM:** Sequelize
- **Base de datos:** MySQL 8.0
- **Autenticación:** JWT + bcrypt
- **Almacenamiento de imágenes:** Cloudinary (módulos futuros)

## Estructura del repositorio

```
mercalocal/
├── backend/          # API REST (Express + Sequelize)
├── frontend/         # SPA (Vue 3 + Vite)
├── docs/             # Documentación adicional del proyecto
└── README.md
```

## Estado actual (Sprint 1)

- [x] Configuración de entorno y arquitectura (Sprint 0)
- [x] Módulo de autenticación y gestión de usuarios (Sprint 1)
- [ ] Módulo de inventario (Sprint 2)
- [ ] Módulo de ventas (Sprint 3)
- [ ] Dashboard gerencial y órdenes de compra (Sprint 4)

## Flujo de trabajo Git

Este repositorio sigue un flujo simplificado tipo *Git Flow*:

- `main`: versión estable, lista para entrega/demo.
- `develop`: integración de features ya probadas.
- `feature/*`: una rama por historia de usuario / módulo, se fusiona a
  `develop` mediante Pull Request tras revisión de código (Code Review),
  conforme a la Definition of Done establecida en el Producto 1.

Ver `docs/PRODUCTO_2_control_de_versiones.md` para la justificación completa
de la herramienta de versionamiento y la documentación de comandos.

## Cómo levantar el proyecto localmente

### Backend

```bash
cd backend
npm install
cp .env.example .env   # configurar credenciales de MySQL y JWT_SECRET
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```
