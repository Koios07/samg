import React, { useState, useEffect } from 'react';
import Switch from 'react-switch';
import 'bootstrap/dist/css/bootstrap.min.css';

const GestionarUsuario = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(true);

    const fetchUsuarios = async () => {
        try {
            const response = await fetch('http://localhost:3001/usuarios');
            if (!response.ok) {
                throw new Error('Error al obtener los usuarios');
            }
            const data = await response.json();

            // Log para inspeccionar los datos recibidos
            console.log("Datos recibidos de la API:", data);

            // Asegurarse de que los datos son un array
            if (Array.isArray(data)) {
                // Convierte tipo_usuario a número
                const usuariosConTipoNumerico = data.map(usuario => ({
                    ...usuario,
                    tipo_usuario: parseInt(usuario.tipo_usuario, 10)
                }));
                setUsuarios(usuariosConTipoNumerico);
            } else {
                setError('Error: Los datos recibidos no son un array.');
            }
            setCargando(false);
        } catch (err) {
            setError(err.message);
            setCargando(false);
        }
    };

    useEffect(() => {
        fetchUsuarios();
    }, []);

    const handleCambiarContraseña = async (idUsuario) => {
        const nuevaContraseña = prompt('Ingrese la nueva contraseña:');
        if (!nuevaContraseña) return;

        try {
            const response = await fetch('http://localhost:3001/cambiar-contrasena', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: idUsuario, newPassword: nuevaContraseña }),
            });

            if (!response.ok) {
                throw new Error('Error al cambiar la contraseña');
            }

            fetchUsuarios();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleActivarDesactivar = async (idUsuario, tipoUsuario) => {
        const nuevoTipoUsuario = tipoUsuario === 2 ? 3 : 2;

        try {
            const response = await fetch(`http://localhost:3001/usuarios/${idUsuario}/activar-desactivar`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ tipo_usuario: nuevoTipoUsuario }),
            });

            if (!response.ok) {
                throw new Error('Error al activar/desactivar el usuario');
            }

            setUsuarios(prevUsuarios =>
                prevUsuarios.map(usuario =>
                    usuario.id === idUsuario ? { ...usuario, tipo_usuario: nuevoTipoUsuario } : usuario
                )
            );
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div>
            <h2>Gestionar Usuarios</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {cargando ? (
                <p>Cargando usuarios...</p>
            ) : (
                <table className="table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Usuario</th>
                            <th>Activo</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map(usuario => (
                            <tr key={usuario.id}>
                                <td>{usuario.nombre}</td>
                                <td>{usuario.username}</td>
                                <td>
                                    <Switch
                                        checked={usuario.tipo_usuario === 2}
                                        onChange={() => handleActivarDesactivar(usuario.id, usuario.tipo_usuario)}
                                        onColor="#007bff"
                                        onHandleColor="#fff"
                                        offColor="#6c757d"
                                        offHandleColor="#fff"
                                        handleDiameter={20}
                                        uncheckedIcon={false}
                                        checkedIcon={false}
                                        height={28}
                                        width={48}
                                    />
                                </td>
                                <td>
                                    <button className="btn btn-primary" onClick={() => handleCambiarContraseña(usuario.id)}>
                                        Cambiar Contraseña
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default GestionarUsuario;
