const { validarLogin, validarRegistro } = require("../src/middlewares/validation.middleware");

/**
 * Pruebas unitarias del middleware de validación de entrada.
 * Forman parte de la Definition of Done establecida en el Producto 1:
 * "Las pruebas unitarias e integración pasan sin errores."
 */
function crearMockRes() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
}

describe("validarLogin", () => {
  test("responde 400 si falta el email", () => {
    const req = { body: { password: "12345678" } };
    const res = crearMockRes();
    const next = jest.fn();

    validarLogin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
  });

  test("llama a next() si email y password están presentes", () => {
    const req = { body: { email: "a@a.com", password: "12345678" } };
    const res = crearMockRes();
    const next = jest.fn();

    validarLogin(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });
});

describe("validarRegistro", () => {
  test("acumula errores cuando el password es corto y el email inválido", () => {
    const req = {
      body: { nombre: "Jeshua", email: "correo-invalido", password: "123" },
    };
    const res = crearMockRes();
    const next = jest.fn();

    validarRegistro(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    const [{ errores }] = res.json.mock.calls[0];
    expect(errores.length).toBeGreaterThanOrEqual(2);
  });

  test("permite continuar con datos válidos", () => {
    const req = {
      body: {
        nombre: "Jeshua Rodriguez",
        email: "jeshua@mercalocal.com",
        password: "unaClaveSegura123",
        rol: "almacenista",
      },
    };
    const res = crearMockRes();
    const next = jest.fn();

    validarRegistro(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});
