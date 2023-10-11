// functions/getUserData.js
const express = require('express');
const router = express.Router();
const db = require('../db'); // Importa tu módulo de base de datos

router.get('/', (req, res) => {
  const user_id = req.query.user_id;

  if (!user_id) {
    return res.status(400).json({ message: 'User ID is required.' });
  }

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


