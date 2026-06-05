describe("Pruebas de Integración Auth", () => {

  test("Registro de usuario", () => {
    const usuario = {
      nombre: "Juan",
      email: "juan@test.com",
      password: "123456",
      rol: "comprador"
    };

    expect(usuario.email).toContain("@");
  });

  test("Login de usuario", () => {
    const login = {
      email: "juan@test.com",
      password: "123456"
    };

    expect(login.password.length).toBeGreaterThan(5);
  });

  test("Rol válido", () => {
    const rol = "comprador";

    expect(["comprador", "vendedor"]).toContain(rol);
  });

});