const express = require('express');
const router = express.Router();
const db = require('../db'); // Reemplaza con la forma en que te conectas a tu base de datos
require('dotenv').config();

router.get('/get-user-data', (req, res) => {
  const user_id = req.query.user_id; // Obtén user_id de la solicitud

  if (!user_id) {
    return res.status(400).json({ message: 'User ID is required.' });
  }

  // Realiza una consulta a tu base de datos para obtener los datos del usuario
  const sql = 'SELECT user_id, username, first_name, last_name FROM users WHERE user_id = ?';

  db.query(sql, [user_id], (error, results) => {
    if (error) {
      console.error('Error al obtener los datos del usuario:', error);
      return res.status(500).json({ message: 'Error al obtener los datos del usuario' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    const userData = results[0];
    return res.status(200).json(userData);
  });
});

module.exports = router;
