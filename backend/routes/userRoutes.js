// const express = require('express');
// const { registerUser } = require('../controllers/userController');
// const router = express.Router();

// // Ruta para registrar un usuario
// router.post('/register', registerUser);

// module.exports = router;

const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Importar la conexión a la base de datos

// Ruta para registrar un nuevo usuario
router.post('/registro', (req, res) => {
    const { DNI, nombre, email, contraseña, cargo } = req.body;
    
    if (!DNI || !nombre || !email || !contraseña || !cargo) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const fechaRegistro = new Date(); // Fecha y hora actual

    const query = 'INSERT INTO usuario (DNI, nombre, email, contraseña, cargo, fechaRegistro) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [DNI, nombre, email, contraseña, cargo, fechaRegistro], (err, result) => {
        if (err) {
            console.error('Error al registrar usuario:', err);
            return res.status(500).json({ error: 'Error al registrar usuario' });
        }
        res.status(201).json({ message: 'Usuario registrado correctamente' });
    });
});

module.exports = router;
