// src/App.js
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavigationBar from './components/Navbar';
import Home from './pages/Home';
import Nosotros from './pages/Nosotros';
import Contactanos from './pages/Contactanos';
import Buscar from './pages/Buscar';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <div className="App">
        <NavigationBar />
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/nosotros" element={<Nosotros />} />
            <Route path="/contactanos" element={<Contactanos />} />
            <Route path="/buscar" element={<Buscar />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
