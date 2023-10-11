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
const userData = require('./functions/getUserData.js'); // Importa el módulo userData
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
app.get('/get-user-data', async (req, res) => {
  const { user_id } = req.query;

  try {
    const userData = await userData.getUserData(user_id);
    if (userData) {
      res.status(200).json(userData);
    } else {
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error('Error al obtener los datos del usuario:', error);
    res.status(500).json({ message: 'Error al obtener los datos del usuario' });
  }
});

// Iniciar el servidor
app.listen(3000, () => {
  console.log('Servidor escuchando en el puerto 3000');
});

