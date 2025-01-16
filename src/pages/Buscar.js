// src/pages/Buscar.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Importa Link

const Buscar = ({ articulos }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredArticulos, setFilteredArticulos] = useState([]);

  // Filtrar artículos según el término de búsqueda (por ID)
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredArticulos(articulos); // Si no hay término de búsqueda, mostrar todos los artículos
    } else {
      const results = articulos.filter(articulo =>
        articulo.id_articulo && articulo.id_articulo.toString().includes(searchTerm.trim())
      );
      console.log('Resultados filtrados:', results);
      setFilteredArticulos(results);
    }
  }, [searchTerm, articulos]);

  return (
    <div className="buscar">
      <h1>Buscar Artículos</h1>
      <input
        type="text"
        placeholder="Buscar por ID..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} // Actualiza el término de búsqueda
        className="search-input"
      />
      <button onClick={() => setSearchTerm(searchTerm)}>Buscar</button>

      <table className="articulos-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Descripción</th>
            <th>Marca</th>
            <th>Modelo</th>
            <th>Propietario</th>
            <th>Último Mantenimiento</th>
            <th>Técnico</th>
            <th>Ver QR</th>
          </tr>
        </thead>
        <tbody>
          {filteredArticulos.length > 0 ? (
            filteredArticulos.map((articulo) => (
              <tr key={articulo.id_articulo}>
                {/* Enlace al detalle del artículo */}
                <td><Link to={`/articulo/${articulo.id_articulo}`}>{articulo.id_articulo}</Link></td>
                <td>{articulo.articulo}</td>
                <td>{articulo.marca}</td>
                <td>{articulo.modelo}</td>
                <td>{articulo.propietario}</td>
                <td>{new Date(articulo.ultimo_mantenimiento).toLocaleDateString()}</td>
                <td>{articulo.nombre_trabajador}</td>
                {/* Enlace al código QR */}
                <td><Link to={`/qr/${articulo.id_articulo}`}>Ver QR</Link></td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">No se encontraron artículos.</td> {/* Mensaje cuando no hay resultados */}
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Buscar;
