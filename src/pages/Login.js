import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3001/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message);
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userId', data.userId); // Guardar el ID del usuario
                onLogin(data.userId); // Llama a la función onLogin para actualizar el estado en App.js
                navigate('/'); // Redirige al Home
            } else {
                setMessage(data.message || 'Error al iniciar sesión.');
            }
        } catch (error) {
            setMessage('Error al iniciar sesión.');
        }
    };

    return (
        <div>
            <h2>Iniciar Sesión</h2>
            {message && <p>{message}</p>}
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
        </div>
    );
};

export default Login;
