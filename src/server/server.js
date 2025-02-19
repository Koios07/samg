const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Configuración de conexión a la base de datos
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "", 
    database: "samg_db", 
});

// Conectar a la base de datos
db.connect((err) => {
    if (err) {
        console.error("Error conectando a la base de datos:", err);
        process.exit(1);
    }
    console.log("Conectado a la base de datos MySQL");
});

// Middleware para registrar solicitudes
app.use((req, res, next) => {
    console.log(`Solicitud recibida: ${req.method} ${req.url}`);
    next();
});

// Ruta GET para obtener todos los artículos
app.get("/articulos", (req, res) => {
    db.query("SELECT * FROM articulos", (err, results) => {
        if (err) {
            console.error("Error en la consulta a la base de datos:", err);
            return res.status(500).json({ error: "Error en la consulta a la base de datos" });
        }
        res.json(results);
    });
});

// Ruta GET para obtener un artículo por ID
app.get("/articulos/:id", (req, res) => {
    const articuloId = req.params.id;

    const query = "SELECT * FROM articulos WHERE id_articulo = ?";
    db.query(query, [articuloId], (err, results) => {
        if (err) {
            console.error("Error al obtener el artículo:", err);
            return res.status(500).json({ error: "Error en la base de datos" });
        }

        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).json({ message: "Artículo no encontrado" });
        }
    });
});

// Ruta POST para procesar el login
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "El usuario y contraseña son obligatorios." });
    }

    const query = "SELECT * FROM usuario WHERE username = ? AND password = ?";
    db.query(query, [username, password], (err, results) => {
        if (err) {
            console.error("Error en la consulta:", err);
            return res.status(500).json({ message: "Error en el servidor." });
        }

        if (results.length > 0) {
            res.status(200).json({ message: "Inicio de sesión exitoso.", userId: results[0].id });
        } else {
            res.status(401).json({ message: "Credenciales incorrectas." });
        }
    });
});

// Ruta POST para agregar un nuevo artículo
app.post("/articulos", (req, res) => {
    const { articulo, marca, modelo, propietario, nit, ultimo_mantenimiento, nombre_trabajador } = req.body;

    if (!articulo || !marca || !modelo || !propietario || !nit || ultimo_mantenimiento || !nombre_trabajador) {
        return res.status(400).json({ message: "Todos los campos son obligatorios." });
    }

    const query = `
        INSERT INTO articulos (articulo, marca, modelo, propietario, nit, ultimo_mantenimiento, nombre_trabajador)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [articulo, marca, modelo, propietario, nit, ultimo_mantenimiento, nombre_trabajador], (err, result) => {
        if (err) {
            console.error("Error al insertar en la base de datos:", err);
            return res.status(500).json({ message: "Error al guardar el artículo." });
        }

        res.status(201).json({ message: "Artículo agregado exitosamente.", id_articulo: result.insertId });
    });
});

// Ruta PUT para actualizar un artículo por ID
app.put("/articulos/:id", (req, res) => {
    const articuloId = req.params.id;
    const { articulo, marca, modelo, propietario, nit, ultimo_mantenimiento, nombre_trabajador } = req.body;

    if (!articulo || !marca || !modelo || !propietario || !nit || ultimo_mantenimiento || !nombre_trabajador) {
        return res.status(400).json({ message: "Todos los campos son obligatorios." });
    }

    const query = `
        UPDATE articulos 
        SET articulo = ?, marca = ?, modelo = ?, propietario = ?, nit = ?, ultimo_mantenimiento = ?, nombre_trabajador = ? 
        WHERE id_articulo = ?
    `;

    db.query(
        query,
        [articulo, marca, modelo, propietario, nit, ultimo_mantenimiento, nombre_trabajador, articuloId],
        (err, results) => {
            if (err) {
                console.error("Error al actualizar el artículo:", err);
                return res.status(500).json({ error: "Error en la base de datos" });
            }

            if (results.affectedRows > 0) {
                res.json({ message: "Artículo actualizado correctamente" });
            } else {
                res.status(404).json({ message: "Artículo no encontrado" });
            }
        }
    );
});

// Ruta POST para crear un nuevo usuario
app.post("/usuarios", (req, res) => {
    console.log("Petición recibida en /usuarios");

    const { nombre, username, password } = req.body;

    const tipo_usuario = 2; // Tipo de usuario por defecto

    if (!nombre || !username || !password) {
        console.log("Error: Falta un campo obligatorio");
        return res.status(400).json({ message: "Todos los campos son obligatorios." });
    }

    // Verificar si el username ya existe
    const checkUserQuery = "SELECT * FROM usuario WHERE username = ?";

    db.query(checkUserQuery, [username], (err, results) => {
        if (err) {
            console.error("Error al verificar el usuario:", err);
            return res.status(500).json({ message: "Error en el servidor." });
        }

        if (results.length > 0) {
            return res.status(409).json({ message: "El nombre de usuario ya está en uso." });
        }

        // Insertar nuevo usuario
        const query =
            `INSERT INTO usuario (nombre,
       username,
       password,
       tipo_usuario)
       VALUES (?, ?, ?, ?)`;

        db.query(query,
            [nombre,
                username,
                password,
                tipo_usuario],
            (err,
                result) => {

                if (err) {
                    console.error('Error al insertar:', err)
                    return res.status(500).json({ message: "No se pudo guardar" })
                }

                console.log('Usuario creado con éxito', result.insertId)
                return res.json({ "ok": true })
            })
    })
})

// Ruta POST para cambiar la contraseña del usuario
app.post('/cambiar-contrasena', (req, res) => {
    const { id, oldPassword, newPassword } = req.body; // Usa "id" en lugar de "id_usuario"

    console.log("Received data:", { id, oldPassword, newPassword });

    if (!id || !oldPassword || !newPassword) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    // Verificar si la contraseña actual es correcta
    const query = 'SELECT * FROM usuario WHERE id = ? AND password = ?';

    db.query(query, [id, oldPassword], (err, results) => {
        if (err) {
            console.error('Error al verificar la contraseña:', err);
            return res.status(500).json({ message: 'Error al verificar la contraseña.' });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: 'La contraseña actual es incorrecta.' });
        }

        // Actualizar la nueva contraseña
        const updateQuery = 'UPDATE usuario SET password = ? WHERE id = ?';

        db.query(updateQuery, [newPassword, id], (err2, result2) => {
            if (err2) {
                console.error('Error al actualizar la contraseña:', err2);
                return res.status(500).json({ message: 'Error al cambiar la contraseña.' });
            }

            if (result2.affectedRows > 0) {
                return res.status(200).json({ message: 'Contraseña cambiada exitosamente.' });
            } else {
                return res.status(404).json({ message: 'Usuario no encontrado.' });
            }
        });
    });
});

// Middleware para manejar rutas no encontradas
app.use((req, res) => {
    console.log('Ruta no encontrada:', req.method, '-', req.url)
    return res.status(404).send({ "msg": "ruta inválida" })
})

// Iniciar servidor:
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
})
