import { useEffect, useState } from "react";

function App() {

  /* ================= STATES ================= */

  const [productos, setProductos] = useState([]);
  const [isAuth, setIsAuth] = useState(false);
  const [rol, setRol] = useState("");

  const [showLogin, setShowLogin] = useState(true);
  const [showRegister, setShowRegister] = useState(false);

  const [busqueda, setBusqueda] = useState("");

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

  /* ================= API ================= */

  const API = "http://localhost:5000/api/productos";
  const AUTH_API = "http://localhost:5000/api/auth";

  /* ================= PRODUCTOS ================= */

  const cargarProductos = async () => {
    try {

      const res = await fetch(API);
      const data = await res.json();

      setProductos(data.productos || []);

    } catch (error) {
      console.log(error);
    }
  };

  const crearProducto = async () => {
    try {

      await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
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

    } catch (error) {
      console.log(error);
    }
  };

  const reservarProducto = async (id) => {
    try {

      await fetch(`${API}/${id}/reservar`, {
        method: "PUT"
      });

      cargarProductos();

    } catch (error) {
      console.log(error);
    }
  };

  const eliminarProducto = async (id) => {

    const confirmar = window.confirm(
      "¿Eliminar este producto?"
    );

    if (!confirmar) return;

    try {

      await fetch(`${API}/${id}`, {
        method: "DELETE"
      });

      cargarProductos();

    } catch (error) {
      console.log(error);
    }
  };

  /* ================= LOGIN ================= */

  const loginUser = async () => {

    try {

      const res = await fetch(`${AUTH_API}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(login)
      });

      const data = await res.json();

      if (data.token) {

        localStorage.setItem("token", data.token);
        localStorage.setItem(
          "rol",
          data.user?.rol || "comprador"
        );

        setRol(data.user?.rol || "comprador");

        setIsAuth(true);

        setShowLogin(false);

        cargarProductos();

      } else {

        alert(data.msg || "Error login");

      }

    } catch (error) {

      console.log(error);

    }
  };

  /* ================= REGISTER ================= */

  const registerUser = async () => {

    try {

      await fetch(`${AUTH_API}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(register)
      });

      alert("Usuario registrado 🚀");

      setShowRegister(false);
      setShowLogin(true);

    } catch (error) {

      console.log(error);

    }
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-500 to-purple-500">

        {/* LOGIN */}
        {showLogin && (

          <div className="bg-white p-8 rounded-2xl shadow-2xl w-96">

            <h2 className="text-3xl font-bold text-center mb-6 text-pink-600">
              Login
            </h2>

            <input
              type="email"
              placeholder="Email"
              className="w-full mb-3 p-3 border rounded-lg"
              onChange={(e) =>
                setLogin({
                  ...login,
                  email: e.target.value
                })
              }
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full mb-4 p-3 border rounded-lg"
              onChange={(e) =>
                setLogin({
                  ...login,
                  password: e.target.value
                })
              }
            />

            <button
              onClick={loginUser}
              className="w-full bg-pink-600 hover:bg-pink-700 text-white p-3 rounded-lg font-bold"
            >
              Entrar
            </button>

            <button
              onClick={() => {
                setShowLogin(false);
                setShowRegister(true);
              }}
              className="w-full mt-3 text-sm text-pink-600"
            >
              Crear cuenta
            </button>

          </div>
        )}

        {/* REGISTER */}
        {showRegister && (

          <div className="bg-white p-8 rounded-2xl shadow-2xl w-96">

            <h2 className="text-3xl font-bold text-center mb-6 text-green-600">
              Registro
            </h2>

            <input
              placeholder="Nombre"
              className="w-full mb-3 p-3 border rounded-lg"
              onChange={(e) =>
                setRegister({
                  ...register,
                  nombre: e.target.value
                })
              }
            />

            <input
              placeholder="Email"
              className="w-full mb-3 p-3 border rounded-lg"
              onChange={(e) =>
                setRegister({
                  ...register,
                  email: e.target.value
                })
              }
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full mb-3 p-3 border rounded-lg"
              onChange={(e) =>
                setRegister({
                  ...register,
                  password: e.target.value
                })
              }
            />

            <select
              className="w-full mb-4 p-3 border rounded-lg"
              value={register.rol}
              onChange={(e) =>
                setRegister({
                  ...register,
                  rol: e.target.value
                })
              }
            >
              <option value="comprador">
                Comprador 🛒
              </option>

              <option value="vendedor">
                Vendedor 💼
              </option>

            </select>

            <button
              onClick={registerUser}
              className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg font-bold"
            >
              Registrarse
            </button>

            <button
              onClick={() => {
                setShowRegister(false);
                setShowLogin(true);
              }}
              className="w-full mt-3 text-sm text-green-600"
            >
              Volver al login
            </button>

          </div>
        )}

      </div>
    );
  }

  /* ================= APP ================= */

  return (

    <div className="min-h-screen bg-gray-100 p-6">

      {/* HEADER */}
      <div className="flex flex-col items-center mb-8">

        <h1 className="text-5xl font-extrabold text-pink-600 mb-4">
          Marketplace 🛒
        </h1>

        <div className="flex gap-3 items-center">

          <span className="bg-white shadow px-4 py-2 rounded-full">
            Rol: {rol}
          </span>

          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full"
          >
            Salir
          </button>

        </div>

      </div>

      {/* FORM CREAR PRODUCTO */}
      {rol === "vendedor" && (

        <div className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-lg mb-8">

          <h2 className="font-bold text-2xl mb-4 text-center">
            Crear producto
          </h2>

          <input
            placeholder="Nombre"
            value={form.nombre}
            className="w-full mb-3 p-3 border rounded-lg"
            onChange={(e) =>
              setForm({
                ...form,
                nombre: e.target.value
              })
            }
          />

          <input
            placeholder="Precio"
            value={form.precio}
            className="w-full mb-3 p-3 border rounded-lg"
            onChange={(e) =>
              setForm({
                ...form,
                precio: e.target.value
              })
            }
          />

          <input
            placeholder="Meta"
            value={form.meta}
            className="w-full mb-3 p-3 border rounded-lg"
            onChange={(e) =>
              setForm({
                ...form,
                meta: e.target.value
              })
            }
          />

          <select
            className="w-full mb-3 p-3 border rounded-lg"
            onChange={(e) =>
              setForm({
                ...form,
                categoria: e.target.value
              })
            }
          >
            <option value="">Categoría</option>
            <option value="tecnologia">
              Tecnología
            </option>

            <option value="ropa">
              Ropa
            </option>

            <option value="hogar">
              Hogar
            </option>

          </select>

          <input
            placeholder="Imagen URL"
            value={form.imagen}
            className="w-full mb-4 p-3 border rounded-lg"
            onChange={(e) =>
              setForm({
                ...form,
                imagen: e.target.value
              })
            }
          />

          <button
            onClick={crearProducto}
            className="w-full bg-black hover:bg-gray-800 text-white p-3 rounded-lg font-bold"
          >
            Crear producto
          </button>

        </div>
      )}

      {/* BUSCADOR */}
      <div className="max-w-md mx-auto mb-8">

        <input
          type="text"
          placeholder="Buscar por nombre o categoría..."
          value={busqueda}
          onChange={(e) =>
            setBusqueda(e.target.value)
          }
          className="w-full p-4 border rounded-full shadow focus:outline-none focus:ring-2 focus:ring-pink-500"
        />

      </div>

      {/* PRODUCTOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {productos
          .filter((p) =>
            p.nombre?.toLowerCase().includes(
              busqueda.toLowerCase()
            ) ||

            p.categoria?.toLowerCase().includes(
              busqueda.toLowerCase()
            )
          )
          .map((p) => {

            const vendidos = p.vendidos || 0;
            const meta = p.meta || 1;

            const porcentaje = Math.min(
              (vendidos / meta) * 100,
              100
            );

            const agotado = vendidos >= meta;

            return (

              <div
                key={p._id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all"
              >

                {/* IMAGEN */}
                {p.imagen && (

                  <img
                    src={p.imagen}
                    alt={p.nombre}
                    className="w-full h-60 object-cover"
                  />

                )}

                <div className="p-5">

                  {/* NOMBRE */}
                  <h3 className="font-bold text-2xl mb-1">
                    {p.nombre}
                  </h3>

                  {/* PRECIO */}
                  <p className="text-pink-600 text-2xl font-bold">
                    $
                    {Number(p.precio).toLocaleString("es-CO")}
                  </p>

                  {/* CATEGORIA */}
                  <p className="text-gray-500 capitalize">
                    {p.categoria}
                  </p>

                  {/* BARRA */}
                  <div className="w-full bg-gray-200 h-3 rounded-full mt-4 overflow-hidden">

                    <div
                      className="bg-green-500 h-3 rounded-full transition-all duration-700"
                      style={{
                        width: `${porcentaje}%`
                      }}
                    />

                  </div>

                  {/* VENDIDOS */}
                  <p className="text-sm mt-2 text-gray-600">

                    {Number(vendidos).toLocaleString("es-CO")} /{" "}
                    {Number(meta).toLocaleString("es-CO")} vendidos

                  </p>

                  {/* BOTON RESERVAR */}
                  <button
                    onClick={() =>
                      reservarProducto(p._id)
                    }
                    disabled={agotado}
                    className={`w-full mt-4 p-3 rounded-full text-white font-bold transition-all ${
                      agotado
                        ? "bg-gray-400"
                        : "bg-pink-600 hover:bg-pink-700"
                    }`}
                  >
                    {agotado
                      ? "Agotado"
                      : "Reservar"}
                  </button>

                 {/* BOTON ELIMINAR */}
{rol === "vendedor" && (
  <button
    onClick={() => eliminarProducto(p._id)}
    className="w-full mt-2 p-3 bg-red-500 hover:bg-red-600 text-white rounded-full font-bold transition-all"
  >
    Eliminar producto
  </button>
)}

                </div>

              </div>
            );
          })}

      </div>

    </div>
  );
}

export default App;