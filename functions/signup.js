const express = require("express");
const db = require("../db.js");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.post("/", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const results = await db.promise().query("SELECT * FROM users WHERE email = ?", [email]);

    if (results[0].length > 0) {
      return res.status(400).json({ message: "El usuario ya está registrado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Asignar la foto de perfil por defecto
    const defaultProfilePhoto = "/profiles_pictures/default.png";

    await db.promise().query("INSERT INTO users (username, email, password, profile_photo) VALUES (?, ?, ?, ?)", [username, email, hashedPassword, defaultProfilePhoto]);

    res.status(200).json({ message: "Usuario registrado exitosamente" });
  } catch (error) {
    console.error("Error al registrar el usuario: " + error.stack);
    res.status(500).json({ message: "Error al registrar el usuario" });
  }
});

module.exports = router;




