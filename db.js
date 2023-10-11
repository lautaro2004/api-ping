const mysql = require("mysql2");
require('dotenv').config(); // Para cargar variables de entorno desde un archivo .env

// Configurar el pool de conexiones a la base de datos MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT, // Si Railway proporciona un puerto específico
});

// Establecer la conexión a la base de datos
pool.getConnection((err, connection) => {
  if (err) {
    console.error("Error al conectar a la base de datos: " + err.message);
  } else {
    console.log("Conexión a la base de datos establecida");
    connection.release(); // Liberar la conexión para que esté disponible para otras consultas
  }
});

// Exportar el pool de conexiones
module.exports = pool.promise();

