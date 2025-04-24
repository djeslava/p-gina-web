const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT || 5432,
  ssl: {
    rejectUnauthorized: true // Obligatorio en Render
  }
});

// Test de conexión
pool.query('SELECT NOW()')
  .then(() => console.log('✅ PostgreSQL conectado'))
  .catch(err => {
    console.error('❌ Error de conexión a PostgreSQL:', err);
    process.exit(1);
  });

module.exports = pool;
