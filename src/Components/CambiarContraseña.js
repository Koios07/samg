import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function CambiarContrasena({ userId: initialUserId }) {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const [userId, setUserId] = useState(initialUserId); // Use useState to manage userId

    useEffect(() => {
        // If initialUserId prop is not available, try to get it from localStorage
        if (!initialUserId) {
            const storedUserId = localStorage.getItem('userId');
            if (storedUserId) {
                setUserId(parseInt(storedUserId, 10));
            } else {
                console.error("Error: No se encontró el ID del usuario en localStorage.");
                // Consider redirecting to login if userId is essential
            }
        } else {
            setUserId(initialUserId); // set userId to the initialUserId prop
        }
    }, [initialUserId, setUserId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if any field is empty
        if (!oldPassword || !newPassword || !confirmPassword) {
            setMessage('Todos los campos son obligatorios.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setMessage('Las nuevas contraseñas no coinciden.');
            return;
        }

        if (!userId) {
            setMessage('Error: No se encontró el ID del usuario.');
            return;
        }

        console.log("Enviando petición a /cambiar-contrasena con userId:", userId);

        try {
            const response = await fetch('http://localhost:3001/cambiar-contrasena', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: userId, // Use "id" instead of "id_usuario"
                    oldPassword: oldPassword,
                    newPassword: newPassword
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message);
                navigate('/configuracion');
            } else {
                setMessage(data.message || 'Error al cambiar la contraseña.');
            }
        } catch (error) {
            setMessage('Error al cambiar la contraseña.');
        }
    };

    const handleCancel = () => {
        navigate('/configuracion');
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
                <button type="button" onClick={handleCancel}>Cancelar</button>
                {message && <p>{message}</p>}
            </form>
        </div>
    );
}

export default CambiarContrasena;
