import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Modal from 'react-modal';
import './HerramientaDetalle.css';

const HerramientaDetalle = ({ onUpdateHerramienta, isLoggedIn, userType }) => {
    console.log('Estoy en HerramientaDetalle.js');
    console.log('isLoggedIn:', isLoggedIn);

    const { id_articulo } = useParams();
    const navigate = useNavigate();
    const [urlValue, setUrlValue] = useState('');
    const [tipoModal, setTipoModal] = useState('Confirmación'); // Estado para cambiar el título del modal
    const [herramienta, setHerramienta] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        herramienta: '',
        marca: '',
        modelo: '',
        propietario: '',
        fecha_entrada: '',
        nit: '',
        nombre_trabajador: '',
        garantia: '',
        url: ''
    });
    const [mantenimientos, setMantenimientos] = useState([]);
    const [nuevoMantenimiento, setNuevoMantenimiento] = useState({
        fecha_entrada: '',
        descripcion_dano: '',
        fecha_mantenimiento: '',
        descripcion_mantenimiento: '',
        referencia: '',
    });
    const [mantenimientoAEditar, setMantenimientoAEditar] = useState(null);
    const [mostrarFormularioMantenimiento, setMostrarFormularioMantenimiento] = useState(false);
    const [mostrarModalConfirmacion, setMostrarModalConfirmacion] = useState(false);
    const [mensajeModal, setMensajeModal] = useState('');

    // Estados para la paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [mantenimientosPerPage] = useState(3);

    useEffect(() => {
        console.log('Se montó el componente HerramientaDetalle.js');
        obtenerDatos();
    }, [id_articulo, isLoggedIn]);

    const obtenerDatos = async () => {
        console.log('Obteniendo datos...');
        await fetchHerramienta();
        await fetchMantenimientos();
    };

    const fetchHerramienta = async () => {
        try {
            const response = await fetch(`http://localhost:3001/herramientas/${id_articulo}`);
            if (!response.ok) {
                throw new Error('Error al obtener la herramienta');
            }
            const data = await response.json();
            console.log('Herramienta obtenida:', data);
            setHerramienta(data);
            setFormData({
                herramienta: data?.herramienta || '',
                marca: data?.marca || '',
                modelo: data?.modelo || '',
                propietario: data?.propietario || '',
                fecha_entrada: data?.fecha_entrada ? formatDate(data.fecha_entrada) : '',
                nit: data?.nit || '',
                nombre_trabajador: data?.nombre_trabajador || '',
                garantia: data?.garantia || '',
                url: data?.url || ''
            });
        } catch (error) {
            console.error('Error fetching herramienta:', error);
        }
    };

    const fetchMantenimientos = async () => {
        try {
            const response = await fetch(`http://localhost:3001/mantenimientos/${id_articulo}`);
            if (!response.ok) {
                throw new Error('Error al obtener los mantenimientos');
            }
            let data = await response.json();
            console.log('Mantenimientos obtenidos:', data);

            // Ordenar mantenimientos de forma descendente por fecha
            data = data.sort((a, b) => new Date(b.fecha_mantenimiento) - new Date(a.fecha_mantenimiento));

            setMantenimientos(data);
        } catch (error) {
            console.error('Error fetching mantenimientos:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleNuevoMantenimientoChange = (e) => {
        const { name, value } = e.target;
        setNuevoMantenimiento({ ...nuevoMantenimiento, [name]: value });
    };

    const handleSave = async () => {
        if (!isLoggedIn) {
            console.log('No está logueado. No puede editar la herramienta.');
            alert('Por favor, inicie sesión para editar la herramienta.');
            return;
        }

        try {
            // Validar que no haya campos vacíos
            const fechaEntradaValida = !isNaN(new Date(formData.fecha_entrada).getTime());

            if (!formData.herramienta || !formData.marca || !formData.modelo || !formData.propietario ||
                !formData.nit || !formData.fecha_entrada.trim() || !fechaEntradaValida) {
                setTipoModal('Error');
                setMensajeModal('Todos los campos son obligatorios, incluyendo una fecha de entrada válida.');
                setMostrarModalConfirmacion(true);
                return;
            }

            // Obtener el ID del usuario y el nombre del usuario logueado
            const userId = localStorage.getItem('userId');
            const userName = localStorage.getItem('userName');
            console.log("ID de usuario recuperado de localStorage:", userId);
            console.log("Nombre de usuario recuperado de localStorage:", userName);
            // Crear una copia del formulario con el nombre del usuario
            const formDataToSend = { ...formData, nombre_trabajador: userName };
            console.log("Datos a enviar:", formDataToSend);
            const response = await fetch(`http://localhost:3001/herramientas/${id_articulo}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'user-id': userId  // Asegúrate de enviar el ID del usuario en el header
                },
                body: JSON.stringify(formDataToSend)
            });

            if (response.ok) {
                const updatedHerramienta = await response.json();
                console.log('Herramienta actualizada:', updatedHerramienta);

                // Actualizar el estado local con los datos actualizados
                setHerramienta(updatedHerramienta);
                setFormData({
                    herramienta: updatedHerramienta?.herramienta || '',
                    marca: updatedHerramienta?.marca || '',
                    modelo: updatedHerramienta?.modelo || '',
                    propietario: updatedHerramienta?.propietario || '',
                    fecha_entrada: updatedHerramienta?.fecha_entrada ? formatDate(updatedHerramienta.fecha_entrada) : '',
                    nit: updatedHerramienta?.nit || '',
                    nombre_trabajador: updatedHerramienta?.nombre_trabajador || ''
                });

                onUpdateHerramienta(updatedHerramienta);

                setTipoModal('Confirmación');
                setMensajeModal('Cambios guardados correctamente.');
                setMostrarModalConfirmacion(true);

                setIsEditing(false);
                await fetchHerramienta(); // Refresca la herramienta
                await fetchMantenimientos(); // Refresca los mantenimientos
            } else {
                console.error('Error al actualizar la herramienta');
            }
        } catch (error) {
            console.error('Error al actualizar la herramienta:', error);
        }
    };

    const handleAgregarMantenimiento = async () => {
        if (!isLoggedIn) {
            console.log('No está logueado. No puede agregar un mantenimiento.');
            alert('Por favor, inicie sesión para agregar un mantenimiento.');
            return;
        }

        // Validación de fecha de mantenimiento
        const fechaMantenimientoValida = nuevoMantenimiento.fecha_mantenimiento &&
            !isNaN(new Date(nuevoMantenimiento.fecha_mantenimiento).getTime());

        if (!fechaMantenimientoValida) {
            setTipoModal('Error'); // Cambia el título del modal a "Error"
            setMensajeModal('Por favor, ingrese una fecha de mantenimiento válida.');
            setMostrarModalConfirmacion(true);
            return;
        }

        try {
            const userId = localStorage.getItem('userId'); // Obtener el ID del usuario de localStorage
            const userName = localStorage.getItem('userName'); // Obtener el nombre del usuario de localStorage
            console.log("ID de usuario recuperado de localStorage (mantenimiento):", userId);

            if (!userId || !userName) {
                console.error("ID de usuario o nombre de usuario no encontrado en localStorage");
                setMensajeModal('Error al agregar mantenimiento. Por favor, inicie sesión nuevamente.');
                setMostrarModalConfirmacion(true);
                return;
            }

            const responseMantenimiento = await fetch(`http://localhost:3001/mantenimientos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'user-id': userId
                },
                body: JSON.stringify({
                    id_herramienta: id_articulo,
                    fecha_mantenimiento: nuevoMantenimiento.fecha_mantenimiento,
                    descripcion_dano: nuevoMantenimiento.descripcion_dano,
                    descripcion_mantenimiento: nuevoMantenimiento.descripcion_mantenimiento,
                    referencia: nuevoMantenimiento.referencia,
                    nit_propietario: formData.nit,
                    id_usuario: userId,
                    nombre_tecnico: userName
                })
            });

            if (responseMantenimiento.ok) {
                setNuevoMantenimiento({
                    fecha_entrada: '',
                    descripcion_dano: '',
                    fecha_mantenimiento: '',
                    descripcion_mantenimiento: '',
                    referencia: '',
                });

                // Actualizar la fecha de entrada en el formulario principal
                setFormData(prevState => ({
                    ...prevState,
                    fecha_entrada: nuevoMantenimiento.fecha_mantenimiento,
                }));

                setTipoModal('Confirmación');
                setMensajeModal('Mantenimiento agregado correctamente.');
                await fetchMantenimientos(); // Refresca los mantenimientos
            } else {
                console.error('Error al agregar el mantenimiento:', responseMantenimiento.statusText);
                setMensajeModal('Error al agregar mantenimiento. Por favor, revise los datos.');
            }

            setMostrarModalConfirmacion(true);
            handleOcultarFormulario();
        } catch (error) {
            console.error('Error al agregar el mantenimiento:', error);
            setMensajeModal('Error al agregar mantenimiento. Por favor, revise los datos.');
            setMostrarModalConfirmacion(true);
        }
    };

    const handleEditarMantenimiento = (mantenimiento) => {
        if (!isLoggedIn) {
            console.log('No está logueado. No puede editar un mantenimiento.');
            alert('Por favor, inicie sesión para editar un mantenimiento.');
            return;
        }

        setMantenimientoAEditar(mantenimiento);
        setNuevoMantenimiento({
            fecha_mantenimiento: mantenimiento.fecha_mantenimiento,
            descripcion_dano: mantenimiento.descripcion_dano,
            descripcion_mantenimiento: mantenimiento.descripcion_mantenimiento,
            referencia: mantenimiento.referencia,
        });
        setMostrarFormularioMantenimiento(true);
    };


    const handleActualizarMantenimiento = async () => {
        if (!isLoggedIn) {
            console.log('No está logueado. No puede actualizar un mantenimiento.');
            alert('Por favor, inicie sesión para actualizar un mantenimiento.');
            return;
        }

        // Validar que todos los campos estén llenos
        if (
            !nuevoMantenimiento.fecha_mantenimiento ||
            !nuevoMantenimiento.descripcion_dano ||
            !nuevoMantenimiento.descripcion_mantenimiento

        ) {
            setTipoModal('Error');
            setMensajeModal('Todos los campos son obligatorios.');
            setMostrarModalConfirmacion(true);
            return;
        }

        // Validar que la fecha esté en formato numérico (YYYY-MM-DD)
        const regexFecha = /^\d{4}-\d{2}-\d{2}$/;
        if (!regexFecha.test(nuevoMantenimiento.fecha_mantenimiento)) {
            setTipoModal('Error');
            setMensajeModal('La fecha de mantenimiento debe estar establecida.');
            setMostrarModalConfirmacion(true);
            return;
        }

        try {
            const userId = localStorage.getItem('userId'); // Obtener el ID del usuario de localStorage

            const response = await fetch(`http://localhost:3001/mantenimientos/${mantenimientoAEditar.id_mantenimiento}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'user-id': userId
                },
                body: JSON.stringify({
                    fecha_mantenimiento: nuevoMantenimiento.fecha_mantenimiento,
                    descripcion_dano: nuevoMantenimiento.descripcion_dano,
                    descripcion_mantenimiento: nuevoMantenimiento.descripcion_mantenimiento,
                    referencia: nuevoMantenimiento.referencia,
                    nit_propietario: formData.nit,
                    id_usuario: userId,

                }),
            });

            if (response.ok) {
                const actualizado = await response.json();
                console.log("Mantenimiento actualizado:", actualizado);

                // Refrescar la lista de mantenimientos para que se visualice de inmediato
                await fetchMantenimientos();
                setTipoModal('Confirmación');
                setMensajeModal('Mantenimiento actualizado correctamente.');
                setMostrarModalConfirmacion(true);
                handleOcultarFormulario();
            } else {
                console.error("Error al actualizar el mantenimiento:", response.statusText);
                setTipoModal('Error');
                setMensajeModal('Error al actualizar el mantenimiento. Por favor, revise los datos.');
                setMostrarModalConfirmacion(true);
            }
        } catch (error) {
            console.error('Error al actualizar el mantenimiento:', error);
            setTipoModal('Error');
            setMensajeModal('Error al actualizar el mantenimiento. Por favor, intente de nuevo.');
            setMostrarModalConfirmacion(true);
        }
    };


    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
    };

    const handleEditarClick = () => {
        if (!isLoggedIn) {
            console.log('No está logueado. No puede editar la herramienta.');
            alert('Por favor, inicie sesión para editar la herramienta.');
            return;
        }
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setFormData({
            herramienta: herramienta?.herramienta || '',
            marca: herramienta?.marca || '',
            modelo: herramienta?.modelo || '',
            propietario: herramienta?.propietario || '',
            fecha_entrada: herramienta?.fecha_entrada ? formatDate(herramienta.fecha_entrada) : '',
            nit: herramienta?.nit || '',
            nombre_trabajador: herramienta?.nombre_trabajador || '',
            garantia: herramienta?.garantia || '',
            url: herramienta?.url || '',
        });
    };

    const handleMostrarFormulario = () => {
        setMostrarFormularioMantenimiento(true);
    };

    const handleOcultarFormulario = () => {
        setMostrarFormularioMantenimiento(false);
        setMantenimientoAEditar(null);
        setNuevoMantenimiento({ // Restablece los valores iniciales
            fecha_mantenimiento: '',
            descripcion_dano: '',
            descripcion_mantenimiento: '',
            referencia: ''
        });
    };

    // Filtrar mantenimientos según el estado de inicio de sesión
    const filteredMantenimientos = isLoggedIn
        ? mantenimientos
        : mantenimientos.length > 0 ? [mantenimientos[0]] : [];

    // Paginación
    const indexOfLastMantenimiento = currentPage * mantenimientosPerPage;
    const indexOfFirstMantenimiento = indexOfLastMantenimiento - mantenimientosPerPage;
    const currentMantenimientos = filteredMantenimientos.slice(indexOfFirstMantenimiento, indexOfLastMantenimiento);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1000
        }
    };

    return (
        <div className="herramienta-detalle-container">
            <h2>
                Detalle de la Herramienta
            </h2>
            <div className="header-actions">
                <Link to="/buscar" className="volver-busqueda-button">
                    Volver a la Búsqueda
                </Link>
                {isLoggedIn && (
                    <button className="editar-herramienta-button" onClick={handleEditarClick}>
                        Editar
                    </button>
                )}
            </div>

            {herramienta ? (
                <div className="herramienta-detalle">
                    {isEditing ? (
                        <div className="herramienta-form">
                            <label>Herramienta:</label>
                            <input type="text" name="herramienta" value={formData.herramienta} onChange={handleChange} /><br />

                            <label>Marca:</label>
                            <input type="text" name="marca" value={formData.marca} onChange={handleChange} /><br />

                            <label>Modelo:</label>
                            <input type="text" name="modelo" value={formData.modelo} onChange={handleChange} /><br />

                            <label>Propietario:</label>
                            <input type="text" name="propietario" value={formData.propietario} onChange={handleChange} /><br />

                            <label>Fecha de Entrada:</label>
                            <input type="date" name="fecha_entrada" value={formData.fecha_entrada} onChange={handleChange} /><br />

                            <label>NIT:</label>
                            <input type="text" name="nit" value={formData.nit} onChange={handleChange} /><br />

                            <label>Garantia</label>
                            <input type="text" id="garantia" name="garantia" value={formData.garantia} onChange={handleChange} />

                            <label>URL</label>
                            <input type="text" id="url" name="url" value={formData.url} onChange={handleChange} />

                            <div className="button-container">
                                <button onClick={handleSave}>Guardar</button>
                                <button onClick={handleCancel}>Cancelar</button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <p><strong>Herramienta:</strong> {herramienta.herramienta}</p>
                            <p><strong>Marca:</strong> {herramienta.marca}</p>
                            <p><strong>Modelo:</strong> {herramienta.modelo}</p>
                            <p><strong>Propietario:</strong> {herramienta.propietario}</p>
                            <p><strong>Fecha de Entrada:</strong> {formatDate(herramienta.fecha_entrada)}</p>
                            <p><strong>NIT:</strong> {herramienta.nit}</p>
                            <p><strong>Garantia:</strong> {herramienta.garantia}</p>
                            {herramienta.url ? (
                                <div>
                                    <strong>URL:</strong>
                                    <a href={herramienta.url} target="_blank" rel="noopener noreferrer">
                                         Visualizar imagen
                                    </a>
                                </div>
                            ) : null}
                        </>
                    )}

                    <div className="mantenimientos-container">
                        <div className="mantenimiento-header">
                            <h3>Mantenimientos</h3>
                            {isLoggedIn && (
                                <button className="agregar-mantenimiento-button" onClick={handleMostrarFormulario}>
                                    Agregar
                                </button>
                            )}
                        </div>

                        {mostrarFormularioMantenimiento && !mantenimientoAEditar && (
                            <div className="mantenimiento-form">
                                <label>Fecha de Mantenimiento:</label>
                                <input
                                    type="date"
                                    name="fecha_mantenimiento"
                                    value={nuevoMantenimiento.fecha_mantenimiento}
                                    onChange={handleNuevoMantenimientoChange}
                                /><br />

                                <label>Descripción del Daño:</label>
                                <input
                                    type="text"
                                    name="descripcion_dano"
                                    value={nuevoMantenimiento.descripcion_dano}
                                    onChange={handleNuevoMantenimientoChange}
                                /><br />

                                <label>Descripción del Mantenimiento:</label>
                                <input
                                    type="text"
                                    name="descripcion_mantenimiento"
                                    value={nuevoMantenimiento.descripcion_mantenimiento}
                                    onChange={handleNuevoMantenimientoChange}
                                /><br />

                                <label>Referencia:</label>
                                <input
                                    type="text"
                                    name="referencia"
                                    value={nuevoMantenimiento.referencia}
                                    onChange={handleNuevoMantenimientoChange}
                                /><br />

                                <div className="button-container">
                                    <button onClick={handleAgregarMantenimiento}>
                                        Agregar Mantenimiento
                                    </button>
                                    <button onClick={handleOcultarFormulario}>Cancelar</button>
                                </div>
                            </div>
                        )}

                        <ul className="no-bullets">
                            {currentMantenimientos.map(mantenimiento => (
                                <li key={mantenimiento.id_mantenimiento} className="mantenimiento-cuadro">
                                    <div className="mantenimiento-info-container">
                                        {mantenimientoAEditar && mantenimientoAEditar.id_mantenimiento === mantenimiento.id_mantenimiento ? (
                                            <div className="mantenimiento-form">
                                                <label>Fecha de Mantenimiento:</label>
                                                <input
                                                    type="date"
                                                    name="fecha_mantenimiento"
                                                    value={nuevoMantenimiento.fecha_mantenimiento}
                                                    onChange={handleNuevoMantenimientoChange}
                                                /><br />

                                                <label>Descripción del Daño:</label>
                                                <input
                                                    type="text"
                                                    name="descripcion_dano"
                                                    value={nuevoMantenimiento.descripcion_dano}
                                                    onChange={handleNuevoMantenimientoChange}
                                                /><br />

                                                <label>Descripción del Mantenimiento:</label>
                                                <input
                                                    type="text"
                                                    name="descripcion_mantenimiento"
                                                    value={nuevoMantenimiento.descripcion_mantenimiento}
                                                    onChange={handleNuevoMantenimientoChange}
                                                /><br />

                                                <label>Referencia:</label>
                                                <input
                                                    type="text"
                                                    name="referencia"
                                                    value={nuevoMantenimiento.referencia}
                                                    onChange={handleNuevoMantenimientoChange}
                                                /><br />

                                                <div className="button-container">
                                                    <button onClick={handleActualizarMantenimiento}>
                                                        Actualizar Mantenimiento
                                                    </button>
                                                    <button onClick={handleOcultarFormulario}>Cancelar</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <p><strong>Fecha de Mantenimiento:</strong> {formatDate(mantenimiento.fecha_mantenimiento)}</p>
                                                <p><strong>Descripción del Daño:</strong> {mantenimiento.descripcion_dano}</p>
                                                <p><strong>Descripción del Mantenimiento:</strong> {mantenimiento.descripcion_mantenimiento}</p>
                                                <p><strong>Referencia:</strong> {mantenimiento.referencia}</p>
                                                {isLoggedIn && (
                                                    <div className="button-container">
                                                        <button onClick={() => handleEditarMantenimiento(mantenimiento)}>Editar</button>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>

                        {/* Paginación */}
                        {isLoggedIn && mantenimientos.length > mantenimientosPerPage && (
                            <div className="pagination">
                                {Array.from({ length: Math.ceil(mantenimientos.length / mantenimientosPerPage) }).map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            setCurrentPage(index + 1);
                                            paginate(index + 1);
                                        }}
                                        className={currentPage === index + 1 ? 'active' : ''}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <p>Cargando herramienta...</p>
            )}

            <Modal
                isOpen={mostrarModalConfirmacion}
                onRequestClose={() => setMostrarModalConfirmacion(false)}
                style={customStyles}
                contentLabel="Confirmación"
            >
                <div className="modal-content">
                    <h2>{tipoModal}</h2> {/* Aquí cambia entre "Error" y "Confirmación" */}
                    <p>{mensajeModal}</p>
                    <button onClick={() => setMostrarModalConfirmacion(false)}>Cerrar</button>
                </div>
            </Modal>
        </div>
    );
};

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1000
    }
};

export default HerramientaDetalle;
