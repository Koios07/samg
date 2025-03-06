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
            const data = await response.json();
            console.log('Mantenimientos obtenidos:', data);
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
                        {isEditing ? (
                            <div>
                                <button onClick={handleSave}>Guardar Cambios</button>
                                <button onClick={() => setIsEditing(false)}>Cancelar</button>
                            </div>
                        ) : (
                            <button onClick={() => setIsEditing(true)}>Editar herramienta</button>
                        )}
                    </div>
                )}
            </div>

            {isLoggedIn && (
                <div>
                    <button onClick={handleMostrarFormulario}>Añadir Mantenimiento</button>
                    {mostrarFormularioMantenimiento && (
                        <div className="box">
                            <h3>Agregar Mantenimiento</h3>
                            <input
                                type="date"
                                name="fecha_mantenimiento"
                                value={nuevoMantenimiento.fecha_mantenimiento}
                                onChange={(e) => setNuevoMantenimiento({ ...nuevoMantenimiento, fecha_mantenimiento: e.target.value })}
                                placeholder="Fecha de Mantenimiento"
                            />
                            <input
                                type="text"
                                name="descripcion_dano"
                                value={nuevoMantenimiento.descripcion_dano}
                                onChange={(e) => setNuevoMantenimiento({ ...nuevoMantenimiento, descripcion_dano: e.target.value })}
                                placeholder="Descripción del Daño"
                            />
                            <input
                                type="text"
                                name="descripcion_mantenimiento"
                                value={nuevoMantenimiento.descripcion_mantenimiento}
                                onChange={(e) => setNuevoMantenimiento({ ...nuevoMantenimiento, descripcion_mantenimiento: e.target.value })}
                                placeholder="Descripción del Mantenimiento"
                            />
                            {mantenimientoAEditar ? (
                                <button onClick={handleActualizarMantenimiento}>Actualizar Mantenimiento</button>
                            ) : (
                                <button onClick={handleAgregarMantenimiento}>Guardar Mantenimiento</button>
                            )}
                            <button onClick={handleOcultarFormulario}>Cancelar</button>
                        </div>
                    )}
                </div>
            )}

            <div className="box">
                <h3>Mantenimientos</h3>
                {mantenimientos.length > 0 ? (
                    mantenimientos.sort((a, b) => new Date(b.fecha_mantenimiento) - new Date(a.fecha_mantenimiento)).map((mantenimiento) => (
                        <div key={mantenimiento.id_mantenimiento} className="mantenimiento-box">
                            <p>Fecha de Mantenimiento: {formatDate(mantenimiento.fecha_mantenimiento)}</p>
                            <p>Descripción del Daño: {mantenimiento.descripcion_dano}</p>
                            <p>Descripción del Mantenimiento: {mantenimiento.descripcion_mantenimiento}</p>
                            {isLoggedIn && (
                                <button onClick={() => handleEditarMantenimiento(mantenimiento)}>Editar Mantenimiento</button>
                            )}
                        </div>
                    ))
                ) : (
                    <p>No hay mantenimientos registrados.</p>
                )}
            </div>

            <Modal
                isOpen={mostrarModalConfirmacion}
                onRequestClose={() => setMostrarModalConfirmacion(false)}
                className="modal"
                overlayClassName="overlay"
            >
                <h2>Información</h2>
                <p>{mensajeModal}</p>
                <button className="close-button" onClick={() => setMostrarModalConfirmacion(false)}>Cerrar</button>
            </Modal>
        </div>
    );
};

export default HerramientaDetalle;
