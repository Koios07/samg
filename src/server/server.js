const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Configuración de la base de datos
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'samg_db'
});

db.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
    } else {
        console.log('Conectado a la base de datos MySQL');
    }
});

// Ruta para el registro de usuarios
app.post('/registro', async (req, res) => {
    const { username, password, tipo_usuario, nombre } = req.body;

    console.log('Intento de registro:', { username, tipo_usuario, nombre });

    // Verificar si el nombre de usuario ya existe
    const checkUsernameQuery = 'SELECT * FROM usuario WHERE username = ?';
    db.query(checkUsernameQuery, [username], async (err, result) => {
        if (err) {
            console.error('Error al verificar el nombre de usuario:', err);
            return res.status(500).json({ message: 'Error al verificar el nombre de usuario.' });
        }

        if (result.length > 0) {
            return res.status(400).json({ message: 'El nombre de usuario ya está en uso.' });
        }

        // Insertar el nuevo usuario en la base de datos
        const insertUserQuery = 'INSERT INTO usuario (username, password, tipo_usuario, nombre) VALUES (?, ?, ?, ?)';
        db.query(insertUserQuery, [username, password, tipo_usuario, nombre], (err, result) => {
            if (err) {
                console.error('Error al registrar el usuario:', err);
                return res.status(500).json({ message: 'Error al registrar el usuario.' });
            }

            res.status(201).json({ message: 'Usuario registrado exitosamente.' });
        });
    });
});

// Ruta para el inicio de sesión
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    console.log('Intento de inicio de sesión:', { username });

    const query = 'SELECT * FROM usuario WHERE username = ?';
    db.query(query, [username], async (err, result) => {
        if (err) {
            console.error('Error al buscar el usuario:', err);
            return res.status(500).json({ message: 'Error al iniciar sesión.' });
        }

        console.log('Resultado de la consulta:', result);

        if (result.length === 0) {
            console.log('Usuario no encontrado.');
            return res.status(401).json({ message: 'Credenciales incorrectas.' });
        }

        const user = result[0];

        //Comparar la contraseña ingresada con la contraseña de la base de datos
        if (password === user.password) {
            // Enviar la información del usuario
            res.json({ userId: user.id, nombre: user.nombre, userType: user.tipo_usuario });
        } else {
            console.log('Contraseña incorrecta.');
            res.status(401).json({ message: 'Credenciales incorrectas.' });
        }
    });
});

// Ruta para obtener todos los usuarios
app.get('/usuarios', (req, res) => {
    console.log('Obteniendo usuarios');
    const query = 'SELECT id, username, tipo_usuario, nombre FROM usuario';
    db.query(query, (err, result) => {
        if (err) {
            console.error('Error al obtener los usuarios:', err);
            return res.status(500).json({ message: 'Error al obtener los usuarios.' });
        }

        res.json(result);
    });
});

// Ruta para actualizar el tipo de usuario
app.put('/usuarios/:id', async (req, res) => {
    const userId = req.params.id;
    const { tipo_usuario } = req.body;

    console.log(`Actualizando tipo de usuario para ID ${userId} a tipo ${tipo_usuario}`);

    const query = 'UPDATE usuario SET tipo_usuario = ? WHERE id = ?';
    db.query(query, [tipo_usuario, userId], (err, result) => {
        if (err) {
            console.error('Error al actualizar el tipo de usuario:', err);
            return res.status(500).json({ message: 'Error al actualizar el tipo de usuario.' });
        }

        res.json({ message: 'Tipo de usuario actualizado exitosamente.' });
    });
});

// Ruta para obtener todos los artículos
app.get('/herramientas', (req, res) => {
    console.log('Obteniendo todos los articulos');
    const query = 'SELECT * FROM herramientas';
    db.query(query, (err, result) => {
        if (err) {
            console.error('Error al obtener los artículos:', err);
            return res.status(500).json({ message: 'Error al obtener los artículos.' });
        }
        res.json(result);
    });
});

// Ruta para agregar un nuevo artículo y su historial de mantenimiento
app.post('/herramientas', (req, res) => {
    const { herramienta, marca, modelo, propietario, fecha_entrada, nombre_trabajador, nit, descripcion_dano, fecha_mantenimiento, descripcion_mantenimiento } = req.body;
    console.log('Agregando un nuevo articulo y su historial de mantenimiento');
    // Verificar que se proporcionen los datos del historial de mantenimiento
    if (!descripcion_dano || !fecha_mantenimiento || !descripcion_mantenimiento) {
        return res.status(400).json({ message: 'Todos los campos del historial de mantenimiento son obligatorios.' });
    }

    // Insertar la herramienta en la tabla herramientas
    const queryHerramienta = 'INSERT INTO herramientas (herramienta, marca, modelo, propietario, fecha_entrada, nombre_trabajador, nit) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(queryHerramienta, [herramienta, marca, modelo, propietario, fecha_entrada, nombre_trabajador, nit], (err, resultHerramienta) => {
        if (err) {
            console.error('Error al agregar el artículo:', err);
            return res.status(500).json({ message: 'Error al agregar el artículo.' });
        }

        const id_articulo = resultHerramienta.insertId;

        // Insertar el historial de mantenimiento en la tabla historial_mantenimiento
        const queryHistorial = 'INSERT INTO historial_mantenimiento (id_herramienta, fecha_mantenimiento, descripcion_dano, descripcion_mantenimiento, nombre_tecnico, nit_propietario) VALUES (?, ?, ?, ?, ?, ?)';
        db.query(queryHistorial, [id_articulo, fecha_mantenimiento, descripcion_dano, descripcion_mantenimiento, nombre_trabajador, nit], (err, resultHistorial) => {
            if (err) {
                console.error('Error al agregar el historial de mantenimiento:', err);
                return res.status(500).json({ message: 'Error al agregar el historial de mantenimiento.' });
            }

            res.status(201).json({ message: 'Artículo agregado exitosamente con su historial de mantenimiento.', id_articulo });
        });
    });
});

// Ruta para obtener un artículo por su ID
app.get('/herramientas/:id', (req, res) => {
    const articuloId = req.params.id;
    console.log(`Obteniendo articulo por ID: ${articuloId}`);
    const query = 'SELECT * FROM herramientas WHERE id_articulo = ?';
    db.query(query, [articuloId], (err, result) => {
        if (err) {
            console.error('Error al obtener el artículo:', err);
            return res.status(500).json({ message: 'Error al obtener el artículo.' });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: 'Artículo no encontrado.' });
        }

        res.json(result[0]);
    });
});

// Ruta para actualizar un artículo existente
app.put('/herramientas/:id', (req, res) => {
    const articuloId = req.params.id;
    const { herramienta, marca, modelo, propietario, fecha_entrada, nombre_trabajador, nit } = req.body;
    console.log(`Actualizando articulo con ID: ${articuloId}`);
    const query = 'UPDATE herramientas SET herramienta = ?, marca = ?, modelo = ?, propietario = ?, fecha_entrada = ?, nombre_trabajador = ?, nit = ? WHERE id_articulo = ?';
    db.query(query, [herramienta, marca, modelo, propietario, fecha_entrada, nombre_trabajador, nit, articuloId], (err, result) => {
        if (err) {
            console.error('Error al actualizar el artículo:', err);
            return res.status(500).json({ message: 'Error al actualizar el artículo.' });
        }

        res.json({ message: 'Artículo actualizado exitosamente.' });
    });
});

// Ruta para eliminar un artículo
app.delete('/herramientas/:id', (req, res) => {
    const articuloId = req.params.id;
    console.log(`Eliminando articulo con ID: ${articuloId}`);
    const query = 'DELETE FROM herramientas WHERE id_articulo = ?';
    db.query(query, [articuloId], (err, result) => {
        if (err) {
            console.error('Error al eliminar el artículo:', err);
            return res.status(500).json({ message: 'Error al eliminar el artículo.' });
        }

        res.json({ message: 'Artículo eliminado exitosamente.' });
    });
});

// Ruta para cambiar la contraseña
app.put('/cambiar-contrasena', async (req, res) => {
    const { userId, oldPassword, newPassword } = req.body;

    console.log(`Cambiando la contraseña del usuario con ID: ${userId}`);

    // Verificar si el usuario que realiza la acción es el mismo que está intentando cambiar la contraseña
    const userQuery = 'SELECT id FROM usuario WHERE id = ?';
    db.query(userQuery, [req.header('user-id')], (err, userResult) => {
        if (err) {
            console.error('Error al verificar la existencia del usuario:', err);
            return res.status(500).json({ message: 'Error al cambiar la contraseña.' });
        }

        if (userResult.length === 0) {
            console.log('Usuario no encontrado.');
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        if (oldPassword) {
            // Verificar la contraseña actual
            const checkPasswordQuery = 'SELECT password FROM usuario WHERE id = ?';
            db.query(checkPasswordQuery, [userId], (err, passwordResult) => {
                if (err) {
                    console.error('Error al verificar la contraseña:', err);
                    return res.status(500).json({ message: 'Error al cambiar la contraseña.' });
                }

                const storedPassword = passwordResult[0].password;

                // Comparar la contraseña ingresada con la contraseña de la base de datos
                if (oldPassword !== storedPassword) {
                    console.log('Contraseña incorrecta.');
                    return res.status(401).json({ message: 'Contraseña incorrecta.' });
                }

                // Actualizar la contraseña en la base de datos
                const updateQuery = 'UPDATE usuario SET password = ? WHERE id = ?';
                db.query(updateQuery, [newPassword, userId], (err, result) => {
                    if (err) {
                        console.error('Error al actualizar la contraseña:', err);
                        return res.status(500).json({ message: 'Error al cambiar la contraseña.' });
                    }

                    res.status(200).json({ message: 'Contraseña cambiada exitosamente.' });
                });
            });
        } else {
            // Si no se proporciona la contraseña actual, verificar permisos de administrador
            const adminQuery = 'SELECT tipo_usuario FROM usuario WHERE id = ?';
            db.query(adminQuery, [req.header('user-id')], (err, adminResult) => {
                if (err) {
                    console.error('Error al verificar el tipo de usuario:', err);
                    return res.status(500).json({ message: 'Error al cambiar la contraseña.' });
                }

                if (adminResult.length === 0) {
                    console.log('No se proporcionó el ID del usuario.');
                    return res.status(404).json({ message: 'No se proporcionó el ID del usuario.' });
                }

                const admin = adminResult[0];

                if (admin.tipo_usuario !== '1') {
                    console.log('No es administrador.');
                    return res.status(403).json({ message: 'No tienes permisos para realizar esta acción.' });
                }

                // Actualizar la contraseña en la base de datos
                const updateQuery = 'UPDATE usuario SET password = ? WHERE id = ?';
                db.query(updateQuery, [newPassword, userId], (err, result) => {
                    if (err) {
                        console.error('Error al actualizar la contraseña:', err);
                        return res.status(500).json({ message: 'Error al cambiar la contraseña.' });
                    }

                    res.status(200).json({ message: 'Contraseña cambiada exitosamente.' });
                });
            });
        }
    });
});

// Ruta para importar herramientas desde un archivo Excel
app.post('/importar-herramientas', (req, res) => {
    const herramientas = req.body;
    console.log('Importando articulos desde excel');
    if (!Array.isArray(herramientas)) {
        return res.status(400).json({ message: 'Se requiere un array de herramientas.' });
    }

    // Validar que cada herramienta tenga los campos requeridos
    for (const herramienta of herramientas) {
        if (!herramienta.herramienta || !herramienta.marca || !herramienta.modelo || !herramienta.propietario || !herramienta.nit || !herramienta.fecha_entrada || !herramienta.nombre_trabajador) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios para cada herramienta.' });
        }
    }

    // Insertar las herramientas en la base de datos
    const query = 'INSERT INTO herramientas (herramienta, marca, modelo, propietario, fecha_entrada, nombre_trabajador, nit) VALUES ?';
    const values = herramientas.map(herramienta => [herramienta.herramienta, herramienta.marca, herramienta.modelo, herramienta.propietario, herramienta.fecha_entrada, herramienta.nombre_trabajador, herramienta.nit]);

    db.query(query, [values], (err, result) => {
        if (err) {
            console.error('Error al insertar en la base de datos:', err);
            return res.status(500).json({ message: 'Error al guardar las herramientas.' });
        }

        res.status(201).json({ message: 'Herramientas importadas exitosamente.' });
    });
});

app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});
