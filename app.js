const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const registerApp = require('./functions/signup.js');
const loginApp = require('./functions/signin.js');
const newPost = require('./functions/createPost.js');
const renderPost = require('./functions/renderPost.js');
const LikesPosts = require('./functions/LikesPost.js');
const SearchUsers = require('./functions/searchUsers.js');
const RenderUsers = require('./functions/RenderUsers.js');
const app = express();
app.use(cors());

// Configurar los encabezados de CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Esto permite cualquier origen
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use('/profiles_pictures', express.static(path.join(__dirname, 'profiles_pictures')));

// Configurar el middleware body-parser para procesar los datos enviados en las solicitudes
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.sendStatus(200);
});

console.log(__dirname);

// Configurar la aplicación Express
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/signup', registerApp);
app.use('/signin', loginApp);
app.use('/newpost', newPost);
app.use('/posts', renderPost);
app.use('/posts', LikesPosts);
app.use('/search', SearchUsers);
app.use('/user', RenderUsers);
app.get('/get-user-data', (req, res) => {
  const { user_id } = req.query; // Obtiene el user_id de la consulta

  // Realiza una consulta a tu base de datos para obtener los datos del usuario
  // Reemplaza esta parte con tu lógica para obtener los datos del usuario

  // Supongamos que tienes una función `getUserData` para obtener los datos del usuario
  const userData = getUserData(user_id);

  if (userData) {
    res.status(200).json(userData); // Envía los datos del usuario como respuesta
  } else {
    res.status(404).json({ error: 'Usuario no encontrado' });
  }
});

// Iniciar el servidor
app.listen(3000, () => {
  console.log('Servidor escuchando en el puerto 3000');
});

