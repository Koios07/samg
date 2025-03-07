import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Buscar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as XLSX from 'xlsx';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import Modal from 'react-modal';
import { QRCodeSVG } from 'qrcode.react';

// Asegúrate de enlazar la app con el elemento raíz para accesibilidad
Modal.setAppElement('#root');

const Buscar = ({ herramientas: initialHerramientas, isLoggedIn, userType = "" }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [herramientasFiltradas, setHerramientasFiltradas] = useState([]);
    const [mostrarTabla, setMostrarTabla] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isQrModalOpen, setIsQrModalOpen] = useState(false);
    const [qrCodeUrl, setQrCodeUrl] = useState('');

    // Estados para la paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [herramientasPerPage] = useState(10);

    useEffect(() => {
        if (isLoggedIn) {
            obtenerHerramientas();
            setMostrarTabla(true); // Mostrar tabla al cargar la página para usuarios logueados
        } else {
            setMostrarTabla(false); // No mostrar tabla al inicio para usuarios no logueados
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

    const toggleDropdown = () => setDropdownOpen(prevState => !prevState);

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
        setMostrarTabla(true); // Mostrar tabla después de buscar
    };

    const handleSearchInput = (e) => {
        setSearchTerm(e.target.value);
        if (e.key === 'Enter') {
            handleSearch(e);
        }
    };

    const generarExcel = () => {
        if (!isLoggedIn) {
            alert('Por favor, inicie sesión para descargar la plantilla.');
            return;
        }

        const headers = [
            "herramienta",
            "marca",
            "modelo",
            "propietario",
            "fecha_entrada",
            "nombre_trabajador",
            "nit"
        ];

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet([headers]);
        XLSX.utils.book_append_sheet(wb, ws, "Herramientas");

        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([new Uint8Array(wbout)], { type: 'application/octet-stream' });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'plantilla_herramientas.xlsx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleFileUpload = async (e) => {
        if (!isLoggedIn) {
            alert('Por favor, inicie sesión para importar archivos.');
            return;
        }

        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const reader = new FileReader();

            reader.onload = async (e) => {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);

                console.log('Datos del Excel:', jsonData);

                try {
                    const response = await fetch('http://localhost:3001/importar-herramientas', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(jsonData),
                    });

                    if (response.ok) {
                        alert('Datos importados correctamente');
                        obtenerHerramientas(); // Refresca la lista
                    } else {
                        throw new Error('Error al importar datos');
                    }
                } catch (error) {
                    console.error('Error al importar datos:', error);
                    alert('Error al importar datos');
                }
            };

            reader.readAsArrayBuffer(selectedFile);
        } else {
            alert('Por favor, seleccione un archivo');
        }
    };

    const dropdownStyle = {
        marginLeft: '10px',
    };

    const formatDate = (date) => {
        if (!date) return '';
        const newDate = new Date(date);
        return newDate.toLocaleDateString('es-ES'); // Formato dd/mm/aaaa
    };

    // Lógica para la paginación
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
            <h1>Buscar Artículos</h1>
            <div className="button-container">
                <input
                    type="text"
                    placeholder="Ingrese el NIT o el término de búsqueda..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleSearchInput} // Agregado para detectar la tecla Enter
                    className="search-input"
                />
                <button onClick={handleSearch} className="search-button">Buscar</button>

                {isLoggedIn && (
                    <Link to="/agregar">
                        <button className="add-button">Agregar</button>
                    </Link>
                )}
                {console.log('isLoggedIn:', isLoggedIn)}
                {console.log('userType:', userType)}
                {isLoggedIn && String(userType) === "1" && (
                    <div>
                        <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown} style={dropdownStyle}>
                            <DropdownToggle caret toggle={toggleDropdown}>
                                Archivos XLS
                            </DropdownToggle>
                            <DropdownMenu right>
                                <DropdownItem onClick={generarExcel}>Descargar Plantilla</DropdownItem>
                                <DropdownItem>
                                    <label htmlFor="upload-input" className="upload-label">
                                        Cargar Archivo
                                    </label>
                                    <input
                                        id="upload-input"
                                        type="file"
                                        accept=".xlsx, .xls"
                                        style={{ display: 'none' }}
                                        onChange={handleFileUpload}
                                    />
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
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
                                        <button onClick={() => openQrModal(herramienta.id_articulo)}>Ver QR</button>
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
            )}
            {/* Paginación */}
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
