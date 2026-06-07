require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Models
const Producto = require("./models/Producto");

// Routes
const authRoutes = require("./routes/auth");

// Swagger
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const app = express();

/* ======================
        PUERTO (RENDER FIX)
====================== */
const PORT = process.env.PORT || 5000;

/* ======================
      MIDDLEWARES
====================== */
app.use(cors());
app.use(express.json());

/* ======================
      SWAGGER CONFIG
====================== */
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Marketplace Preventa API",
      version: "1.0.0",
      description: "Documentación API del Marketplace Preventa",
    },
  },
  apis: ["./server.js"],
};

const specs = swaggerJsdoc(options);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

/* ======================
      RUTA BASE (FIX ERROR /)
====================== */
app.get("/", (req, res) => {
  res.json({
    message: "API Marketplace Preventa funcionando 🚀",
  });
});

/* ======================
      RUTAS AUTH
====================== */
app.use("/api/auth", authRoutes);

/* ======================
      MONGODB
====================== */
const URI = process.env.MONGODB_URI;

mongoose
  .connect(URI)
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch((error) =>
    console.error("❌ Error de conexión:", error.message)
  );

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

    if (nombre) {
      filtro.nombre = { $regex: nombre, $options: "i" };
    }

    if (minPrecio || maxPrecio) {
      filtro.precio = {};

      if (minPrecio) filtro.precio.$gte = Number(minPrecio);
      if (maxPrecio) filtro.precio.$lte = Number(maxPrecio);
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
      SERVIDOR
====================== */
app.listen(PORT, () => {
  console.log(`🚀 Servidor activo en puerto ${PORT}`);
});