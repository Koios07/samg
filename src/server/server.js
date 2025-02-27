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

// Middleware para verificar el tipo de usuario
const verificarTipoUsuario = (tiposPermitidos) => {
    return (req, res, next) => {
        const userId = req.headers['user-id']; // Obtén el ID del usuario del header
        if (!userId) {
            return res.status(401).json({ message: 'No autorizado' });
        }

        const query = 'SELECT tipo_usuario FROM usuario WHERE id = ?';
        db.query(query, [userId], (err, results) => {
            if (err) {
                console.error("Error en la consulta:", err);
                return res.status(500).json({ message: "Error en el servidor." });
            }

            if (results.length === 0) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            const tipoUsuario = results[0].tipo_usuario;

            // Depuración: Verificar los valores
            console.log('Tipo de usuario desde la base de datos:', tipoUsuario);
            console.log('Tipos permitidos:', tiposPermitidos);

            // Asegurarnos de que tipo_usuario sea una cadena para la comparación
            if (typeof tipoUsuario !== 'string') {
                console.log(`Convirtiendo tipo_usuario (${tipoUsuario}) a cadena`);
                tipoUsuario = tipoUsuario.toString();  // Convertir a cadena
            }

            // Verificar si el tipo de usuario está en los tipos permitidos
            if (!tiposPermitidos.includes(tipoUsuario)) {
                console.log(`El tipo de usuario ${tipoUsuario} no tiene permisos.`);
                return res.status(403).json({ message: 'No tiene permisos para acceder a este recurso.' });
            }

            // Si todo está bien, continúa con la siguiente función
            next();
        });
    };
};

// Rutas GET (obtener datos)
// Ruta GET para obtener todas las herramientas
app.get("/herramientas", (req, res) => {
    db.query("SELECT * FROM herramientas", (err, results) => {
        if (err) {
            console.error("Error en la consulta a la base de datos:", err);
            return res.status(500).json({ error: "Error en la consulta a la base de datos" });
        }
        res.json(results);
    });
});

// Ruta GET para obtener una herramienta por ID
app.get("/herramientas/:id", (req, res) => {
    const articuloId = req.params.id;

    const query = "SELECT * FROM herramientas WHERE id_articulo = ?";
    db.query(query, [articuloId], (err, results) => {
        if (err) {
            console.error("Error al obtener la herramienta:", err);
            return res.status(500).json({ error: "Error en la base de datos" });
        }

        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).json({ message: "Herramienta no encontrada" });
        }
    });
});

// Rutas POST (crear datos)
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
            if (results[0].tipo_usuario === '3') {
                return res.status(403).json({
                    message: "Por favor, comunícate con administración.",
                });
            }

            res.status(200).json({
                message: "Inicio de sesión exitoso.",
                userId: results[0].id,
                tipo_usuario: results[0].tipo_usuario,  // Devolvemos el tipo_usuario
            });
        } else {
            res.status(401).json({ message: "Credenciales incorrectas." });
        }
    });
});

// Ruta POST para agregar una herramienta (solo accesible para usuarios tipo 1 y 2)
app.post("/herramientas", verificarTipoUsuario(['1', '2']), (req, res) => {
    const {
        herramienta,
        marca,
        modelo,
        propietario,
        nit,
        ultimo_mantenimiento,
        nombre_trabajador,
    } = req.body;

    if (
        !herramienta ||
        !marca ||
        !modelo ||
        !propietario ||
        !nit ||
        !ultimo_mantenimiento ||
        !nombre_trabajador
    ) {
        return res
            .status(400)
            .json({ message: "Todos los campos son obligatorios." });
    }

    const query = `
        INSERT INTO herramientas (herramienta, marca, modelo, propietario, nit, ultimo_mantenimiento, nombre_trabajador)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        query,
        [
            herramienta,
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
                return res.status(500).json({ message: "Error al guardar la herramienta." });
            }

            res.status(201).json({
                message: "Herramienta agregada exitosamente.",
                id_articulo: result.insertId,
            });
        }
    );
});

// Ruta POST para crear un nuevo usuario (solo accesible para usuarios tipo 1)
app.post("/usuarios", verificarTipoUsuario(['1']), (req, res) => {
    const { nombre, username, password, tipo_usuario } = req.body;
    const userId = req.headers['user-id'];

    console.log("Datos recibidos del frontend:", { nombre, username, password, tipo_usuario });
    console.log('UserID recibidos en la creacion del usuario', userId);

    if (!nombre || !username || !password || !tipo_usuario) {
        return res.status(400).json({ message: "Todos los campos son obligatorios." });
    }

    // Primero, verifica si el nombre de usuario ya existe
    const checkQuery = "SELECT COUNT(*) AS count FROM usuario WHERE username = ?";
    db.query(checkQuery, [username], (checkErr, checkResults) => {
        if (checkErr) {
            console.error("Error al verificar el usuario:", checkErr);
            return res.status(500).json({ message: "Error al verificar el usuario." });
        }

        console.log("Resultados de la consulta de verificación:", checkResults);

        const count = checkResults[0].count;
        if (count > 0) {
            // Si el nombre de usuario ya existe, devuelve un error
            return res.status(400).json({ message: "El nombre de usuario ya existe. Por favor, elige otro." });
        }

        // Si el nombre de usuario no existe, procede a crear el nuevo usuario
        const insertQuery = `
            INSERT INTO usuario (nombre, username, password, tipo_usuario)
            VALUES (?, ?, ?, ?)
        `;

        db.query(
            insertQuery,
            [nombre, username, password, tipo_usuario],
            (insertErr, insertResult) => {
                if (insertErr) {
                    console.error("Error al crear el usuario:", insertErr);
                    return res.status(500).json({ message: "Error al crear el usuario: " + insertErr.message });
                }

                res.status(201).json({ message: "Usuario creado exitosamente." });
            }
        );
    });
});
// Ruta GET para obtener todos los usuarios (solo accesible para usuarios tipo 1)
app.get("/usuarios", verificarTipoUsuario(['1']), (req, res) => {
     const userId = req.headers['user-id'];
    console.log('userId recibido en usuarios: ', userId);
    const query = "SELECT * FROM usuario";
    db.query(query, (err, results) => {
        if (err) {
            console.error("Error al obtener los usuarios:", err);
            return res.status(500).json({ message: "Error al obtener los usuarios." });
        }
        res.json(results);
    });
});
// Ruta PUT para activar/desactivar un usuario (solo accesible para usuarios tipo 1)
app.put("/usuarios/:id/activar-desactivar", verificarTipoUsuario(['1']), (req, res) => {
    const { id } = req.params;
    const { tipo_usuario } = req.body;

    const query = "UPDATE usuario SET tipo_usuario = ? WHERE id = ?";
    db.query(query, [tipo_usuario, id], (err, result) => {
        if (err) {
            console.error("Error al activar/desactivar el usuario:", err);
            return res.status(500).json({ message: "Error al activar/desactivar el usuario." });
        }
        res.json({ message: "Usuario actualizado exitosamente." });
    });
});

// Ruta PUT para cambiar la contraseña de un usuario (solo accesible para el propio usuario)
app.put("/cambiar-contrasena",verificarTipoUsuario(['1']), (req, res) => {
    const { id, oldPassword, newPassword } = req.body;
     const userId = req.headers['user-id'];
     console.log('userId recibido en cambiar contraseña: ', userId);

   if (!id || !newPassword) {
        return res.status(400).json({ message: "Todos los campos son obligatorios." });
    }

    // Verificar si el usuario que realiza la solicitud es el mismo usuario que se va a modificar
   

    const query = "SELECT * FROM usuario WHERE id = ?";
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error("Error en la consulta:", err);
            return res.status(500).json({ message: "Error en el servidor." });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }

       // Verificar si la contraseña antigua coincide
        

        const updateQuery = "UPDATE usuario SET password = ? WHERE id = ?";
        db.query(updateQuery, [newPassword, id], (err, result) => {
            if (err) {
                console.error("Error al actualizar la contraseña:", err);
                return res.status(500).json({ message: "Error al actualizar la contraseña." });
            }

            res.status(200).json({ message: "Contraseña actualizada exitosamente." });
        });
    });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});
