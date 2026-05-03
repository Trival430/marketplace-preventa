const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

const SECRET = "mi_secreto";

/* =========================
        REGISTRO
========================= */
router.post("/register", async (req, res) => {
  try {
    let { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ msg: "Todos los campos son obligatorios" });
    }

    email = email.toLowerCase().trim();

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ msg: "Usuario ya existe" });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = new User({
      nombre,
      email,
      password: hash,
    });

    await user.save();

    res.json({ msg: "Usuario registrado correctamente 🚀" });

  } catch (error) {
    res.status(500).json({ msg: "Error en registro", error: error.message });
  }
});

/* =========================
          LOGIN
========================= */
router.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Email y password son obligatorios" });
    }

    email = email.toLowerCase().trim();

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "Usuario no encontrado" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ msg: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        nombre: user.nombre,
        email: user.email
      }
    });

  } catch (error) {
    res.status(500).json({ msg: "Error en login", error: error.message });
  } 
});

module.exports = router;