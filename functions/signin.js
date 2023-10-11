const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const db = require('../db.js');
const router = express.Router();

// Generar una clave secreta para JWT
const secretKey = uuidv4();
console.log('JWT_SECRET:', secretKey);
// Asegúrate de configurar la misma clave en tu variable de entorno "JWT_SECRET"

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

    // Crear un objeto que contenga los datos del usuario
    const userData = {
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
    };

    // Generar el token de autenticación que incluye los datos del usuario
    const token = jwt.sign(
      {
        userId: user.user_id, // Asegúrate de usar el campo correcto para el ID del usuario
        sessionId,
        userData, // Incluye los datos del usuario en el token
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




  

