const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3001;

// Middleware
app.use(cors({ origin: 'http://localhost:3000' })); // Permitir solicitudes desde React
app.use(bodyParser.json()); // Analizar solicitudes JSON

// Configuración de conexión a la base de datos
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'samg_db',
});

// Conectar a la base de datos
db.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
        process.exit(1); // Detener el servidor si no se puede conectar a la base de datos
    }
    console.log('Conectado a la base de datos MySQL');
});

// Ruta GET para obtener todos los artículos
app.get('/articulos', (req, res) => {
    db.query('SELECT * FROM articulos', (err, results) => {
        if (err) {
            console.error('Error en la consulta a la base de datos:', err);
            return res.status(500).json({ error: 'Error en la consulta a la base de datos' });
        }
        res.json(results);
    });
});

// Ruta GET para obtener un artículo por ID
app.get('/articulos/:id', (req, res) => {
    const articuloId = req.params.id;
    console.log(`ID recibido: ${articuloId}`); // Log para verificar el ID recibido

    const query = 'SELECT * FROM articulos WHERE id_articulo = ?';
    db.query(query, [articuloId], (err, results) => {
        if (err) {
            console.error('Error al obtener el artículo:', err);
            return res.status(500).json({ error: 'Error en la base de datos' });
        }

        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).json({ message: 'Artículo no encontrado' });
        }
    });
});

// Ruta POST para procesar el login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'El usuario y contraseña son obligatorios.' });
    }

    const query = 'SELECT * FROM usuario WHERE username = ? AND password = ?';
    db.query(query, [username, password], (err, results) => {
        if (err) {
            console.error('Error en la consulta:', err);
            return res.status(500).json({ message: 'Error en el servidor.' });
        }

        if (results.length > 0) {
            res.status(200).json({ message: 'Inicio de sesión exitoso.' });
        } else {
            res.status(401).json({ message: 'Credenciales incorrectas.' });
        }
    });
});

// Ruta POST para agregar un nuevo artículo
app.post('/articulos', (req, res) => {
    const { articulo, marca, modelo, propietario, ultimo_mantenimiento, nombre_trabajador } = req.body;

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

        res.status(201).json({ message: 'Artículo agregado exitosamente.', id_articulo: result.insertId });
    });
});

// Ruta PUT para actualizar un artículo por ID
app.put('/articulos/:id', (req, res) => {
    const articuloId = req.params.id;
    const { articulo, marca, modelo, propietario, ultimo_mantenimiento, nombre_trabajador } = req.body;

    // Validar campos obligatorios
    if (!articulo || !marca || !modelo || !propietario || !ultimo_mantenimiento || !nombre_trabajador) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    const query = `
        UPDATE articulos 
        SET articulo = ?, marca = ?, modelo = ?, propietario = ?, ultimo_mantenimiento = ?, nombre_trabajador = ? 
        WHERE id_articulo = ?
    `;

    db.query(query, [articulo, marca, modelo, propietario, ultimo_mantenimiento, nombre_trabajador, articuloId], (err, results) => {
        if (err) {
            console.error('Error al actualizar el artículo:', err);
            return res.status(500).json({ error: 'Error en la base de datos' });
        }

        if (results.affectedRows > 0) {
            res.json({ message: 'Artículo actualizado correctamente' });
        } else {
            res.status(404).json({ message: 'Artículo no encontrado' });
        }
    });
});

// Middleware para manejar rutas no encontradas
app.use((req, res) => {
    res.status(404).json({ message: 'Ruta no encontrada.' });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
