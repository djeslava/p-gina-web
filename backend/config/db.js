const { Pool } = require('pg');
require('dotenv').config();

// Configuración para PostgreSQL
const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://usuario:contraseña@localhost:5432/r_tam',
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Verificación de conexión
pool.query('SELECT NOW()')
    .then(() => console.log('Conexión a PostgreSQL establecida.'))
    .catch(err => console.error('Error al conectar a PostgreSQL:', err));

module.exports = pool;
