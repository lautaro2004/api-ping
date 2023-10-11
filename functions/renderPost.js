const express = require('express');
const db = require('../db');
require('dotenv').config();
const router = express.Router();

// Ruta para obtener todos los posts con la información de los usuarios y los comentarios
router.get('/', async (req, res) => {
  try {
    const sql = `
    SELECT
        post.post_id,
        post.user_id,
        post.post_text,
        post.post_img,
        COUNT(likes.post_id) AS num_likes,
        COUNT(comments.comment_id) AS num_comments,
        post.create_att,
        users.username,
        users.profile_photo
      FROM
        post
      JOIN
        users ON post.user_id = users.user_id
      LEFT JOIN
        likes ON post.post_id = likes.post_id
      LEFT JOIN
        comments ON post.post_id = comments.post_id
      GROUP BY
        post.post_id,
        post.user_id,
        post.post_text,
        post.post_img,
        post.create_att,
        users.username,
        users.profile_photo
      ORDER BY post.create_att DESC`;

    const [results, fields] = await db.execute(sql);

    console.log('Posts obtenidos de la base de datos');

    // Construir la URL completa de la foto de perfil para cada resultado
    const postsWithFullProfilePhotoUrl = results.map(post => ({
      ...post,
      profile_photo: `https://ping-api-70i8.onrender.com/profiles_pictures/${post.profile_photo}`,
      post_img: post.post_img
        ? `https://ping-api-70i8.onrender.com/${post.post_img}`
        : null, // Ruta relativa para la imagen del post si existe
    }));

    res.status(200).json(postsWithFullProfilePhotoUrl);
  } catch (error) {
    console.error('Error al obtener los posts:', error);
    res.status(500).json({ message: 'Error al obtener los posts' });
  }
});

// Ruta para obtener la imagen de un post por su ID
router.get('/images/:postId', async (req, res) => {
  const postId = req.params.postId;

  try {
    // Obtener la ruta de la imagen desde la base de datos utilizando el postId
    const sql = 'SELECT post_img FROM post WHERE post_id = ?';
    const [results, fields] = await db.execute(sql, [postId]);

    if (results.length > 0) {
      const imagePath = results[0].post_img;
      if (imagePath) {
        // Asegúrate de que la ruta relativa sea correcta
        const relativePath = `uploads/${imagePath}`;
        res.sendFile(path.join(__dirname, '..', relativePath));
      } else {
        res.status(404).json({ message: 'Post no encontrado' });
      }
    } else {
      res.status(404).json({ message: 'Post no encontrado' });
    }
  } catch (error) {
    console.error('Error al obtener la imagen del post:', error);
    res.status(500).json({ message: 'Error al obtener la imagen del post' });
  }
});

module.exports = router;






