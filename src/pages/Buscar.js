// src/pages/Buscar.js

import React from 'react';
import { Link } from 'react-router-dom';
import './Buscar.css'; // Importa el CSS correctamente

const Buscar = ({ articulos, isLoggedIn }) => {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [filteredArticulos, setFilteredArticulos] = React.useState([]);

    React.useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredArticulos(articulos);
        } else {
            const results = articulos.filter(articulo =>
                articulo.id_articulo && articulo.id_articulo.toString().includes(searchTerm.trim())
            );
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
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
            />
            <button onClick={() => setSearchTerm(searchTerm)}>Buscar</button>

            {isLoggedIn && (
                <Link to="/agregar">
                    <button className="add-button">Agregar</button>
                </Link>
            )}

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
                              <td data-label="ID"><Link to={`/articulo/${articulo.id_articulo}`}>{articulo.id_articulo}</Link></td>
                              <td data-label="Descripción">{articulo.articulo}</td>
                              <td data-label="Marca">{articulo.marca}</td>
                              <td data-label="Modelo">{articulo.modelo}</td>
                              <td data-label="Propietario">{articulo.propietario}</td>
                              <td data-label="Último Mantenimiento">{new Date(articulo.ultimo_mantenimiento).toLocaleDateString()}</td>
                              <td data-label="Técnico">{articulo.nombre_trabajador}</td>
                              <td data-label="Ver QR"><Link to={`/qr/${articulo.id_articulo}`}>Ver QR</Link></td>
                          </tr>
                      ))
                  ) : (
                      <tr><td colSpan="8">No se encontraron artículos.</td></tr>
                  )}
              </tbody>
          </table>
        </div>
    );
};

export default Buscar;
