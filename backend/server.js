require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MySQLStore = require("express-mysql-session")(session);
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./config/db'); // Conexión a MySQL
const userRoutes = require('./routes/userRoutes');

const app = express();
const port = process.env.PORT || 3000;


// Configurar almacenamiento de sesiones en MySQL
const sessionStore = new MySQLStore({}, db);

// Configurar sesión
app.use(session({
    key: "user_sid",
    secret: 'clave_secreta_super_segura', // Usar una clave secreta en producción
    store: sessionStore, // Guardar sesiones en MySQL
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, // true en producción
        httpOnly: true, 
        sameSite: 'lax',
        maxAge: 86400000 } // duración de la sesión
}));

// Configurar CORS para permitir peticiones desde el frontend
const corsOptions = {
    origin: "http://127.0.0.1:5500", // URL del frontend con Live Server
    // methods: "GET,POST,PUT,DELETE",
    credentials: true // Permitir cookies y encabezados de autenticación
};

app.use(cors(corsOptions));
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

// Usar las rutas
app.use('/api', userRoutes);

// Ruta de prueba para verificar sesión
// app.get("/api/verificar-sesion", (req, res) => {
//     if (req.session.usuario) {
//         res.json({ autenticado: true, usuario: req.session.usuario });
//     } else {
//         res.status(401).json({ autenticado: false });
//     }
// });

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

app.post('/registro', (req, res) => {
    const { DNI, nombre, email, contraseña, cargo } = req.body;
    const fechaRegistro = new Date(); // Obtiene la fecha y hora actual

    const query = 'INSERT INTO usuario (DNI, nombre, email, contraseña, cargo, fechaRegistro) VALUES (?, ?, ?, ?, ?, ?)';
    connection.query(query, [DNI, nombre, email, contraseña, cargo, fechaRegistro], (err, result) => {
        if (err) {
            console.error('Error al registrar usuario:', err);
            res.status(500).json({ error: 'Error al registrar usuario' });
        } else {
            res.status(201).json({ message: 'Usuario registrado correctamente' });
        }
    });
});

