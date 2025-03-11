import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Buscar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from 'react-modal';
import { QRCodeSVG } from 'qrcode.react';

Modal.setAppElement('#root');

const Buscar = ({ herramientas: initialHerramientas, isLoggedIn, userType = "" }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [herramientasFiltradas, setHerramientasFiltradas] = useState([]);
    const [mostrarTabla, setMostrarTabla] = useState(false);
    const [isQrModalOpen, setIsQrModalOpen] = useState(false);
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [herramientasPerPage] = useState(10);

    useEffect(() => {
        if (isLoggedIn) {
            obtenerHerramientas();
            setMostrarTabla(true);
        } else {
            setMostrarTabla(false);
        }
    }, [isLoggedIn]);

    const obtenerHerramientas = async () => {
        try {
            const response = await fetch('http://localhost:3001/herramientas');
            const data = await response.json();
            setHerramientasFiltradas(data);
        } catch (error) {
            console.error('Error al obtener herramientas:', error);
        }
    };

    const handleSearch = async (e) => {
        if (e && e.key === 'Enter') {
            e.preventDefault();
        }

        let filtered = initialHerramientas || [];

        if (searchTerm) {
            filtered = initialHerramientas?.filter((herramienta) =>
                herramienta.nit === searchTerm ||
                herramienta.herramienta?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (herramienta.id_articulo && herramienta.id_articulo.toString().includes(searchTerm.trim())) ||
                herramienta.propietario?.toLowerCase().includes(searchTerm.toLowerCase())
            ) || [];
        }

        setHerramientasFiltradas(filtered);
        setMostrarTabla(true);
    };

    const handleSearchInput = (e) => {
        setSearchTerm(e.target.value);
        if (e.key === 'Enter') {
            handleSearch(e);
        }
    };

    const formatDate = (date) => {
        if (!date) return '';
        const newDate = new Date(date);
        return newDate.toLocaleDateString('es-ES');
    };

    const indexOfLastHerramienta = currentPage * herramientasPerPage;
    const indexOfFirstHerramienta = indexOfLastHerramienta - herramientasPerPage;
    const currentHerramientas = herramientasFiltradas.slice(indexOfFirstHerramienta, indexOfLastHerramienta);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const openQrModal = (id) => {
        setQrCodeUrl(`${window.location.origin}/herramienta/${id}`);
        setIsQrModalOpen(true);
    };

    const closeQrModal = () => {
        setIsQrModalOpen(false);
    };

    const imprimirQrCode = () => {
        window.print();
    };

    return (
        <div className="buscar">
            <h1>Buscar Herramienta</h1>
            <div className="button-container">
                <input
                    type="text"
                    placeholder="Ingrese el NIT o el término de búsqueda..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleSearchInput}
                    className="search-input"
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '200px', marginLeft: '10px' }}>
                    <button onClick={handleSearch} className="search-button">Buscar</button>
                    {isLoggedIn && (
                        <Link to="/agregar">
                            <button className="add-button">Agregar</button>
                        </Link>
                    )}
                </div>
            </div>
            {mostrarTabla && (
                <div className="table-container">
                    <table className="articulos-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Herramienta</th>
                                <th>Marca</th>
                                <th>Modelo</th>
                                <th>Propietario</th>
                                <th>Nit</th>
                                <th>Fecha de Ingreso</th>
                                <th>Fecha de Mantenimiento</th>
                                <th>Técnico</th>
                                <th>Ver QR</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentHerramientas.length > 0 ? (
                                currentHerramientas.map((herramienta) => (
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
                                        <td data-label="Nit">{herramienta.nit}</td>
                                        <td data-label="Fecha de Ingreso">{formatDate(herramienta.fecha_entrada)}</td>
                                        <td data-label="Fecha de Mantenimiento">{formatDate(herramienta.fecha_mantenimiento)}</td>
                                        <td data-label="Técnico">{herramienta.nombre_trabajador}</td>
                                        <td data-label="Ver QR">
                                            <button className="ver-qr-button" onClick={() => openQrModal(herramienta.id_articulo)} style={{ color: 'white' }}>
                                                Ver QR
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="10">No se encontraron resultados.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
            {mostrarTabla && herramientasFiltradas.length > herramientasPerPage && (
                <div className="pagination-container">
                    <div className="pagination">
                        {Array.from({ length: Math.ceil(herramientasFiltradas.length / herramientasPerPage) }, (_, i) => (
                            <button key={i} onClick={() => paginate(i + 1)} className={`page-link ${currentPage === i + 1 ? 'active' : ''}`}>
                                {i + 1}
                            </button>
                        ))}
                    </div>
                </div>
            )}
            <Modal
                isOpen={isQrModalOpen}
                onRequestClose={closeQrModal}
                className="qr-modal"
                overlayClassName="qr-modal-overlay"
                style={{
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.75)'
                    },
                    content: {
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        border: '1px solid #ccc',
                        background: '#fff',
                        overflow: 'auto',
                        WebkitOverflowScrolling: 'touch',
                        borderRadius: '4px',
                        outline: 'none',
                        padding: '20px',
                        maxWidth: '50%',
                        maxHeight: '50%',
                        width: 'auto',
                        height: 'auto'
                    }
                }}
                contentLabel="Código QR"
            >
                <div className="qr-content">
                    <h2 className="qr-title">Código QR</h2>
                    <QRCodeSVG value={qrCodeUrl} size={256} className="qr-code" />
                    <div className="modal-buttons">
                        <button onClick={imprimirQrCode} className="print-button">Imprimir</button>
                        <button onClick={closeQrModal} className="close-button">Cerrar</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
export default Buscar;
