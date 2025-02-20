import React, { useState, useEffect } from 'react';

const GestionarUsuario = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState('');

    useEffect(() => {
        fetchUsuarios();
    }, []);

    const fetchUsuarios = async () => {
        try {
            const response = await fetch('http://localhost:3001/usuarios'); // Reemplaza con tu endpoint
            if (!response.ok) {
                throw new Error('Error al obtener los usuarios');
            }
            const data = await response.json();
            setUsuarios(data);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleCambiarContraseña = async (idUsuario) => {
        const nuevaContraseña = prompt('Ingrese la nueva contraseña:');
        if (!nuevaContraseña) return;

        try {
            const response = await fetch('http://localhost:3001/cambiar-contrasena', { // Cambiar a POST
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: idUsuario, newPassword: nuevaContraseña }), // Cambiar a newPassword
            });

            if (!response.ok) {
                throw new Error('Error al cambiar la contraseña');
            }

            setMensaje('Contraseña cambiada exitosamente');
            fetchUsuarios(); // Refresh the user list
        } catch (err) {
            setError(err.message);
        }
    };

    const handleActivarDesactivar = async (idUsuario, activo) => {
        try {
            const response = await fetch(`http://localhost:3001/usuarios/${idUsuario}/activar-desactivar`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ activo: !activo }), // Invertir el estado actual
            });

            if (!response.ok) {
                throw new Error('Error al activar/desactivar el usuario');
            }

            setMensaje('Estado del usuario actualizado');
            fetchUsuarios(); // Actualizar lista de usuarios
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div>
            <h2>Gestionar Usuarios</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {mensaje && <p style={{ color: 'green' }}>{mensaje}</p>}
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
                    {usuarios.map((usuario) => (
                        <tr key={usuario.id}>
                            <td>{usuario.nombre}</td>
                            <td>{usuario.username}</td>
                            <td>{usuario.activo ? 'Sí' : 'No'}</td>
                            <td>
                                <button className="btn btn-primary" onClick={() => handleCambiarContraseña(usuario.id)}>Cambiar Contraseña</button>
                                <button className="btn btn-warning" onClick={() => handleActivarDesactivar(usuario.id, usuario.activo)}>
                                    {usuario.activo ? 'Desactivar' : 'Activar'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default GestionarUsuario;
