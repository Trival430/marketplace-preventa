describe("Prueba Usuario", () => {
  test("Debe crear un usuario válido", () => {
    const usuario = {
      nombre: "Juan",
      email: "juan@test.com"
    };

    expect(usuario.nombre).toBe("Juan");
  });
});