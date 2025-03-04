import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Modal from 'react-modal';
import './HerramientaDetalle.css'; // Importa el CSS

const HerramientaDetalle = ({ onUpdateHerramienta, isLoggedIn, userType }) => {
    const { id_articulo } = useParams();
    const navigate = useNavigate();
    const [herramienta, setHerramienta] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        herramienta: '',
        marca: '',
        modelo: '',
        propietario: '',
        nit: '',
        fecha_entrada: '',
        nombre_trabajador: ''
    });
    const [mantenimientos, setMantenimientos] = useState([]);
    const [nuevoMantenimiento, setNuevoMantenimiento] = useState({
        fecha_entrada: '',
        descripcion_dano: '',
        fecha_mantenimiento: '',
        descripcion_mantenimiento: '',
    });
    const [mostrarFormularioMantenimiento, setMostrarFormularioMantenimiento] = useState(false);
    const [mostrarModalConfirmacion, setMostrarModalConfirmacion] = useState(false);
    const [mensajeModal, setMensajeModal] = useState(''); // Estado para el mensaje del modal

    useEffect(() => {
        const fetchHerramienta = async () => {
            try {
                const response = await fetch(`http://localhost:3001/herramientas/${id_articulo}`);
                if (!response.ok) throw new Error('Error al obtener la herramienta');
                const data = await response.json();
                setHerramienta(data);
                setFormData({
                    herramienta: data.herramienta,
                    marca: data.marca,
                    modelo: data.modelo,
                    propietario: data.propietario,
                    nit: data.nit,
                    fecha_entrada: data.fecha_entrada,
                    nombre_trabajador: data.nombre_trabajador,
                });
            } catch (error) {
                console.error('Error fetching herramienta:', error);
            }
        };

        const fetchMantenimientos = async () => {
            try {
                const response = await fetch(`http://localhost:3001/mantenimientos/${id_articulo}`);
                if (!response.ok) throw new Error('Error al obtener los mantenimientos');
                const data = await response.json();
                setMantenimientos(data);
            } catch (error) {
                console.error('Error fetching mantenimientos:', error);
            }
        };

        fetchHerramienta();
        fetchMantenimientos();
    }, [id_articulo]);

    useEffect(() => {
        if (herramienta) {
            setFormData({
                herramienta: herramienta.herramienta,
                marca: herramienta.marca,
                modelo: herramienta.modelo,
                propietario: herramienta.propietario,
                nit: herramienta.nit,
                fecha_entrada: herramienta.fecha_entrada,
                nombre_trabajador: herramienta.nombre_trabajador,
            });
        }
    }, [herramienta]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleNuevoMantenimientoChange = (e) => {
        const { name, value } = e.target;
        setNuevoMantenimiento({ ...nuevoMantenimiento, [name]: value });
    };

    const handleSave = async () => {
        try {
            // Validar que no haya campos vacíos
            if (!formData.herramienta || !formData.marca || !formData.modelo || !formData.propietario || !formData.nit || !formData.fecha_entrada) {
                setMensajeModal('Por favor, complete todos los campos.');
                setMostrarModalConfirmacion(true);
                return;
            }

            // Establecer el nombre del usuario logueado
            formData.nombre_trabajador = localStorage.getItem('userName');

            const response = await fetch(`http://localhost:3001/herramientas/${id_articulo}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'user-id': localStorage.getItem('userId') //  agregar el user-id al header
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const updatedHerramienta = await response.json();
                console.log('Herramienta actualizada:', updatedHerramienta);
                setHerramienta(updatedHerramienta); // Actualiza el estado de herramienta
                setFormData({
                    herramienta: updatedHerramienta.herramienta,
                    marca: updatedHerramienta.marca,
                    modelo: updatedHerramienta.modelo,
                    propietario: updatedHerramienta.propietario,
                    nit: updatedHerramienta.nit,
                    fecha_entrada: updatedHerramienta.fecha_entrada,
                    nombre_trabajador: updatedHerramienta.nombre_trabajador,
                });
                onUpdateHerramienta(updatedHerramienta);

                // Mostrar mensaje de confirmación
                setMensajeModal('Cambios guardados correctamente.');
                setMostrarModalConfirmacion(true);

                setIsEditing(false);
            } else {
                console.error('Error al actualizar la herramienta');
            }
        } catch (error) {
            console.error('Error al actualizar la herramienta:', error);
        }
    };

    const handleAgregarMantenimiento = async () => {
        try {
            // Agregar nuevo mantenimiento
            const responseMantenimiento = await fetch(`http://localhost:3001/mantenimientos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'user-id': localStorage.getItem('userId') // Agrega el user-id al header
                },
                body: JSON.stringify({
                    fecha_mantenimiento: nuevoMantenimiento.fecha_mantenimiento,
                    descripcion_dano: nuevoMantenimiento.descripcion_dano,
                    descripcion_mantenimiento: nuevoMantenimiento.descripcion_mantenimiento,
                    id_herramienta: id_articulo,
                    nit: formData.nit,
                    nombre_tecnico: localStorage.getItem('userName'),
                })
            });

            if (responseMantenimiento.ok) {
                const nuevoMantenimientoGuardado = await responseMantenimiento.json();
                setMantenimientos([...mantenimientos, nuevoMantenimientoGuardado]);
                setNuevoMantenimiento({
                    fecha_entrada: '',
                    descripcion_dano: '',
                    fecha_mantenimiento: '',
                    descripcion_mantenimiento: '',
                });

                console.log('Mantenimiento agregado:', nuevoMantenimientoGuardado);
                setMensajeModal('Mantenimiento agregado correctamente.');
                setMostrarModalConfirmacion(true);
            } else {
                console.error('Error al agregar el mantenimiento:', responseMantenimiento.statusText);
                setMensajeModal('Error al agregar mantenimiento. Por favor, revise los datos.');
                setMostrarModalConfirmacion(true);
            }

            // Actualizar fecha de entrada en herramientas
            const responseHerramienta = await fetch(`http://localhost:3001/herramientas/${id_articulo}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'user-id': localStorage.getItem('userId') //  agregar el user-id al header
                },
                body: JSON.stringify({
                    ...formData,
                    fecha_entrada: nuevoMantenimiento.fecha_entrada,
                })
            });

            if (!responseHerramienta.ok) {
                throw new Error('Error al actualizar la fecha de entrada');
            }

            const updatedHerramienta = await responseHerramienta.json();
            setFormData({
                ...formData,
                fecha_entrada: nuevoMantenimiento.fecha_entrada,
            });
        } catch (error) {
            console.error('Error al agregar el mantenimiento:', error);
            setMensajeModal('Error al agregar mantenimiento. Por favor, revise los datos.');
            setMostrarModalConfirmacion(true);
        }
    };

    const handleCerrarModal = () => {
        setMostrarModalConfirmacion(false);
    };

    if (!herramienta) {
        return <div>Cargando...</div>;
    }

    const convertirFecha = (date) => {
        if (!date) return '';
        const newDate = new Date(date);
        return newDate.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleMostrarFormulario = () => {
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
    };

    return (
        <div className="box">
            <h2>Detalle de Herramienta</h2>
            <Link to="/buscar">Volver a la búsqueda</Link>

            <div>
                <p>Herramienta: {isEditing ? (
                    <input type="text" name="herramienta" value={formData.herramienta} onChange={handleChange} />
                ) : herramienta.herramienta}</p>
                <p>Marca: {isEditing ? (
                    <input type="text" name="marca" value={formData.marca} onChange={handleChange} />
                ) : herramienta.marca}</p>
                <p>Modelo: {isEditing ? (
                    <input type="text" name="modelo" value={formData.modelo} onChange={handleChange} />
                ) : herramienta.modelo}</p>
                <p>Propietario: {isEditing ? (
                    <input type="text" name="propietario" value={formData.propietario} onChange={handleChange} />
                ) : herramienta.propietario}</p>
                <p>NIT: {isEditing ? (
                    <input type="text" name="nit" value={formData.nit} onChange={handleChange} />
                ) : herramienta.nit}</p>
                <p>Fecha de Entrada: {isEditing ? (
                    <input type="date" name="fecha_entrada" value={formData.fecha_entrada} onChange={handleChange} />
                ) : convertirFecha(herramienta.fecha_entrada)}</p>
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
                                name="fecha_entrada"
                                value={nuevoMantenimiento.fecha_entrada}
                                onChange={handleNuevoMantenimientoChange}
                                placeholder="Fecha de Entrada"
                            />
                            <input
                                type="text"
                                name="descripcion_dano"
                                value={nuevoMantenimiento.descripcion_dano}
                                onChange={handleNuevoMantenimientoChange}
                                placeholder="Descripción del Daño"
                            />
                            <input
                                type="date"
                                name="fecha_mantenimiento"
                                value={nuevoMantenimiento.fecha_mantenimiento}
                                onChange={handleNuevoMantenimientoChange}
                                placeholder="Fecha de Mantenimiento"
                            />
                            <input
                                type="text"
                                name="descripcion_mantenimiento"
                                value={nuevoMantenimiento.descripcion_mantenimiento}
                                onChange={handleNuevoMantenimientoChange}
                                placeholder="Descripción del Mantenimiento"
                            />
                            <button onClick={handleAgregarMantenimiento}>Agregar Mantenimiento</button>
                            <button onClick={handleOcultarFormulario}>Cancelar</button>
                        </div>
                    )}
                </div>
            )}

            <div>
                <h3>Historial de Mantenimientos</h3>
                {mantenimientos.map(mantenimiento => (
                    <div key={mantenimiento.id_mantenimiento}>
                        <p>Fecha de Entrada: {convertirFecha(herramienta.fecha_entrada)}</p>
                        <p>Descripción del Daño: {mantenimiento.descripcion_dano}</p>
                        <p>Fecha de Mantenimiento: {convertirFecha(mantenimiento.fecha_mantenimiento)}</p>
                        <p>Descripción del Mantenimiento: {mantenimiento.descripcion_mantenimiento}</p>
                       <p>Nombre Técnico: {mantenimiento.nombre_tecnico}</p>
                    </div>
                ))}
            </div>

            <Modal
                isOpen={mostrarModalConfirmacion}
                onRequestClose={handleCerrarModal}
                style={{
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.75)',
                    },
                    content: {
                        width: '400px',
                        height: '200px',
                        margin: 'auto',
                        padding: '20px',
                        backgroundColor: '#fff',
                        border: 'none',
                        borderRadius: '10px',
                        boxShadow: '0px 0px 10px rgba(0,0,0,0.5)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }
                }}
            >
                <h3>{mensajeModal}</h3>
                <button onClick={handleCerrarModal}>Aceptar</button>
            </Modal>
        </div>
    );
};

export default HerramientaDetalle;
