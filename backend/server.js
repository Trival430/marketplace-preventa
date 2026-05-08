const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Models
const Producto = require("./models/Producto");

// Routes
const authRoutes = require("./routes/auth");

const app = express();

/* ======================
        PUERTO
====================== */
const PORT = 5000;

/* ======================
      MIDDLEWARES
====================== */
app.use(cors());
app.use(express.json());

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
      RUTA BASE
====================== */
app.get("/api", (req, res) => {
  res.send("API funcionando 🚀");
});

/* ======================
      CATÁLOGO PRODUCTOS
====================== */
app.get("/api/productos", async (req, res) => {
  try {
    const {
      nombre,
      minPrecio,
      maxPrecio,
      page = 1,
      limit = 10,
    } = req.query;

    let filtro = {};

    // Buscar por nombre
    if (nombre) {
      filtro.nombre = { $regex: nombre, $options: "i" };
    }

    // Filtrar por precio
    if (minPrecio || maxPrecio) {
      filtro.precio = {};

      if (minPrecio) {
        filtro.precio.$gte = Number(minPrecio);
      }

      if (maxPrecio) {
        filtro.precio.$lte = Number(maxPrecio);
      }
    }

    const productos = await Producto.find(filtro)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Producto.countDocuments(filtro);

    res.json({
      total,
      pagina: Number(page),
      totalPaginas: Math.ceil(total / limit),
      productos,
    });

  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener catálogo",
    });
  }
});

/* ======================
      CREAR PRODUCTO
====================== */
app.post("/api/productos", async (req, res) => {
  try {
    const producto = new Producto(req.body);

    const guardado = await producto.save();

    res.status(201).json(guardado);

  } catch (error) {
    res.status(500).json({
      mensaje: "Error al crear producto",
    });
  }
});

/* ======================
      RESERVAR PRODUCTO
====================== */
app.put("/api/productos/:id/reservar", async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);

    if (!producto) {
      return res.status(404).json({
        mensaje: "Producto no encontrado",
      });
    }

    producto.vendidos += 1;

    const actualizado = await producto.save();

    res.json(actualizado);

  } catch (error) {
    res.status(500).json({
      mensaje: "Error al reservar producto",
    });
  }
});

/* ======================
      ELIMINAR PRODUCTO
====================== */
app.delete("/api/productos/:id", async (req, res) => {
  try {
    await Producto.findByIdAndDelete(req.params.id);

    res.json({
      mensaje: "Producto eliminado",
    });

  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar producto",
    });
  }
});

/* ======================
      ACTUALIZAR PRODUCTO
====================== */
app.put("/api/productos/:id", async (req, res) => {
  try {
    const actualizado = await Producto.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(actualizado);

  } catch (error) {
    res.status(500).json({
      mensaje: "Error al actualizar producto",
    });
  }
});

/* ======================
      SERVIDOR
====================== */
app.listen(PORT, () => {
  console.log(
    `🚀 Servidor activo en http://localhost:${PORT}`
  );
});