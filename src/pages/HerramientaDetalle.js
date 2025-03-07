import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Modal from 'react-modal';
import './HerramientaDetalle.css';

const HerramientaDetalle = ({ onUpdateHerramienta, isLoggedIn, userType }) => {
    console.log('Estoy en HerramientaDetalle.js');
    console.log('isLoggedIn:', isLoggedIn);

    const { id_articulo } = useParams();
    const navigate = useNavigate();
    const [herramienta, setHerramienta] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        herramienta: '',
        marca: '',
        modelo: '',
        propietario: '',
        fecha_entrada: '',
        nit: '',
        nombre_trabajador: ''
    });
    const [mantenimientos, setMantenimientos] = useState([]);
    const [nuevoMantenimiento, setNuevoMantenimiento] = useState({
        fecha_entrada: '',
        descripcion_dano: '',
        fecha_mantenimiento: '',
        descripcion_mantenimiento: '',
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
    }, [id_articulo]);

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
                nombre_trabajador: data?.nombre_trabajador || ''
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
            if (!formData.herramienta || !formData.marca || !formData.modelo || !formData.propietario || !formData.nit || !formData.fecha_entrada) {
                setMensajeModal('Por favor, complete todos los campos.');
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
                    nit_propietario: formData.nit,
                    id_usuario: userId,
                    nombre_tecnico: userName
                })
            });

            if (responseMantenimiento.ok) {
                //const nuevoMantenimientoGuardado = await responseMantenimiento.json();
                //setMantenimientos([...mantenimientos, nuevoMantenimientoGuardado]);
                setNuevoMantenimiento({
                    fecha_entrada: '',
                    descripcion_dano: '',
                    fecha_mantenimiento: '',
                    descripcion_mantenimiento: '',
                });

                // Actualizar la fecha de entrada en el formulario principal
                setFormData(prevState => ({
                    ...prevState,
                    fecha_entrada: nuevoMantenimiento.fecha_mantenimiento,
                }));

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
        });
        setMostrarFormularioMantenimiento(true);
    };

    const handleActualizarMantenimiento = async () => {
        if (!isLoggedIn) {
            console.log('No está logueado. No puede actualizar un mantenimiento.');
            alert('Por favor, inicie sesión para actualizar un mantenimiento.');
            return;
        }

        try {
            const userId = localStorage.getItem('userId'); // Obtener el ID del usuario de localStorage
            const userName = localStorage.getItem('userName'); // Obtener el nombre del usuario de localStorage
            console.log("ID de usuario recuperado de localStorage (mantenimiento):", userId);

            const responseMantenimiento = await fetch(`http://localhost:3001/mantenimientos/${mantenimientoAEditar.id_mantenimiento}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'user-id': userId
                },
                body: JSON.stringify({
                    fecha_mantenimiento: nuevoMantenimiento.fecha_mantenimiento,
                    descripcion_dano: nuevoMantenimiento.descripcion_dano,
                    descripcion_mantenimiento: nuevoMantenimiento.descripcion_mantenimiento,
                    nit_propietario: formData.nit,
                    id_usuario: userId,
                    nombre_tecnico: userName
                })
            });

            if (responseMantenimiento.ok) {
                //const mantenimientosActualizados = mantenimientos.map(mantenimiento =>
                //  mantenimiento.id_mantenimiento === mantenimientoAEditar.id_mantenimiento
                //    ? { ...mantenimientoAEditar, ...nuevoMantenimiento }
                //  : mantenimiento
                // );

                //setMantenimientos(mantenimientosActualizados);
                await fetchMantenimientos(); // Refresca los mantenimientos
                setMensajeModal('Mantenimiento actualizado correctamente.');
            } else {
                console.error('Error al actualizar el mantenimiento:', responseMantenimiento.statusText);
                setMensajeModal('Error al actualizar mantenimiento. Por favor, revise los datos.');
            }

            setMostrarModalConfirmacion(true);
            handleOcultarFormulario();
        } catch (error) {
            console.error('Error al actualizar el mantenimiento:', error);
            setMensajeModal('Error al actualizar mantenimiento. Por favor, revise los datos.');
            setMostrarModalConfirmacion(true);
        }
    };

    const handleCerrarModal = () => {
        setMostrarModalConfirmacion(false);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleMostrarFormulario = () => {
        if (!isLoggedIn) {
            console.log('No está logueado. No puede agregar un mantenimiento.');
            alert('Por favor, inicie sesión para agregar un mantenimiento.');
            return;
        }

        setMostrarFormularioMantenimiento(true);
    };

    const handleOcultarFormulario = () => {
        setMostrarFormularioMantenimiento(false);
        setNuevoMantenimiento({
            fecha_entrada: '',
            descripcion_dano: '',
            fecha_mantenimiento: '',
            descripcion_mantenimiento: '',
        });
        setMantenimientoAEditar(null);
    };

    // Lógica para la paginación
    const indexOfLastMantenimiento = currentPage * mantenimientosPerPage;
    const indexOfFirstMantenimiento = indexOfLastMantenimiento - mantenimientosPerPage;
    const currentMantenimientos = mantenimientos.slice(indexOfFirstMantenimiento, indexOfLastMantenimiento);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="box">
            <h2>Detalle de Herramienta</h2>
            <Link to="/buscar">Volver a la búsqueda</Link>

            <div>
                <p>Herramienta: {isEditing ? (
                    <input type="text" name="herramienta" value={formData.herramienta} onChange={handleChange} />
                ) : herramienta?.herramienta}</p>
                <p>Marca: {isEditing ? (
                    <input type="text" name="marca" value={formData.marca} onChange={handleChange} />
                ) : herramienta?.marca}</p>
                <p>Modelo: {isEditing ? (
                    <input type="text" name="modelo" value={formData.modelo} onChange={handleChange} />
                ) : herramienta?.modelo}</p>
                <p>Propietario: {isEditing ? (
                    <input type="text" name="propietario" value={formData.propietario} onChange={handleChange} />
                ) : herramienta?.propietario}</p>
                <p>NIT: {isEditing ? (
                    <input type="text" name="nit" value={formData.nit} onChange={handleChange} />
                ) : herramienta?.nit}</p>
                <p>Fecha de Entrada: {isEditing ? (
                    <input
                        type="date"
                        name="fecha_entrada"
                        value={formData.fecha_entrada}
                        onChange={handleChange}
                    />
                ) : formData.fecha_entrada}</p>
                {isLoggedIn && (
                    <div>
                        {!isEditing ? (
                            <button onClick={() => setIsEditing(true)}>Editar</button>
                        ) : (
                            <>
                                <button onClick={handleSave}>Guardar</button>
                                <button onClick={() => setIsEditing(false)}>Cancelar</button>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Lista de Mantenimientos Paginada */}
            <h3>Mantenimientos:</h3>
            {currentMantenimientos.length > 0 ? (
                <ul className="mantenimientos-list">
                    {currentMantenimientos.map(mantenimiento => (
                        <li key={mantenimiento.id_mantenimiento}>
                            <p>Fecha Mantenimiento: {formatDate(mantenimiento.fecha_mantenimiento)}</p>
                            <p>Descripción Daño: {mantenimiento.descripcion_dano}</p>
                            <p>Descripción Mantenimiento: {mantenimiento.descripcion_mantenimiento}</p>
                            {isLoggedIn && (
                                <button onClick={() => handleEditarMantenimiento(mantenimiento)}>Editar Mantenimiento</button>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No hay mantenimientos registrados para esta herramienta.</p>
            )}
            {isLoggedIn && (
                <div>
                    {!mostrarFormularioMantenimiento ? (
                        <button onClick={handleMostrarFormulario}>Agregar Mantenimiento</button>
                    ) : (
                        <div>
                            <h4>Agregar/Editar Mantenimiento</h4>
                            <label>Fecha Mantenimiento:</label>
                            <input
                                type="date"
                                name="fecha_mantenimiento"
                                value={nuevoMantenimiento.fecha_mantenimiento || ''}
                                onChange={handleNuevoMantenimientoChange}
                            />
                            <label>Descripción Daño:</label>
                            <input
                                type="text"
                                name="descripcion_dano"
                                value={nuevoMantenimiento.descripcion_dano || ''}
                                onChange={handleNuevoMantenimientoChange}
                            />
                            <label>Descripción Mantenimiento:</label>
                            <input
                                type="text"
                                name="descripcion_mantenimiento"
                                value={nuevoMantenimiento.descripcion_mantenimiento || ''}
                                onChange={handleNuevoMantenimientoChange}
                            />
                            {mantenimientoAEditar ? (
                                <button onClick={handleActualizarMantenimiento}>Actualizar Mantenimiento</button>
                            ) : (
                                <button onClick={handleAgregarMantenimiento}>Agregar Mantenimiento</button>
                            )}
                            <button onClick={handleOcultarFormulario}>Cancelar</button>
                        </div>
                    )}
                </div>
            )}
            {/* Paginación */}
            <div className="pagination-container">
                <div className="pagination">
                    {Array.from({ length: Math.ceil(mantenimientos.length / mantenimientosPerPage) }, (_, i) => (
                        <button key={i} onClick={() => paginate(i + 1)} className={`page-link ${currentPage === i + 1 ? 'active' : ''}`}>
                            {i + 1}
                        </button>
                    ))}
                </div>
            </div>

            <Modal
                isOpen={mostrarModalConfirmacion}
                onRequestClose={handleCerrarModal}
                style={{
                    overlay: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
                content: {
                    top: '50%',
                    left: '50%',
                    right: 'auto',
                    bottom: 'auto',
                    marginRight: '-50%',
                    transform: 'translate(-50%, -50%)',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)'
                }
            }}
            contentLabel="Mensaje de confirmación"
        >
            <h2>Mensaje</h2>
            <p>{mensajeModal}</p>
            <button onClick={handleCerrarModal}>Cerrar</button>
        </Modal>
    </div>
    );
};

export default HerramientaDetalle;
