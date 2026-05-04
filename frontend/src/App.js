import { useEffect, useState } from "react";

function App() {
  const [productos, setProductos] = useState([]);
  const [isAuth, setIsAuth] = useState(false);
  const [rol, setRol] = useState("");

  const [showLogin, setShowLogin] = useState(true);
  const [showRegister, setShowRegister] = useState(false);

  const [login, setLogin] = useState({
    email: "",
    password: ""
  });

  const [register, setRegister] = useState({
    nombre: "",
    email: "",
    password: "",
    rol: "comprador"
  });

  const [form, setForm] = useState({
    nombre: "",
    precio: "",
    meta: "",
    categoria: "",
    imagen: ""
  });

  const API = "http://localhost:3000/api/productos";
  const AUTH_API = "http://localhost:3000/api/auth";

  /* ================= PRODUCTOS ================= */

  const cargarProductos = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();
      setProductos(data.productos || []);
    } catch (err) {
      console.log(err);
    }
  };

  const crearProducto = async () => {
    try {
      await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: form.nombre,
          precio: Number(form.precio),
          meta: Number(form.meta),
          categoria: form.categoria,
          imagen: form.imagen
        })
      });

      setForm({
        nombre: "",
        precio: "",
        meta: "",
        categoria: "",
        imagen: ""
      });

      cargarProductos();
    } catch (err) {
      console.log(err);
    }
  };

  const reservarProducto = async (id) => {
    try {
      await fetch(`${API}/${id}/reservar`, {
        method: "PUT"
      });

      cargarProductos();
    } catch (err) {
      console.log(err);
    }
  };

  /* ================= LOGIN ================= */

  const loginUser = async () => {
    const res = await fetch(`${AUTH_API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(login)
    });

    const data = await res.json();

    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("rol", data.user?.rol || "comprador");

      setRol(data.user?.rol || "comprador");
      setIsAuth(true);

      setShowLogin(false);

      cargarProductos();
    } else {
      alert(data.msg || "Error login");
    }
  };

  /* ================= REGISTER ================= */

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

  /* ================= LOGOUT ================= */

  const logout = () => {
    localStorage.clear();
    setIsAuth(false);
    setRol("");
    setProductos([]);
    setShowLogin(true);
  };

  /* ================= INIT ================= */

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedRol = localStorage.getItem("rol");

    if (token && savedRol) {
      setRol(savedRol);
      setIsAuth(true);
      setShowLogin(false);

      cargarProductos();
    }
  }, []);

  /* ================= LOGIN SCREEN ================= */

  if (!isAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-500">

        {showLogin && (
          <div className="bg-white p-8 rounded w-96">
            <h2 className="text-xl font-bold mb-4">Login</h2>

            <input
              placeholder="Email"
              className="w-full mb-2 p-2 border"
              onChange={(e) =>
                setLogin({ ...login, email: e.target.value })
              }
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full mb-2 p-2 border"
              onChange={(e) =>
                setLogin({ ...login, password: e.target.value })
              }
            />

            <button
              onClick={loginUser}
              className="w-full bg-blue-600 text-white p-2"
            >
              Entrar
            </button>

            <button
              onClick={() => {
                setShowLogin(false);
                setShowRegister(true);
              }}
              className="text-sm mt-2"
            >
              Crear cuenta
            </button>
          </div>
        )}

        {showRegister && (
          <div className="bg-white p-8 rounded w-96">

            <h2 className="text-xl font-bold mb-4">Registro</h2>

            <input
              placeholder="Nombre"
              className="w-full mb-2 p-2 border"
              onChange={(e) =>
                setRegister({ ...register, nombre: e.target.value })
              }
            />

            <input
              placeholder="Email"
              className="w-full mb-2 p-2 border"
              onChange={(e) =>
                setRegister({ ...register, email: e.target.value })
              }
            />

            <input
              type="password"
              className="w-full mb-2 p-2 border"
              onChange={(e) =>
                setRegister({ ...register, password: e.target.value })
              }
            />

            <select
              className="w-full mb-2 p-2 border"
              value={register.rol}
              onChange={(e) =>
                setRegister({ ...register, rol: e.target.value })
              }
            >
              <option value="comprador">Comprador 🛒</option>
              <option value="vendedor">Vendedor 💼</option>
            </select>

            <button
              onClick={registerUser}
              className="w-full bg-green-600 text-white p-2"
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
    <div className="p-6">

      {/* HEADER */}
      <div className="flex justify-between mb-6">

        <h1 className="text-2xl font-bold">Marketplace 🛒</h1>

        <div className="flex gap-3 items-center">

          <span className="bg-gray-200 px-3 py-1 rounded">
            Rol: {rol}
          </span>

          <button
            onClick={logout}
            className="bg-red-500 text-white px-3 py-1"
          >
            Salir
          </button>

        </div>
      </div>

      {/* 🔥 FORM SOLO VENDEDORES */}
      {rol === "vendedor" && (
        <div className="max-w-md mx-auto bg-white p-4 rounded shadow mb-6">

          <h2 className="font-bold mb-3">Crear producto</h2>

          <input
            placeholder="Nombre"
            className="w-full mb-2 p-2 border"
            onChange={(e) =>
              setForm({ ...form, nombre: e.target.value })
            }
          />

          <input
            placeholder="Precio"
            className="w-full mb-2 p-2 border"
            onChange={(e) =>
              setForm({ ...form, precio: e.target.value })
            }
          />

          <input
            placeholder="Meta"
            className="w-full mb-2 p-2 border"
            onChange={(e) =>
              setForm({ ...form, meta: e.target.value })
            }
          />

          <select
            className="w-full mb-2 p-2 border"
            onChange={(e) =>
              setForm({ ...form, categoria: e.target.value })
            }
          >
            <option value="">Categoría</option>
            <option value="tecnologia">Tecnología</option>
            <option value="ropa">Ropa</option>
            <option value="hogar">Hogar</option>
          </select>

          <input
            placeholder="Imagen URL"
            className="w-full mb-2 p-2 border"
            onChange={(e) =>
              setForm({ ...form, imagen: e.target.value })
            }
          />

          <button
            onClick={crearProducto}
            className="w-full bg-black text-white p-2 rounded"
          >
            Crear producto
          </button>

        </div>
      )}

      {/* PRODUCTOS */}
      <div className="grid grid-cols-3 gap-4">

        {productos.map((p) => {

          const vendidos = p.vendidos || 0;
          const meta = p.meta || 1;
          const porcentaje = Math.min((vendidos / meta) * 100, 100);
          const agotado = vendidos >= meta;

          return (
            <div key={p._id} className="border p-3 rounded bg-white shadow">

              <h3 className="font-bold">{p.nombre}</h3>
              <p>Precio: {p.precio}</p>
              <p className="text-gray-500 text-sm">{p.categoria}</p>

              {/* BARRA */}
              <div className="w-full bg-gray-200 h-3 rounded mt-3 overflow-hidden">
                <div
                  className="bg-green-500 h-3 rounded transition-all duration-700"
                  style={{ width: `${porcentaje}%` }}
                />
              </div>

              <p className="text-xs mt-1">
                {vendidos} / {meta} vendidos
              </p>

              {/* BOTÓN */}
              <button
                onClick={() => reservarProducto(p._id)}
                disabled={agotado}
                className={`w-full mt-2 p-2 text-white rounded ${
                  agotado ? "bg-gray-400" : "bg-blue-500"
                }`}
              >
                {agotado ? "Agotado" : "Reservar"}
              </button>

            </div>
          );
        })}

      </div>

    </div>
  );
}

export default App;