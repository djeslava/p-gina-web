require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MySQLStore = require("express-mysql-session")(session);
const cors = require('cors');
// const bodyParser = require('body-parser');
const db = require('./config/db'); // Conexión a MySQL
const userRoutes = require('./routes/userRoutes');

const app = express();
const port = process.env.PORT || 3000;


// Configurar almacenamiento de sesiones en MySQL
const sessionStore = new MySQLStore({
    clearExpired: true, // Limpiar sesiones expiradas automáticamente
    checkExpirationInterval: 900000, // Intervalo para verificar sesiones expiradas (15 minutos)
    expiration: 86400000, // Duración de la sesión (1 día en milisegundos)
    createDatabaseTable: true, // Crear la tabla automáticamente si no existe
    schema: {
        tableName: 'sessions', // Nombre de la tabla
        columnNames: {
            session_id: 'session_id',
            expires: 'expires',
            data: 'data'
        }
    }
}, db);

// Configurar sesión
app.use(session({
    key: "user_sid",
    secret: 'r-tam_ADSO_2025', // Usar una clave secreta en producción
    store: sessionStore, // Guardar sesiones en MySQL
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: true, // true en producción
        httpOnly: true, 
        sameSite: 'lax', // Política de SameSite para evitar problemas con CORS
        // sameSite: 'none', // Cambia a 'none' para permitir solicitudes cruzadas
        maxAge: 1000 * 60 * 60 * 24} // duración de la sesión (1 día)
}));

// Configurar CORS para permitir peticiones desde el frontend
const corsOptions = {
    origin: "http://127.0.0.1:5500", // URL del frontend con Live Server
    credentials: true // Permitir cookies y encabezados de autenticación
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.urlencoded({ extended: true }));

// Usar las rutas
app.use('/api', userRoutes);


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

