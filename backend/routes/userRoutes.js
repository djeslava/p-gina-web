const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Importar la conexión a la base de datos

// **Ruta para registrar un nuevo usuario**
router.post('/registro', async (req, res) => {
    const { DNI, nombre, email, contraseña, cargo } = req.body;
    
    // Validar que no haya campos vacíos
    if (!DNI || !nombre || !email || !contraseña || !cargo) {
        return res.status(400).json({ error: 'Faltan campos por completar.' });
    }

    // Verificar si el usuario ya existe
    const checkUserQuery = 'SELECT DNI FROM usuario WHERE DNI = ?';
    db.query(checkUserQuery, [DNI], (err, result) => {
        if (err) {
            console.error('Error al verificar usuario:', err);
            return res.status(500).json({ error: 'Error inesperado en el servidor.' });
        }

        if (result.length > 0) {
            console.warn('Intento de registro con DNI existente:', DNI);
            return res.status(409).json({ error: 'El usuario ya está registrado.' });
        }

        // Insertar nuevo usuario
        const fechaRegistro = new Date();
        const insertQuery = 'INSERT INTO usuario (DNI, nombre, email, contraseña, cargo, fechaRegistro) VALUES (?, ?, ?, ?, ?, ?)';
        db.query(insertQuery, [DNI, nombre, email, contraseña, cargo, fechaRegistro], (err, result) => {
            if (err) {
                console.error('Error al registrar usuario:', err);
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({ error: 'El usuario ya está registrado.' });
                }
                return res.status(500).json({ error: 'Error inesperado en el servidor.' });
            }
            res.status(201).json({ message: 'Usuario registrado exitosamente.' });
        });
    });
});

module.exports = router;
