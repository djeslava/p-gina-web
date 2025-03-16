const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Importar la conexión a la base de datos
const bcrypt = require('bcrypt'); // Para comparar contraseñas

// **Ruta para registrar un nuevo usuario**
router.post('/registro', async (req, res) => {
    const { DNI, nombre, email, contraseña, cargo } = req.body;
    
    // Validar que no haya campos vacíos
    if (!DNI || !nombre || !email || !contraseña || !cargo) {
        return res.status(400).json({ error: 'Faltan campos por completar' });
    }

    // Verificar que la contraseña tenga al menos 8 caracteres
    if (contraseña.length < 8) {
        return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres.' });
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


// Ruta para iniciar sesión
router.post('/login', (req, res) => {
    const { DNI, contraseña } = req.body;

    if (!DNI || !contraseña) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    const query = "SELECT * FROM usuario WHERE DNI = ?";
    db.query(query, [DNI], async (err, results) => {
        if (err) {
            console.error("Error en la base de datos:", err);
            return res.status(500).json({ error: "Error inesperado en el servidor" });
        }

        if (results.length === 0) {
            return res.status(401).json({ error: "Usuario no encontrado" });
        }

        const usuario = results[0];

        // Comparar contraseña ingresada con la almacenada en la base de datos
        const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña);
        
        if (!contraseñaValida) {
            return res.status(401).json({ error: "Contraseña incorrecta" });
        }

        // Responder con los datos del usuario (sin la contraseña)
        res.json({
            message: "Inicio de sesión exitoso",
            usuario: {
                DNI: usuario.DNI,
                nombre: usuario.nombre,
                email: usuario.email,
                cargo: usuario.cargo
            }
        });
    });
});

module.exports = router;
