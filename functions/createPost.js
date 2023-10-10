const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const db = require("../db.js");
const fs = require('fs');
const uploadsFolder = path.join(__dirname, '..', 'uploads'); // Usar 'join' en lugar de 'resolve'

// Crear la carpeta 'uploads' si no existe
if (!fs.existsSync(uploadsFolder)) {
  fs.mkdirSync(uploadsFolder);
}

// Configuración de multer para gestionar la subida de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsFolder); // Utiliza la variable 'uploadsFolder' como destino de las imágenes
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

// Ruta para crear un nuevo post
router.post('/', upload.single('image'), (req, res) => {
  // Obtener los datos del cuerpo de la solicitud
  const { text, userId } = req.body;

  // Verificar si se proporcionó un archivo en la solicitud
  if (req.file) {
    // Se proporcionó un archivo, obtener la ruta relativa de la imagen subida
    const imagePath = path.join('uploads', req.file.filename); // Ruta relativa

    // Guardar la ruta relativa de la imagen en la base de datos
    const sql = 'INSERT INTO post (user_id, post_text, post_img) VALUES (?, ?, ?)';
    const values = [userId, text, imagePath];

    db.query(sql, values, (error, result) => {
      if (error) {
        console.error('Error al guardar el post en la base de datos:', error);
        res.status(500).json({ message: 'Error al guardar el post en la base de datos' });
      } else {
        console.log('Post guardado en la base de datos');
        res.status(201).json({ message: 'Post creado exitosamente', post: result });
      }
    });
  } else {
    // No se proporcionó un archivo, realizar el guardado del post sin imagen
    const sql = 'INSERT INTO post (user_id, post_text) VALUES (?, ?)';
    const values = [userId, text];

    db.query(sql, values, (error, result) => {
      if (error) {
        console.error('Error al guardar el post en la base de datos:', error);
        res.status(500).json({ message: 'Error al guardar el post en la base de datos' });
      } else {
        console.log('Post guardado en la base de datos');
        res.status(201).json({ message: 'Post creado exitosamente', post: result });
      }
    });
  }
});

module.exports = router;


