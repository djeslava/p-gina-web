require('dotenv').config();
const express = require('express');
const session = require('express-session');
const PostgreSQLStore = require("connect-pg-simple")(session);
const cors = require('cors');
const { Pool } = require('pg'); // Cambiamos a pg (PostgreSQL)
const path = require('path');
const userRoutes = require('./routes/userRoutes');

const app = express();
const port = process.env.PORT || 10000;

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

// Configurar CORS para permitir peticiones desde el frontend
const corsOptions = {
    origin: "https://r-tam.onrender.com", // URL del frontend
    credentials: true, // Permitir cookies y encabezados de autenticación
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Para manejar preflight

// Necesario para cookies seguras en Render
app.set('trust proxy', 1); // Habilitar proxy para HTTPS

// Configurar sesión
app.use(session({
    store: sessionStore,
    secret: process.env.SESSION_SECRET || 'r-tam_ADSO_2025', // Usa variable de entorno
    resave: false,
    saveUninitialized: false,
    name: 'user_sid', // Nombre de la cookie de sesión
    cookie: {
        secure: process.env.SESSION_SECRET || 'r-tam_ADSO_2025',
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 86400000 // 1 día en ms
    }
}));

// Middleware para parsear JSON y URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para inyectar el pool en las rutas
app.use((req, res, next) => {
    req.db = pool; // Ahora las rutas usarán req.db.query()
    next();
});

// Usar las rutas
app.use('/api', userRoutes);



// Endpoint de prueba de conexión a DB
app.get('/healthcheck', async (req, res) => {
    try {
        await pool.query('SELECT 1');
        res.status(200).json({ status: 'OK', db: 'Connected' });
    } catch (err) {
        res.status(500).json({ status: 'FAIL', db: 'Disconnected' });
    }
});

// Sirve archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../frontend/WEB 0')));

// Ruta raíz para el frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/WEB 0/index.html'))
});

// Ruta para verificar que el backend funciona
app.get('/api', (req, res) => {
    res.json({
        status: 'API funcionando',
        database: process.env.DATABASE_URL ? 'Conectada' : 'No conectada'
    });
});


// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
    console.log(`Entorno: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Conectado a DB: ${process.env.DATABASE_URL?.split('@')[1]}`);
});

