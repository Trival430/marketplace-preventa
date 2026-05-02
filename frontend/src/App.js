import { useEffect, useState } from "react";

function App() {
  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    precio: "",
    meta: ""
  });

  const API = "http://localhost:3000/api/productos";

  // ================= API =================

  const cargarProductos = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();
      setProductos(data);
    } catch (err) {
      console.error("Error cargando productos", err);
    }
  };

  const crearProducto = async () => {
    try {
      await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      setForm({ nombre: "", precio: "", meta: "" });
      cargarProductos();
    } catch (err) {
      console.error("Error creando producto", err);
    }
  };

  const reservarProducto = async (id) => {
    try {
      await fetch(`${API}/${id}/reservar`, {
        method: "PUT"
      });
      cargarProductos();
    } catch (err) {
      console.error("Error reservando producto", err);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  // ================= UI =================

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Marketplace Preventa 🛒</h1>

      <h2>Crear producto</h2>

      <input
        name="nombre"
        placeholder="Nombre"
        value={form.nombre}
        onChange={handleChange}
      />
      <br />

      <input
        name="precio"
        placeholder="Precio"
        value={form.precio}
        onChange={handleChange}
      />
      <br />

      <input
        name="meta"
        placeholder="Meta"
        value={form.meta}
        onChange={handleChange}
      />
      <br />

      <button onClick={crearProducto}>Crear</button>

      <hr />

      <h2>Productos</h2>

      {productos.map((p) => {
        const porcentaje = (p.vendidos / p.meta) * 100;
        const metaAlcanzada = p.vendidos >= p.meta;

        return (
          <div
            key={p._id}
            style={{
              border: "1px solid #ccc",
              margin: "10px 0",
              padding: "10px"
            }}
          >
            <h3>{p.nombre}</h3>
            <p>Precio: ${p.precio}</p>
            <p>Meta: {p.meta}</p>
            <p>Vendidos: {p.vendidos}</p>

            {/* Barra de progreso */}
            <div style={{ background: "#eee", height: 20 }}>
              <div
                style={{
                  background: "green",
                  width: `${porcentaje}%`,
                  height: "100%"
                }}
              />
            </div>

            <p>{porcentaje.toFixed(0)}%</p>

            <button
              onClick={() => reservarProducto(p._id)}
              disabled={metaAlcanzada}
            >
              {metaAlcanzada ? "Meta alcanzada" : "Reservar"}
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default App;