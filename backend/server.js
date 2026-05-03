const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Models
const Producto = require("./models/Producto");

// Routes
const authRoutes = require("./routes/auth");

const app = express();
const PORT = 3000;

/* ======================
      MIDDLEWARES
====================== */
app.use(cors());
app.use(express.json()); // 👈 OBLIGATORIO para login

/* ======================
      RUTAS AUTH
====================== */
app.use("/api/auth", authRoutes);

/* ======================
      MONGODB
====================== */
const URI =
  "mongodb+srv://admin:Admin123@cluster2.edeki7g.mongodb.net/marketplace?retryWrites=true&w=majority";

mongoose
  .connect(URI)
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch((error) =>
    console.error("❌ Error de conexión:", error.message)
  );

/* ======================
      RUTAS API
====================== */

// Ruta base
app.get("/api", (req, res) => {
  res.send("API funcionando 🚀");
});

/* ======================
      PRODUCTOS
====================== */

// Obtener productos
app.get("/api/productos", async (req, res) => {
  try {
    const productos = await Producto.find();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener productos" });
  }
});

// Crear producto
app.post("/api/productos", async (req, res) => {
  try {
    const producto = new Producto(req.body);
    const guardado = await producto.save();
    res.status(201).json(guardado);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear producto" });
  }
});

// Reservar producto
app.put("/api/productos/:id/reservar", async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);

    if (!producto) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    producto.vendidos += 1;
    const actualizado = await producto.save();

    res.json(actualizado);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al reservar producto" });
  }
});

/* ======================
      SERVIDOR
====================== */
app.listen(PORT, () => {
  console.log(`🚀 Servidor activo en http://localhost:${PORT}`);
});
