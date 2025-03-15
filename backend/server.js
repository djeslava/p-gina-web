require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Usar las rutas
app.use('/api', userRoutes);

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

app.post('/registro', (req, res) => {
    const { DNI, nombre, email, contraseña, cargo } = req.body;
    const fechaRegistro = new Date(); // Obtiene la fecha y hora actual

    const query = 'INSERT INTO usuario (DNI, nombre, email, contraseña, cargo, fechaRegistro) VALUES (?, ?, ?, ?, ?, ?)';
    connection.query(query, [DNI, nombre, email, contraseña, cargo, fechaRegistro], (err, result) => {
        if (err) {
            console.error('Error al registrar usuario:', err);
            res.status(500).json({ error: 'Error al registrar usuario' });
        } else {
            res.status(201).json({ message: 'Usuario registrado correctamente' });
        }
    });
});

