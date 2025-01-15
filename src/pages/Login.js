// src/pages/Login.js
import React, { useState } from 'react';
import './Login.css'; // Importa el archivo CSS

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Aquí puedes manejar la lógica de inicio de sesión
    console.log('Usuario:', username);
    console.log('Contraseña:', password);
    
    // Implementa la lógica para autenticar al usuario
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
      </div>
  );
};

export default Login;

