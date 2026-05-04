const mongoose = require("mongoose");

const productoSchema = new mongoose.Schema({
  nombre: String,
  precio: Number,
  meta: Number,
  vendidos: {
    type: Number,
    default: 0
  },
  categoria: {
    type: String,
    default: "General"
  },
  imagen: {
    type: String,
    default: ""
  }
});

module.exports = mongoose.model("Producto", productoSchema);