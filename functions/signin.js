const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const db = require('../db.js');
const router = express.Router();
require('dotenv').config();


// Generar una clave secreta para JWT
const secretKey = process.env.JWT_SECRET; // Usa la clave secreta de tu entorno en Railway

router.post('/', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Verificar si el usuario existe en la base de datos
    const [results, fields] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
    const user = results[0];

    if (!user) {
      res.status(401).json({ message: 'Credenciales inválidas' });
      return;
    }

    // Verificar la contraseña ingresada con la almacenada en la base de datos
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(401).json({ message: 'Credenciales inválidas' });
      return;
    }

    // La contraseña es válida, el inicio de sesión es exitoso
    // Generar un identificador único para el token de sesión
    const sessionId = uuidv4();

    // Generar el token de autenticación
    const token = jwt.sign(
      {
        userId: user.user_id, // Asegúrate de usar el campo correcto para el ID del usuario
        sessionId,
      },
      secretKey, // Utiliza la clave secreta definida
      { expiresIn: '178h' } // Establece la expiración del token (ejemplo: 1 hora)
    );

    // Enviar el token y el sessionId al cliente
    res
      .status(200)
      .cookie('token', token, { httpOnly: true, secure: true })
      .cookie('sessionId', sessionId, { httpOnly: true, secure: true })
      .json({ message: 'Inicio de sesión exitoso', token, user_id: user.user_id });
  } catch (error) {
    console.error('Error al iniciar sesión: ' + error.stack);
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
});

module.exports = router;



  

