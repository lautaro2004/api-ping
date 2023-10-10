const express = require('express');
const router = express.Router();
const db = require('../db');

// Ruta para dar like a un post
router.post('/:postId/like', (req, res) => {
  const { postId } = req.params;
  const { userId } = req.body;

  // Verificar si el usuario ya ha dado like al post
  const checkLikeQuery = 'SELECT * FROM likes WHERE post_id = ? AND user_id = ?';
  db.query(checkLikeQuery, [postId, userId], (error, results) => {
    if (error) {
      console.error('Error al verificar si el usuario ya dio like:', error);
      res.status(500).json({ message: 'Error al verificar si el usuario ya dio like' });
    } else {
      if (results.length > 0) {
        // El usuario ya ha dado like al post
        res.status(400).json({ message: 'El usuario ya ha dado like a este post' });
      } else {
        // Insertar el like del usuario en la tabla de likes
        const insertLikeQuery = 'INSERT INTO likes (post_id, user_id) VALUES (?, ?)';
        db.query(insertLikeQuery, [postId, userId], (error, result) => {
          if (error) {
            console.error('Error al insertar el like:', error);
            res.status(500).json({ message: 'Error al insertar el like' });
          } else {
            console.log('Like agregado al post');
            res.status(200).json({ message: 'Like agregado al post' });
          }
        });
      }
    }
  });
});

module.exports = router;


