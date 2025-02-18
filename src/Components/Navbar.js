// src/components/Navbar.js
import React from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaCog } from 'react-icons/fa'; // Icono de configuración
import './Navbar.css';

const NavigationBar = ({ isLoggedIn, onLogout }) => {
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand as={Link} to="/">SAMG</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ms-auto">
          <Nav.Link as={Link} to="/">Home</Nav.Link>
          <Nav.Link as={Link} to="/nosotros">Nosotros</Nav.Link>
          <Nav.Link as={Link} to="/contactanos">Contáctanos</Nav.Link>
          <Nav.Link as={Link} to="/buscar">Buscar</Nav.Link>
          {isLoggedIn ? (
            <>
              <Button variant="outline-primary" onClick={onLogout}>
                Logout
              </Button>
              {/* El enlace a configuración */}
              <Link to="/configuracion" style={{ marginLeft: '10px' }}>
                <FaCog size={20} /> {/* Icono de tuerca */}
              </Link>
            </>
          ) : (
            <Button variant="outline-primary" as={Link} to="/login">
              Login
            </Button>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavigationBar;
