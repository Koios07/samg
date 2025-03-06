import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import './Login.css';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const handleCloseModal = () => {
        setShowModal(false);
        setMessage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3001/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Si es tipo_usuario 1 o 2, permitir acceso
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userId', data.userId);
                localStorage.setItem('userName', data.nombre);  // Clave correcta para guardar el nombre de usuario
                localStorage.setItem('userType', data.tipo_usuario);
                onLogin(data.userId, data.userType, data.nombre);
                console.log("Nombre de usuario guardado en localStorage:", data.nombre);

                navigate('/buscar');
            } else {
                setMessage(data.message || 'Error al iniciar sesión.');
                setShowModal(true);
            }
        } catch (error) {
            console.error('Error en la conexión:', error);
            setMessage('Error al iniciar sesión. Por favor, intente nuevamente más tarde.');
            setShowModal(true);
        }
    };

    return (
        <div className="login-container">
            <h2>Iniciar Sesión</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Usuario:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        name="username"
                        required
                    />
                </div>
                <div>
                    <label>Contraseña:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        name = "password"
                        required
                    />
                </div>
                <button type="submit">Iniciar Sesión</button>
            </form>

            {/* Modal personalizado */}
            {showModal && (
                <div className="modal-backdrop" style={{ display: 'block' }}>
                    <div className="modal" style={{ display: 'block' }}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Información</h5>
                                    <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                                </div>
                                <div className="modal-body">
                                    <p>{message}</p>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                                        Cerrar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;
