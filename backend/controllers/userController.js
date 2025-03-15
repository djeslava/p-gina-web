const db = require('../config/db');
const bcrypt = require('bcryptjs');

// Controlador para registrar un usuario
exports.registerUser = async (req, res) => {
    const { DNI, nombre, email, contraseña, cargo } = req.body;

    if (!DNI || !nombre || !email || !contraseña || !cargo) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    try {
        // Encriptar la contraseña antes de almacenarla
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(contraseña, salt);

        // Insertar usuario en la base de datos con fecha actual
        const query = `INSERT INTO usuario (DNI, nombre, email, contraseña, cargo, fechaRegistro) VALUES (?, ?, ?, ?, ?, NOW())`;

        db.query(query, [DNI, nombre, email, hashedPassword, cargo], (err, result) => {
            if (err) {
                console.error('Error al registrar usuario:', err);
                return res.status(500).json({ error: 'Error al registrar usuario' });
            }
            res.status(201).json({ message: 'Usuario registrado correctamente' });
        });

    } catch (error) {
        console.error('Error en el servidor:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};
