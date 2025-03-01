import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';

function CambiarContrasena({ userId: initialUserId, onClose }) {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [userId, setUserId] = useState(initialUserId);
    const [success, setSuccess] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

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

    useEffect(() => {
        // Obtener el ID del usuario actual desde localStorage al montar el componente
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
            setCurrentUserId(parseInt(storedUserId, 10));
        }
    }, []);

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

        if (!userId) {
            setMessage('Error: No se encontró el ID del usuario.');
            return;
        }
        // Verificar si el usuario actual es el mismo que está intentando cambiar la contraseña
        if (currentUserId !== userId) {
            setMessage('No tienes permiso para cambiar la contraseña de este usuario.');
            return;
        }

        setShowConfirmModal(true);  // Mostrar el modal de confirmación
    };

    const handleChangePassword = async () => {
        setShowConfirmModal(false);

        try {
            const response = await fetch('http://localhost:3001/cambiar-contrasena', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'user-id': userId // Enviar userId desde localStorage
                },
                body: JSON.stringify({
                    oldPassword: oldPassword,
                    newPassword: newPassword,
                }),
            });

            const data = await response.json();
            console.log('Cambiando contraseña - Response:', data); // Agregar console.log

            if (response.ok) {
                 setMessage('Contraseña cambiada exitosamente.');
                setSuccess(true);
                setShowSuccessModal(true); // Mostrar el modal de éxito
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');

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
     const handleCloseSuccessModal = () => {
        setShowSuccessModal(false);
         onClose();
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

            <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Cambio de Contraseña</Modal.Title>
                </Modal.Header>
                <Modal.Body>¿Estás seguro de que quieres cambiar la contraseña?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleChangePassword}>
                        Cambiar Contraseña
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showSuccessModal} onHide={handleCloseSuccessModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Contraseña Cambiada</Modal.Title>
                </Modal.Header>
                <Modal.Body>¡Contraseña cambiada exitosamente!</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleCloseSuccessModal}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default CambiarContrasena;
