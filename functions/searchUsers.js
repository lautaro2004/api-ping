const express = require('express');
const router = express.Router();
const db = require("../db.js");

// Ruta para buscar usuarios
router.get('/', async (req, res) => {
  const query = req.query.query;

  if (!query) {
    return res.status(400).json({ message: 'Query parameter "query" is required.' });
  }

  try {
    // Realizar la búsqueda de usuarios en la base de datos (ajusta esto según tu esquema)
    const searchQuery = `%${query}%`;
    const sql = 'SELECT user_id, username, profile_photo FROM users WHERE username LIKE ?';

    // Conectar a la base de datos y ejecutar la consulta
    const [results, fields] = await db.execute(sql, [searchQuery]);

    console.log('Búsqueda de usuarios realizada exitosamente');
    res.status(200).json(results);
  } catch (error) {
    console.error('Error al realizar la búsqueda de usuarios:', error);
    res.status(500).json({ message: 'Error al realizar la búsqueda de usuarios' });
  }
});

module.exports = router;
