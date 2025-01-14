// src/App.js
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavigationBar from './components/Navbar';

function App() {
  return (
    <Router>
      <div className="App">
        <NavigationBar />
        <header className="App-header">
          <h1 className="text-center my-4">Bienvenido a SAMG</h1>
        </header> 
        <div className="container">
          <Routes>
            <Route path="/" element={<h2>Home</h2>} />
            <Route path="/nosotros" element={<h2>Nosotros</h2>} />
            <Route path="/contactanos" element={<h2>Contáctanos</h2>} />
            <Route path="/buscar" element={<h2>Buscar</h2>} />
            <Route path="/login" element={<h2>Login</h2>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
