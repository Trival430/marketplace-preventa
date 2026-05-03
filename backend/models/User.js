const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  nombre: String,
  email: String,
  password: String
});

// 👇 ESTA LÍNEA ES LA CLAVE
module.exports = mongoose.model("User", userSchema);