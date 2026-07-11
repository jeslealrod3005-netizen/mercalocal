# Módulo de Autenticación y Gestión de Usuarios (Sprint 1)

## Historias de usuario cubiertas

1. **Como** Gerente General **quiero** iniciar sesión con mi correo y
   contraseña **para** acceder al sistema según los permisos de mi rol.
2. **Como** Gerente General **quiero** registrar nuevos usuarios (encargados
   de sucursal, almacenistas) **para** darles acceso controlado al sistema.
3. **Como** usuario autenticado **quiero** consultar mi perfil **para**
   verificar mis datos y mi rol asignado.

## Endpoints implementados

| Método | Ruta                | Middleware(s)                          | Descripción                              |
|--------|----------------------|------------------------------------------|-------------------------------------------|
| POST   | `/api/auth/registro` | `validarRegistro`                        | Crea un nuevo usuario (password se cifra) |
| POST   | `/api/auth/login`    | `validarLogin`                           | Valida credenciales y devuelve un JWT      |
| GET    | `/api/auth/perfil`   | `verificarToken`                         | Devuelve los datos del usuario autenticado |
| GET    | `/api/usuarios`      | `verificarToken`, `permitirRoles(gerente)` | Lista todos los usuarios (solo gerente)  |
| GET    | `/api/usuarios/:id`  | `verificarToken`, `permitirRoles(gerente)` | Consulta un usuario                      |
| PUT    | `/api/usuarios/:id`  | `verificarToken`, `permitirRoles(gerente)` | Actualiza datos de un usuario             |
| DELETE | `/api/usuarios/:id`  | `verificarToken`, `permitirRoles(gerente)` | Desactiva (soft delete) un usuario        |

## Patrones de diseño aplicados (ver Producto 1, sección 7)

- **MVC:** Modelo (Sequelize) → Controller (`auth.controller.js`,
  `usuario.controller.js`) → Vista (SPA Vue 3).
- **Repository:** `usuario.repository.js` encapsula todo el acceso a datos.
- **Singleton:** `config/database.js` expone una única instancia de
  Sequelize / pool de conexiones a MySQL.
- **Middleware (Chain of Responsibility):** validación → autenticación →
  autorización → controlador → manejo de errores.

## Cómo probar el módulo manualmente (Postman / curl)

```bash
# 1. Registrar un usuario gerente
curl -X POST http://localhost:4000/api/auth/registro \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Amy Salazar","email":"amy@mercalocal.com","password":"claveSegura123","rol":"gerente"}'

# 2. Iniciar sesión
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"amy@mercalocal.com","password":"claveSegura123"}'

# 3. Consultar perfil (reemplazar <TOKEN> con el token recibido en el login)
curl http://localhost:4000/api/auth/perfil \
  -H "Authorization: Bearer <TOKEN>"
```

## Pruebas automatizadas

```bash
cd backend
npx jest --runInBand
```

Resultado esperado:

```
PASS tests/validation.middleware.test.js
  validarLogin
    ✓ responde 400 si falta el email
    ✓ llama a next() si email y password están presentes
  validarRegistro
    ✓ acumula errores cuando el password es corto y el email inválido
    ✓ permite continuar con datos válidos

Test Suites: 1 passed, 1 total
Tests:       4 passed, 4 total
```
