import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import './Login.css';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate(); // Inicializar useNavigate

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3001/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message);
                onLogin(); // Llamar a la función onLogin para manejar el estado de autenticación
                navigate('/'); // Redirigir a la página de inicio
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('Error en la conexión al servidor');
        }
    };

    return (
        <div className="box">
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    placeholder="Nombre de usuario" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    required 
                />
                <input 
                    type="password" 
                    placeholder="Contraseña" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                />
                <input type="submit" value="Iniciar Sesión" />
            </form>
            {message && <p>{message}</p>} {/* Mostrar mensajes de error o éxito */}
        </div>
    );
};

export default Login;
