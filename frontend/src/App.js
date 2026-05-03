import { useEffect, useState } from "react";

function App() {
  const [productos, setProductos] = useState([]);

  const [isAuth, setIsAuth] = useState(false);

  const [showLogin, setShowLogin] = useState(true);
  const [showRegister, setShowRegister] = useState(false);

  const [login, setLogin] = useState({
    email: "",
    password: ""
  });

  const [register, setRegister] = useState({
    nombre: "",
    email: "",
    password: ""
  });

  const [form, setForm] = useState({
    nombre: "",
    precio: "",
    meta: ""
  });

  const API = "http://localhost:3000/api/productos";
  const AUTH_API = "http://localhost:3000/api/auth";

  /* ================= PRODUCTOS ================= */

  const cargarProductos = async () => {
    const res = await fetch(API);
    const data = await res.json();
    setProductos(data);
  };

  const crearProducto = async () => {
    const token = localStorage.getItem("token");

    await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      },
      body: JSON.stringify(form)
    });

    setForm({ nombre: "", precio: "", meta: "" });
    cargarProductos();
  };

  const reservarProducto = async (id) => {
    await fetch(`${API}/${id}/reservar`, { method: "PUT" });
    cargarProductos();
  };

  /* ================= AUTH ================= */

  const loginUser = async () => {
    const res = await fetch(`${AUTH_API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(login)
    });

    const data = await res.json();

    if (data.token) {
      localStorage.setItem("token", data.token);
      setIsAuth(true);
      setShowLogin(false);
    } else {
      alert(data.msg || "Error login");
    }
  };

  const registerUser = async () => {
    await fetch(`${AUTH_API}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(register)
    });

    alert("Usuario registrado 🚀");
    setShowRegister(false);
    setShowLogin(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuth(false);
    setShowLogin(true);
  };

  /* ================= INIT ================= */

  useEffect(() => {
    cargarProductos();

    localStorage.removeItem("token"); // 🔥 fuerza login siempre

    setIsAuth(false);
    setShowLogin(true);
  }, []);

  /* ================= LOGIN SCREEN ================= */

  if (!isAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">

        {showLogin && (
          <div className="bg-white p-6 rounded-xl w-96 shadow">

            <h2 className="text-xl font-bold mb-4 text-center">
              🔐 Login
            </h2>

            <input
              placeholder="Email"
              className="w-full mb-2 p-2 border rounded"
              onChange={(e) =>
                setLogin({ ...login, email: e.target.value })
              }
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full mb-3 p-2 border rounded"
              onChange={(e) =>
                setLogin({ ...login, password: e.target.value })
              }
            />

            <button
              onClick={loginUser}
              className="w-full bg-blue-500 text-white p-2 rounded"
            >
              Iniciar sesión
            </button>

            <button
              onClick={() => {
                setShowLogin(false);
                setShowRegister(true);
              }}
              className="w-full mt-2 text-sm text-gray-500"
            >
              ¿No tienes cuenta? Regístrate
            </button>

          </div>
        )}

        {showRegister && (
          <div className="bg-white p-6 rounded-xl w-96 shadow">

            <h2 className="text-xl font-bold mb-4 text-center">
              Registro
            </h2>

            <input
              placeholder="Nombre"
              className="w-full mb-2 p-2 border rounded"
              onChange={(e) =>
                setRegister({ ...register, nombre: e.target.value })
              }
            />

            <input
              placeholder="Email"
              className="w-full mb-2 p-2 border rounded"
              onChange={(e) =>
                setRegister({ ...register, email: e.target.value })
              }
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full mb-3 p-2 border rounded"
              onChange={(e) =>
                setRegister({ ...register, password: e.target.value })
              }
            />

            <button
              onClick={registerUser}
              className="w-full bg-green-500 text-white p-2 rounded"
            >
              Registrarse
            </button>

          </div>
        )}

      </div>
    );
  }

  /* ================= APP ================= */

  return (
    <div className="min-h-screen bg-slate-100 p-6">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Marketplace Preventa 🛒
        </h1>

        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* CREAR PRODUCTO */}
      <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow mb-10">

        <input
          placeholder="Nombre"
          value={form.nombre}
          onChange={(e) =>
            setForm({ ...form, nombre: e.target.value })
          }
          className="w-full mb-2 p-2 border rounded"
        />

        <input
          placeholder="Precio"
          value={form.precio}
          onChange={(e) =>
            setForm({ ...form, precio: e.target.value })
          }
          className="w-full mb-2 p-2 border rounded"
        />

        <input
          placeholder="Meta"
          value={form.meta}
          onChange={(e) =>
            setForm({ ...form, meta: e.target.value })
          }
          className="w-full mb-3 p-2 border rounded"
        />

        <button
          onClick={crearProducto}
          className="w-full bg-black text-white p-2 rounded"
        >
          Crear producto
        </button>
      </div>

      {/* PRODUCTOS */}
      <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">

        {productos.map((p) => {
          const porcentaje = (p.vendidos / p.meta) * 100;
          const metaAlcanzada = p.vendidos >= p.meta;

          return (
            <div key={p._id} className="bg-white p-6 rounded-xl shadow">

              <h3 className="text-xl font-bold">{p.nombre}</h3>

              <p>💰 ${p.precio}</p>
              <p>🎯 Meta: {p.meta}</p>
              <p>📦 Vendidos: {p.vendidos}</p>

              <div className="w-full bg-gray-200 h-3 rounded mt-3">
                <div
                  className="bg-green-500 h-3"
                  style={{ width: `${porcentaje}%` }}
                />
              </div>

              <button
                onClick={() => reservarProducto(p._id)}
                disabled={metaAlcanzada}
                className={`mt-3 w-full p-2 rounded text-white ${
                  metaAlcanzada ? "bg-gray-400" : "bg-blue-500"
                }`}
              >
                {metaAlcanzada ? "Meta alcanzada 🎉" : "Reservar"}
              </button>

            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;