// src/components/Navbar.js
import React from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom'; 

const NavigationBar = () => {
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand as={Link} to="/">SAMG</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link as={Link} to="/">Home</Nav.Link>
          <Nav.Link as={Link} to="/nosotros">Nosotros</Nav.Link>
          <Nav.Link as={Link} to="/contactanos">Contáctanos</Nav.Link>
          <Nav.Link as={Link} to="/buscar">Buscar</Nav.Link>
        </Nav>
        <Button variant="outline-primary" as={Link} to="/login">Login</Button>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavigationBar;
