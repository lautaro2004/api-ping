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

    // Realiza una consulta para verificar si el usuario ya está registrado
    const [rows, fields] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);

    if (rows.length > 0) {
      return res.status(400).json({ message: "El usuario ya está registrado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Asigna la foto de perfil por defecto
    const defaultProfilePhoto = "/profiles_pictures/default.png";

    // Realiza la inserción de un nuevo usuario
    const insertResult = await db.execute(
      "INSERT INTO users (username, email, password, profile_photo) VALUES (?, ?, ?, ?)",
      [username, email, hashedPassword, defaultProfilePhoto]
    );

    res.status(200).json({ message: "Usuario registrado exitosamente" });
  } catch (error) {
    console.error("Error al registrar el usuario: " + error.stack);
    res.status(500).json({ message: "Error al registrar el usuario" });
  }
});

module.exports = router;





