const mysql = require('mysql2');
require('dotenv').config();

// Configuración de la conexión a la base de datos
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || 'lamv_aimlds9714sa&d252728ruisu-san',
    database: process.env.DB_NAME || 'r-tam',
    port: process.env.DB_PORT || 3306
});

// Conectar a la base de datos
db.connect(err => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        return;
    }
    console.log('Conexión a la base de datos establecida.');
});

module.exports = db;
