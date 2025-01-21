// src/server/server.js

const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3001; // Puerto del servidor

// Middleware
app.use(cors()); // Permitir solicitudes CORS
app.use(bodyParser.json()); // Analizar solicitudes JSON

// Configuración de conexión a la base de datos
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'samg_db'
});

// Conectar a la base de datos
db.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
        return;
    }
    console.log('Conectado a la base de datos MySQL');
});

// Ruta GET para obtener todos los artículos
app.get('/articulos', (req, res) => {
    db.query('SELECT * FROM articulos', (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error en la consulta a la base de datos' });
        }
        res.json(results);
    });
});

// Ruta POST para agregar un nuevo artículo
app.post('/articulos', (req, res) => {
    const { articulo, marca, modelo, propietario, ultimo_mantenimiento, nombre_trabajador } = req.body;

    // Validar campos obligatorios
    if (!articulo || !marca || !modelo || !propietario || !ultimo_mantenimiento || !nombre_trabajador) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    const query = `
        INSERT INTO articulos (articulo, marca, modelo, propietario, ultimo_mantenimiento, nombre_trabajador)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [articulo, marca, modelo, propietario, ultimo_mantenimiento, nombre_trabajador], (err, result) => {
        if (err) {
            console.error('Error al insertar en la base de datos:', err);
            return res.status(500).json({ message: 'Error al guardar el artículo.' });
        }

        res.status(201).json({ message: 'Artículo agregado exitosamente.', id: result.insertId });
    });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
