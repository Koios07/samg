import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(''); // Mensaje del modal
    const [showModal, setShowModal] = useState(false); // Estado para mostrar/ocultar el modal
    const navigate = useNavigate();

    // Función para cerrar el modal
    const handleCloseModal = () => {
        setShowModal(false);
        setMessage('');
    };

    // Función para manejar el envío del formulario
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
                localStorage.setItem('userType', data.tipo_usuario);
                onLogin(data.userId, data.tipo_usuario);
                navigate('/'); // Redirigir al home
            } else {
                // Mostrar mensaje en el modal según el tipo de error
                if (response.status === 403) {
                    setMessage('¡Sapo perro asquero! Por favor, comuníquese con administración.');
                    setShowModal(true); // Mostrar el modal
                } else {
                    setMessage(data.message || 'Error al iniciar sesión.');
                    setShowModal(true); // Mostrar el modal
                }
            }
        } catch (error) {
            console.error('Error en la conexión:', error);
            setMessage('Error al iniciar sesión. Por favor, intente nuevamente más tarde.');
            setShowModal(true); // Mostrar el modal en caso de error de conexión
        }
    };

    return (
        <div>
            <h2>Iniciar Sesión</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Usuario:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Contraseña:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
