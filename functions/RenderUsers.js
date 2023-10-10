const express = require('express');
const path = require('path');
const db = require('../db');

const router = express.Router();

// Ruta para obtener la información de un usuario y sus posts por su ID
router.get('/', (req, res) => {
  const userId = req.query.userId; // Obtenemos el userId desde la consulta

  const userSql = `
    SELECT
      user_id,
      username,
      profile_photo,
      bio
    FROM
      users
    WHERE
      user_id = ?`;

  const postsSql = `
    SELECT
      post_id,
      post_text,
      post_img,
      create_att
    FROM
      post
    WHERE
      user_id = ?
    ORDER BY
      create_att DESC`;

  db.query(userSql, [userId], (error, userResults) => {
    if (error) {
      console.error('Error al obtener la información del usuario:', error);
      res.status(500).json({ message: 'Error al obtener la información del usuario' });
    } else {
      if (userResults.length > 0) {
        const user = userResults[0];
        user.profile_photo = `http://192.168.1.112:3000${user.profile_photo}`;

        db.query(postsSql, [userId], (error, postsResults) => {
          if (error) {
            console.error('Error al obtener los posts del usuario:', error);
            res.status(500).json({ message: 'Error al obtener los posts del usuario' });
          } else {
            user.posts = postsResults;
            res.status(200).json(user);
          }
        });
      } else {
        res.status(404).json({ message: 'Usuario no encontrado' });
      }
    }
  });
});

module.exports = router;

