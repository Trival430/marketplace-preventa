describe("Prueba Login", () => {
  test("Correo válido", () => {
    const email = "admin@test.com";

    expect(email).toContain("@");
  });
});