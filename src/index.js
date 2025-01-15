// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client'; // Cambia esto
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importar Bootstrap
import './index.css'; // Si tienes estilos globales

const root = ReactDOM.createRoot(document.getElementById('root')); // Cambia esto
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
