const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

// Middleware para verificar autenticación
const verificarAutenticacion = (req, res, next) => {
    if (!req.session.usuario) {
        return res.status(401).json({ error: "No autorizado, por favor inicie sesión." });
    }
    next();
};

// Ruta para registrar un nuevo usuario
router.post('/registro', async (req, res) => {
    const db = req.db;
    const { DNI, nombre, email, contraseña, cargo } = req.body;

    if (!DNI || !nombre || !email || !contraseña || !cargo) {
        return res.status(400).json({ error: 'Faltan campos por completar' });
    }

    if (contraseña.length < 8) {
        return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres.' });
    }

    try {
        const checkUserQuery = 'SELECT DNI FROM usuario WHERE DNI = $1';
        const { rows } = await db.query(checkUserQuery, [DNI]);
        if (rows.length > 0) {
            return res.status(409).json({ error: 'El usuario ya está registrado.' });
        }

        const hashedPassword = await bcrypt.hash(contraseña, 10);
        const fechaRegistro = new Date();

        const insertQuery = `
            INSERT INTO usuario (DNI, nombre, email, contraseña, cargo, "fechaRegistro")
            VALUES ($1, $2, $3, $4, $5, $6)
        `;

        await db.query(insertQuery, [DNI, nombre, email, hashedPassword, cargo, fechaRegistro]);
        res.status(201).json({ message: 'Usuario registrado exitosamente.' });

    } catch (err) {
        console.error('❌ Error al registrar usuario:', err);
        res.status(500).json({ error: 'Error inesperado en el servidor.' });
    }
});

// Ruta para iniciar sesión
router.post('/login', async (req, res) => {
    const db = req.db;
    const { dni, contraseña } = req.body;

    if (!dni || !contraseña) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    try {
        const query = 'SELECT * FROM usuario WHERE DNI = $1';
        const { rows } = await db.query(query, [dni]);

        if (rows.length === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        const usuario = rows[0];
        const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña);

        if (!contraseñaValida) {
            return res.status(401).json({ error: "Contraseña incorrecta" });
        }

        req.session.usuario = {
            DNI: usuario.dni,
            nombre: usuario.nombre,
            email: usuario.email,
            cargo: usuario.cargo
        };

        console.log("✅ Usuario autenticado correctamente. Sesión guardada:", req.session.usuario);
        res.status(200).json({ message: "Inicio de sesión exitoso", usuario: req.session.usuario });

    } catch (err) {
        console.error("❌ Error en la autenticación:", err);
        res.status(500).json({ error: "Error inesperado en el servidor" });
    }
});

// Verificar sesión activa
router.get('/verificar-sesion', (req, res) => {
    console.log("📢 Verificando sesión:", req.session.usuario);
    if (req.session.usuario) {
        res.status(200).json({
            autenticado: true,
            usuario: req.session.usuario.nombre,
            cargo: req.session.usuario.cargo
        });
    } else {
        res.status(401).json({ autenticado: false });
    }
});

// Cerrar sesión
router.post('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                return res.status(500).json({ error: "Error al cerrar sesión" });
            }
            res.clearCookie("user_sid");
            console.log("✅ Sesión finalizada correctamente");
            res.status(200).json({ message: "Sesión finalizada correctamente" });
        });
    } else {
        res.status(400).json({ error: "No hay una sesión activa" });
    }
});

// Rutas protegidas
router.use(verificarAutenticacion);

router.get('/perfil', (req, res) => {
    res.json(req.session.usuario);
});

router.get('/dashboard', (req, res) => {
    res.json({ message: "Bienvenido al dashboard", usuario: req.session.usuario });
});

router.get('/configuracion', (req, res) => {
    res.json({ message: "Configuración del usuario", usuario: req.session.usuario });
});

module.exports = router;
