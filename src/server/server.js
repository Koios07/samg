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

// Ruta GET para obtener todos los artículos
app.get("/articulos", (req, res) => {
    db.query("SELECT * FROM articulos", (err, results) => {
        if (err) {
            console.error("Error en la consulta a la base de datos:", err);
            return res
                .status(500)
                .json({ error: "Error en la consulta a la base de datos" });
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
        return res
            .status(400)
            .json({ message: "El usuario y contraseña son obligatorios." });
    }

    const query = "SELECT * FROM usuario WHERE username = ? AND password = ?";
    db.query(query, [username, password], (err, results) => {
        if (err) {
            console.error("Error en la consulta:", err);
            return res.status(500).json({ message: "Error en el servidor." });
        }

        if (results.length > 0) {
            // **AQUI ESTA LA CORRECCION: DEVOLVER tipo_usuario**
            res.status(200).json({
                message: "Inicio de sesión exitoso.",
                userId: results[0].id,
                tipo_usuario: results[0].tipo_usuario  //  Devolvemos el tipo_usuario
            });
        } else {
            res.status(401).json({ message: "Credenciales incorrectas." });
        }
    });
});

// Ruta POST para agregar un nuevo artículo
app.post("/articulos", (req, res) => {
    const {
        articulo,
        marca,
        modelo,
        propietario,
        nit,
        ultimo_mantenimiento,
        nombre_trabajador,
    } = req.body;

    if (
        !articulo ||
        !marca ||
        !modelo ||
        !propietario ||
        !nit ||
        ultimo_mantenimiento ||
        !nombre_trabajador
    ) {
        return res
            .status(400)
            .json({ message: "Todos los campos son obligatorios." });
    }

    const query = `
        INSERT INTO articulos (articulo, marca, modelo, propietario, nit, ultimo_mantenimiento, nombre_trabajador)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        query,
        [
            articulo,
            marca,
            modelo,
            propietario,
            nit,
            ultimo_mantenimiento,
            nombre_trabajador,
        ],
        (err, result) => {
            if (err) {
                console.error("Error al insertar en la base de datos:", err);
                return res.status(500).json({ message: "Error al guardar el artículo." });
            }

            res.status(201).json({
                message: "Artículo agregado exitosamente.",
                id_articulo: result.insertId,
            });
        }
    );
});

// Ruta PUT para actualizar un artículo por ID
app.put("/articulos/:id", (req, res) => {
    const articuloId = req.params.id;
    const {
        articulo,
        marca,
        modelo,
        propietario,
        nit,
        ultimo_mantenimiento,
        nombre_trabajador,
    } = req.body;

    if (
        !articulo ||
        !marca ||
        !modelo ||
        !propietario ||
        !nit ||
        ultimo_mantenimiento ||
        !nombre_trabajador
    ) {
        return res
            .status(400)
            .json({ message: "Todos los campos son obligatorios." });
    }

    const query = `
        UPDATE articulos 
        SET articulo = ?, marca = ?, modelo = ?, propietario = ?, nit = ?, ultimo_mantenimiento = ?, nombre_trabajador = ? 
        WHERE id_articulo = ?
    `;
    db.query(
        query,
        [
            articulo,
            marca,
            modelo,
            propietario,
            nit,
            ultimo_mantenimiento,
            nombre_trabajador,
            articuloId,
        ],
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
    const { nombre, username, password } = req.body;

    const tipo_usuario = 2; // Tipo de usuario por defecto (activo)

    if (!nombre || !username || !password) {
        return res
            .status(400)
            .json({ message: "Todos los campos son obligatorios." });
    }

    const checkUserQuery = "SELECT * FROM usuario WHERE username = ?";

    db.query(checkUserQuery, [username], (err, results) => {
        if (err) {
            console.error("Error al verificar el usuario:", err);
            return res.status(500).json({ message: "Error en el servidor." });
        }

        if (results.length > 0) {
            return res
                .status(409)
                .json({ message: "El nombre de usuario ya está en uso." });
        }

        const query = `
            INSERT INTO usuario (nombre, username, password, tipo_usuario)
            VALUES (?, ?, ?, ?)
        `;

        db.query(
            query,
            [nombre, username, password, tipo_usuario],
            (err, result) => {
                if (err) {
                    console.error("Error al insertar:", err);
                    return res.status(500).json({ message: "No se pudo guardar" });
                }

                return res.json({ ok: true });
            }
        );
    });
});

// Ruta GET para obtener todos los usuarios
app.get("/usuarios", (req, res) => {
    db.query(
        "SELECT id, nombre, username, tipo_usuario FROM usuario WHERE tipo_usuario != 1",
        (err, results) => {
            if (err) {
                console.error("Error en la consulta a la base de datos:", err);
                return res
                    .status(500)
                    .json({ error: "Error en la consulta a la base de datos" });
            }

            // Agregar logs para verificar los datos
            console.log("Datos de usuarios obtenidos de la base de datos:", results);

            results.forEach((usuario) => {
                console.log(
                    `Usuario ${usuario.nombre}: tipo_usuario = ${usuario.tipo_usuario}`
                );
            });

            res.json(results); // Retorna todos los usuarios excluyendo tipo 1 (admin)
        }
    );
});

// Ruta PUT para activar/desactivar un usuario
app.put('/usuarios/:id/activar-desactivar', (req, res) => {
    const { id } = req.params;
    const { tipo_usuario } = req.body; // tipo_usuario: 2 para activar, 3 para desactivar

    console.log(`Se solicita cambiar el estado del usuario ${id} a tipo_usuario ${tipo_usuario}`);

    // Verificar que tipo_usuario sea 2 o 3
    if (![2, 3].includes(tipo_usuario)) {
        return res.status(400).json({ message: 'El tipo de usuario debe ser 2 (activo) o 3 (desactivado).' });
    }

    const query = 'UPDATE usuario SET tipo_usuario = ? WHERE id = ?';

    db.query(query, [tipo_usuario, id], (err, results) => {
        if (err) {
            console.error('Error al actualizar el estado del usuario:', err);
            return res.status(500).json({ message: 'Error al actualizar el estado del usuario.' });
        }

        if (results.affectedRows > 0) {
            return res.status(200).json({ message: 'Estado del usuario actualizado correctamente.' });
        } else {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
    });
});

// Ruta POST para cambiar la contraseña de un usuario (sin verificación)
app.post('/cambiar-contrasena', (req, res) => {
    const { id, newPassword } = req.body;

    if (!id || !newPassword) {
        return res.status(400).json({ message: 'El ID de usuario y la nueva contraseña son obligatorios.' });
    }

    const query = 'UPDATE usuario SET password = ? WHERE id = ?';

    db.query(query, [newPassword, id], (err, results) => {
        if (err) {
            console.error('Error al cambiar la contraseña:', err);
            return res.status(500).json({ message: 'Error al actualizar la contraseña.' });
        }

        if (results.affectedRows > 0) {
            return res.status(200).json({ message: 'Contraseña actualizada correctamente.' });
        } else {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
    });
});

// Middleware para manejar rutas no encontradas
app.use((req, res) => {
    console.log('Ruta no encontrada:', req.method, '-', req.url);
    return res.status(404).send({ "msg": "ruta inválida" });
});

// Iniciar servidor:
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
