require('dotenv').config();
const express = require('express');
const session = require('express-session');
const PostgreSQLStore = require("connect-pg-simple")(session);
const cors = require('cors');
const { Pool } = require('pg'); // Cambiamos a pg (PostgreSQL)
const userRoutes = require('./routes/userRoutes');

const app = express();
const port = process.env.PORT || 3000;

// Configuración del pool de PostgreSQL (reemplaza a MySQL)
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // Requerido para Render
    }
});

// Configurar almacenamiento de sesiones en PostgreSQL
const sessionStore = new PostgreSQLStore({
    pool: pool, // Usamos el mismo pool de conexiones
    tableName: 'sessions',
    schemaName: 'public',
    createTableIfMissing: true, // Crea la tabla si no existe
    ttl: 86400, // 1 día en segundos
    pruneSessionInterval: 900 // Limpieza cada 15 minutos
});

// Configurar sesión
app.use(session({
    store: sessionStore,
    secret: process.env.SESSION_SECRET || 'r-tam_ADSO_2025', // Usa variable de entorno
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // true en Render
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Requerido para HTTPS
        maxAge: 86400000 // 1 día en ms
    },
    name: 'user_sid' // Nombre de la cookie de sesión
}));

// Configurar CORS para permitir peticiones desde el frontend
const corsOptions = {
    origin: process.env.NODE_ENV === 'production'
        ? 'https://r-tam.onrender.com'
        : 'http://127.0.0.1:5500',
    credentials: true // Permitir cookies y encabezados de autenticación
};

app.use(cors(corsOptions));

// Middleware para parsear JSON y URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.urlencoded({ extended: true }));

// Middleware para inyectar el pool en las rutas
app.use((req, res, next) => {
    req.db = pool; // Ahora las rutas usarán req.db.query()
    next();
});

// Usar las rutas
app.use('/api', userRoutes);


// // Iniciar el servidor
// app.listen(port, () => {
//     console.log(`Servidor corriendo en http://localhost:${port}`);
// });

// Endpoint de registro actualizado para PostgreSQL
app.post('/registro', async (req, res) => {
    const { DNI, nombre, email, contraseña, cargo } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO usuario (DNI, nombre, email, contraseña, cargo) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING DNI, nombre, email, cargo, "fechaRegistro"`,
            [DNI, nombre, email, contraseña, cargo]
        );

        res.status(201).json({
            message: 'Usuario registrado correctamente',
            usuario: result.rows[0]
        });
    } catch (err) {
        console.error('Error al registrar usuario:', err);

        if (err.code === '23505') { // Violación de unique constraint
            res.status(409).json({ error: 'El usuario ya existe' });
        } else {
            res.status(500).json({ error: 'Error en el servidor' });
        }
    }
});

// Endpoint de prueba de conexión a DB
app.get('/healthcheck', async (req, res) => {
    try {
        await pool.query('SELECT 1');
        res.status(200).json({ status: 'OK', db: 'Connected' });
    } catch (err) {
        res.status(500).json({ status: 'FAIL', db: 'Disconnected' });
    }
});

// Ruta raíz para el frontend
app.get('/', (req, res) => {
    res.send('Bienvenido al Sistema de Control de Acceso');
});

// Ruta para verificar que el backend funciona
app.get('/api', (req, res) => {
    res.json({
        status: 'API funcionando',
        database: process.env.DATABASE_URL ? 'Conectada' : 'No conectada'
    });
});

const path = require('path');

// Sirve archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../frontend/WEB%200/index.html')));

// Ruta de fallback para SPA (si usas React/Vue/Angular)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/WEB 0/index.html'));
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
    console.log(`Entorno: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Conectado a DB: ${process.env.DATABASE_URL?.split('@')[1]}`);
});

