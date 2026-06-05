describe("Prueba Producto", () => {
  test("Producto tiene nombre", () => {
    const producto = {
      nombre: "Laptop"
    };

    expect(producto.nombre).toBe("Laptop");
  });
});