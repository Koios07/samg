import React, { useState, useEffect } from 'react';

function CambiarContrasena({ userId: initialUserId, onClose }) {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [userId, setUserId] = useState(initialUserId);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!initialUserId) {
            const storedUserId = localStorage.getItem('userId');
            if (storedUserId) {
                setUserId(parseInt(storedUserId, 10));
            } else {
                console.error("Error: No se encontró el ID del usuario en localStorage.");
            }
        } else {
            setUserId(initialUserId);
        }
    }, [initialUserId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccess(false);
        setMessage('');

        if (!oldPassword || !newPassword || !confirmPassword) {
            setMessage('Todos los campos son obligatorios.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setMessage('Las nuevas contraseñas no coinciden.');
            return;
        }

        const confirmChange = window.confirm("¿Estás seguro de que quieres cambiar la contraseña?");
        if (!confirmChange) {
            return;
        }

        if (!userId) {
            setMessage('Error: No se encontró el ID del usuario.');
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/cambiar-contrasena', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'user-id': localStorage.getItem('userId')  // Enviar userId desde localStorage
                },
                body: JSON.stringify({
                    id: userId,
                    oldPassword: oldPassword,
                    newPassword: newPassword,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert("Contraseña cambiada exitosamente!");
                setMessage('');
                setSuccess(true);
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
                onClose();
            } else {
                setMessage(data.message || 'Error al cambiar la contraseña.');
                setSuccess(false);
            }
        } catch (error) {
            console.error('Error al cambiar la contraseña:', error);
            setMessage('Error al cambiar la contraseña.');
            setSuccess(false);
        }
    };

    const handleGoBack = () => {
        onClose();
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
                <button type="button" onClick={handleGoBack}>Atrás</button>
                {message && <p>{message}</p>}
                {success && <p style={{ color: 'green' }}></p>}
            </form>
        </div>
    );
}

export default CambiarContrasena;
