// src/server/server.js
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3001; // Puerto en el que se ejecutará el servidor

// Middleware
app.use(cors()); // Permitir solicitudes CORS
app.use(bodyParser.json()); // Analizar solicitudes JSON

// Configuración de la conexión a la base de datos
const db = mysql.createConnection({
    host: 'localhost', // Cambia esto si tu base de datos está en otra dirección
    user: 'root', // Cambia esto si tu usuario es diferente
    password: '', // Cambia esto si tienes una contraseña
    database: 'samg_db' // Cambia esto al nombre real de tu base de datos
});

// Conectar a la base de datos
db.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
        return;
    }
    console.log('Conectado a la base de datos MySQL');
});

// Ruta para manejar el inicio de sesión
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Consulta para verificar las credenciales del usuario
    const query = 'SELECT * FROM usuario WHERE username = ? AND password = ?';
    db.query(query, [username, password], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error en la consulta a la base de datos' });
        }
        
        if (results.length > 0) {
            res.status(200).json({ message: 'Inicio de sesión exitoso', user: results[0] });
        } else {
            res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
        }
    });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
