import React, { useState } from 'react';

function CambiarContrasena() {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const userId = 1; // Reemplaza con el ID del usuario logueado

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setMessage('Las nuevas contraseñas no coinciden.');
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/cambiar-contrasena', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id_usuario: userId,
                    oldPassword: oldPassword,
                    newPassword: newPassword,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message);
            } else {
                setMessage(data.message || 'Error al cambiar la contraseña.');
            }
        } catch (error) {
            setMessage('Error al cambiar la contraseña.');
        }
    };

    return (
        <div>
            <h2>Cambiar Contraseña</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Contraseña Actual:</label>
                    <input
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Nueva Contraseña:</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Confirmar Nueva Contraseña:</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Cambiar Contraseña</button>
                {message && <p>{message}</p>}
            </form>
        </div>
    );
}

export default CambiarContrasena;
