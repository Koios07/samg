import React, { useState, useEffect } from 'react';

function CambiarContrasena({ userId: initialUserId, onClose }) {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [userId, setUserId] = useState(initialUserId);
    const [success, setSuccess] = useState(false); // New state for success message

    // Obtener el userId del localStorage si no se pasa como prop
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

    // Manejar el envío del formulario para cambiar la contraseña
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccess(false); // Reset success state on new submission
        setMessage(''); // Clear any existing messages


        // Validar que todos los campos estén llenos
        if (!oldPassword || !newPassword || !confirmPassword) {
            setMessage('Todos los campos son obligatorios.');
            return;
        }

        // Validar que las contraseñas nuevas coincidan
        if (newPassword !== confirmPassword) {
            setMessage('Las nuevas contraseñas no coinciden.');
            return;
        }

        // Show confirmation dialog
        const confirmChange = window.confirm("¿Estás seguro de que quieres cambiar la contraseña?");
        if (!confirmChange) {
            return; // Do nothing if the user cancels
        }

        // Validar que el userId esté disponible
        if (!userId) {
            setMessage('Error: No se encontró el ID del usuario.');
            return;
        }

        try {
            // Enviar la solicitud al servidor para cambiar la contraseña
            const response = await fetch('http://localhost:3001/cambiar-contrasena', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: userId,
                    oldPassword: oldPassword,
                    newPassword: newPassword,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Mostrar mensaje de éxito, limpiar los campos y mantener visible el componente
                setMessage(''); // Clear the error message
                setSuccess(true); // Set success to true
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                // Mostrar mensaje de error si ocurre un problema
                setMessage(data.message || 'Error al cambiar la contraseña.');
                setSuccess(false); // Ensure success is false on error
            }
        } catch (error) {
            console.error('Error al cambiar la contraseña:', error);
            setMessage('Error al cambiar la contraseña.');
            setSuccess(false); // Ensure success is false on error
        }
    };

    // Manejar el clic en el botón "Atrás" para regresar a configuración
    const handleGoBack = () => {
        onClose(); // Call the onClose function to hide the component
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
                {/* Botón "Atrás" */}
                <button type="button" onClick={handleGoBack}>Atrás</button>
                {/* Mensaje de error o éxito */}
                {message && <p>{message}</p>}
                {success && <p style={{ color: 'green' }}>Contraseña cambiada exitosamente!</p>}
            </form>
        </div>
    );
}

export default CambiarContrasena;
