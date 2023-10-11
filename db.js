const mysql = require("mysql2");

// Configurar la conexión a la base de datos MySQL
const connection = mysql.createConnection({
  host: "containers-us-west-148.railway.app",
  user: "root",
  password: "14SBVKdnqPBJQ28qtvdj",
  database: "railway",
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
