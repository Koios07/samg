import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Buscar.css';

const Buscar = ({ herramientas: initialHerramientas, isLoggedIn, userType }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [herramientasFiltradas, setHerramientasFiltradas] = useState([]);
    const [mostrarTabla, setMostrarTabla] = useState(isLoggedIn);
    const searchInput = useRef(null);  // Crear una referencia

    useEffect(() => {
        if (isLoggedIn) {
            setHerramientasFiltradas(initialHerramientas || []);
            setMostrarTabla(true);
        } else {
            setHerramientasFiltradas([]);
            setMostrarTabla(false);
        }
    }, [initialHerramientas, isLoggedIn]);

    const handleSearch = () => {
        let filtered = initialHerramientas || [];

        if (isLoggedIn) {
            filtered = initialHerramientas?.filter((herramienta) =>
                herramienta.herramienta?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (herramienta.id_articulo && herramienta.id_articulo.toString().includes(searchTerm.trim())) ||
                herramienta.propietario?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (herramienta.nit && herramienta.nit.toString().includes(searchTerm.trim()))
            ) || [];
        } else {
            if (!searchTerm) {
                alert("Por favor, ingrese el NIT y el término de búsqueda.");
                return;
            }

            filtered = initialHerramientas?.filter((herramienta) =>
                (herramienta.herramienta?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (herramienta.id_articulo && herramienta.id_articulo.toString().includes(searchTerm.trim())) ||
                    herramienta.propietario?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (herramienta.nit && herramienta.nit.toString().includes(searchTerm.trim()))) &&
                herramienta.nit === searchTerm
            ) || [];

            if (filtered.length === 0) {
                alert("No se encontraron herramientas con ese NIT.");
                return;
            }

            setMostrarTabla(true);
        }

        setHerramientasFiltradas(filtered);
        setCurrentPage(1);
    };

    const reversedHerramientas = [...herramientasFiltradas].reverse();
    const indexOfLastArticle = currentPage * itemsPerPage;
    const indexOfFirstArticle = indexOfLastArticle - itemsPerPage;
    const currentArticles = reversedHerramientas.slice(indexOfFirstArticle, indexOfLastArticle);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="buscar">
            <h1>Buscar Artículos</h1>
            <div className="button-container">
                <input
                    ref={searchInput} // Asignar la referencia al input
                    type="text"
                    placeholder={isLoggedIn ? "Buscar por ID, nombre o propietario..." : "Ingrese el NIT y el término de búsqueda..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => { // Escuchar la tecla "Enter"
                        if (e.key === 'Enter') {
                            handleSearch();
                        }
                    }}
                    className="search-input"
                />
                <button onClick={handleSearch} className="search-button">Buscar</button>

                {isLoggedIn && (
                    <Link to="/agregar">
                        <button className="add-button">Agregar</button>
                    </Link>
                )}
            </div>

            {mostrarTabla && (
                <table className="articulos-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Herramienta</th>
                            <th>Marca</th>
                            <th>Modelo</th>
                            <th>Propietario</th>
                            <th>Nit</th>
                            <th>Último Mantenimiento</th>
                            <th>Técnico</th>
                            <th>Ver QR</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentArticles.length > 0 ? (
                            currentArticles.map((herramienta) => (
                                <tr key={herramienta.id_articulo}>
                                    <td data-label="ID">
                                        <Link to={`/herramienta/${herramienta.id_articulo}`}>
                                            {herramienta.id_articulo}
                                        </Link>
                                    </td>
                                    <td data-label="Descripción">{herramienta.herramienta}</td>
                                    <td data-label="Marca">{herramienta.marca}</td>
                                    <td data-label="Modelo">{herramienta.modelo}</td>
                                    <td data-label="Propietario">{herramienta.propietario}</td>
                                    <td data-label="NIT">{herramienta.nit}</td>
                                    <td data-label="Último Mantenimiento">
                                        {herramienta.ultimo_mantenimiento ? new Date(herramienta.ultimo_mantenimiento).toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td data-label="Técnico">{herramienta.nombre_trabajador}</td>
                                    <td data-label="Ver QR">
                                        <Link to={`/qr/${herramienta.id_articulo}`}>Ver QR</Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9">No se encontraron artículos.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}

            {mostrarTabla && herramientasFiltradas.length > itemsPerPage && (
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
                        {[...Array(Math.ceil(herramientasFiltradas.length / itemsPerPage)).keys()].map((number) => (
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
                        <li className={`page-item ${currentPage === Math.ceil(herramientasFiltradas.length / itemsPerPage) ? 'disabled' : ''}`}>
                            {/* Evitar comportamiento predeterminado con preventDefault */}
                            <button
                                className="page-link"
                                onClick={() => paginate(currentPage + 1)}
                                disabled={currentPage === Math.ceil(herramientasFiltradas.length / itemsPerPage)}
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
