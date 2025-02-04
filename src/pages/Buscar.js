// src/pages/Buscar.js

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Buscar.css';

const Buscar = ({ articulos, isLoggedIn }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Número de artículos por página

    // Filtrar artículos según el término de búsqueda
    const filteredArticulos = articulos.filter((articulo) =>
        articulo.id_articulo && articulo.id_articulo.toString().includes(searchTerm.trim())
    );

    // Calcular los índices de los artículos a mostrar
    const indexOfLastArticle = currentPage * itemsPerPage;
    const indexOfFirstArticle = indexOfLastArticle - itemsPerPage;
    const currentArticles = filteredArticulos.slice(indexOfFirstArticle, indexOfLastArticle);

    // Cambiar de página
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="buscar">
            <h1>Buscar Artículos</h1>
            <div className="button-container">
                <input
                    type="text"
                    placeholder="Buscar por ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                <button onClick={() => setSearchTerm(searchTerm)} className="search-button">Buscar</button>

                {isLoggedIn && (
                    <Link to="/agregar">
                        <button className="add-button">Agregar</button>
                    </Link>
                )}
            </div>

            <table className="articulos-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Herramienta</th>
                        <th>Marca</th>
                        <th>Modelo</th>
                        <th>Propietario</th>
                        <th>Último Mantenimiento</th>
                        <th>Técnico</th>
                        <th>Ver QR</th>
                    </tr>
                </thead>
                <tbody>
                    {currentArticles.length > 0 ? (
                        currentArticles.map((articulo) => (
                            <tr key={articulo.id_articulo}>
                                <td data-label="ID">
                                    <Link to={`/articulo/${articulo.id_articulo}`}>
                                        {articulo.id_articulo}
                                    </Link>
                                </td>
                                <td data-label="Descripción">{articulo.articulo}</td>
                                <td data-label="Marca">{articulo.marca}</td>
                                <td data-label="Modelo">{articulo.modelo}</td>
                                <td data-label="Propietario">{articulo.propietario}</td>
                                <td data-label="Último Mantenimiento">
                                    {new Date(articulo.ultimo_mantenimiento).toLocaleDateString()}
                                </td>
                                <td data-label="Técnico">{articulo.nombre_trabajador}</td>
                                <td data-label="Ver QR">
                                    <Link to={`/qr/${articulo.id_articulo}`}>Ver QR</Link>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8">No se encontraron artículos.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Controles de Paginación */}
            {filteredArticulos.length > itemsPerPage && (
                <nav aria-label="Page navigation example" className="pagination-container">
                    <ul className="pagination justify-content-center">
                        {/* Botón anterior */}
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            {/* Evitar comportamiento predeterminado con preventDefault */}
                            <button
                                className="page-link"
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                &laquo;
                            </button>
                        </li>

                        {/* Botones de página */}
                        {[...Array(Math.ceil(filteredArticulos.length / itemsPerPage)).keys()].map((number) => (
                            <li key={number + 1} className={`page-item ${currentPage === number + 1 ? 'active' : ''}`}>
                                {/* Evitar comportamiento predeterminado con preventDefault */}
                                <button
                                    className="page-link"
                                    onClick={() => paginate(number + 1)}
                                >
                                    {number + 1}
                                </button>
                            </li>
                        ))}

                        {/* Botón siguiente */}
                        <li className={`page-item ${currentPage === Math.ceil(filteredArticulos.length / itemsPerPage) ? 'disabled' : ''}`}>
                            {/* Evitar comportamiento predeterminado con preventDefault */}
                            <button
                                className="page-link"
                                onClick={() => paginate(currentPage + 1)}
                                disabled={currentPage === Math.ceil(filteredArticulos.length / itemsPerPage)}
                            >
                                &raquo;
                            </button>
                        </li>
                    </ul>
                </nav>
            )}
        </div>
    );
};

export default Buscar;
