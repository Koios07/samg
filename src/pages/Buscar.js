import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Buscar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as XLSX from 'xlsx';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';


const Buscar = ({ herramientas: initialHerramientas, isLoggedIn, userType }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [herramientasFiltradas, setHerramientasFiltradas] = useState([]);
    const [mostrarTabla, setMostrarTabla] = useState(isLoggedIn);
    const searchInput = useRef(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        if (isLoggedIn) {
            setHerramientasFiltradas(initialHerramientas || []);
            setMostrarTabla(true);
        } else {
            setHerramientasFiltradas([]);
            setMostrarTabla(false);
        }
    }, [initialHerramientas, isLoggedIn]);

    const toggleDropdown = () => setDropdownOpen(prevState => !prevState);

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
    };

    const generarExcel = () => {
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

    return (
        <div className="buscar">
            <h1>Buscar Artículos</h1>
            <div className="button-container">
                <input
                    ref={searchInput}
                    type="text"
                    placeholder={isLoggedIn ? "Buscar por ID, nombre o propietario..." : "Ingrese el NIT y el término de búsqueda..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => {
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
                        {herramientasFiltradas.length > 0 ? (
                            herramientasFiltradas.map((herramienta) => (
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
                                        <Link to={`/qr/${herramienta.id_articulo}`}>
                                            Ver QR
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="10">No se encontraron herramientas.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Buscar;
