import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaCog } from 'react-icons/fa'; // Icono de configuración
import './Navbar.css'; // Importa el archivo CSS
import logo from '../assets/images/logo.png'; // Importa la imagen del logo

const NavigationBar = ({ isLoggedIn, onLogout }) => {
  return (
    <Navbar className="navbar" expand="lg">
      <Navbar.Brand as={Link} to="/">
        <img src={logo} alt="SAMG Logo" />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ms-auto">
          <Nav.Link as={Link} to="/">Home</Nav.Link>
          <Nav.Link as={Link} to="/nosotros">Nosotros</Nav.Link>
          <Nav.Link as={Link} to="/contactanos">Contáctanos</Nav.Link>
          <Nav.Link as={Link} to="/buscar">Buscar</Nav.Link>
          {isLoggedIn ? (
            <>
              <Link to="#" className="logout-button" onClick={onLogout}>
                <button>Logout</button>
              </Link>
              <Link to="/configuracion" className="config-icon-container">
                <FaCog size={18} />
              </Link>

            </>
          ) : (
            <Link to="/login" className="login-button">
              <button>Login</button>
            </Link>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavigationBar;
