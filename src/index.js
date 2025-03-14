// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client'; // Cambia esto
import App from './App';


const root = ReactDOM.createRoot(document.getElementById('root')); // Cambia esto
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
