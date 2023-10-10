const mysql = require("mysql2");

// Configurar la conexión a la base de datos MySQL
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "ping",
});

// Establecer la conexión a la base de datos
connection.connect((error) => {
  if (error) {
    console.error("Error al conectar a la base de datos: " + error.stack);
    return;
  }
  console.log("Conexión a la base de datos establecida");
});

module.exports = connection;
