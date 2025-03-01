import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

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
        fecha_mantenimiento: '',
        descripcion_dano: '',
        descripcion_mantenimiento: '',
    });

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
                setHerramienta(updatedHerramienta);
                onUpdateHerramienta(updatedHerramienta);
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
            const response = await fetch(`http://localhost:3001/mantenimientos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'user-id': localStorage.getItem('userId') // Agrega el user-id al header
                },
                body: JSON.stringify({
                    ...nuevoMantenimiento,
                    id_herramienta: id_articulo,
                    nit: formData.nit,
                    nombre_trabajador: formData.nombre_trabajador
                })
            });

            if (response.ok) {
                const nuevoMantenimientoGuardado = await response.json();
                setMantenimientos([...mantenimientos, nuevoMantenimientoGuardado]);
                setNuevoMantenimiento({
                    fecha_mantenimiento: '',
                    descripcion_dano: '',
                    descripcion_mantenimiento: '',
                });
            } else {
                console.error('Error al agregar el mantenimiento');
            }
        } catch (error) {
            console.error('Error al agregar el mantenimiento:', error);
        }
    };

    if (!herramienta) {
        return <div>Cargando...</div>;
    }

    return (
        <div>
            <h2>Detalle de Herramienta</h2>
            <Link to="/buscar">Volver a la búsqueda</Link>

            <div>
                <p>Herramienta: {herramienta.herramienta}</p>
                <p>Marca: {herramienta.marca}</p>
                <p>Modelo: {herramienta.modelo}</p>
                <p>Propietario: {herramienta.propietario}</p>
                <p>NIT: {herramienta.nit}</p>
                <p>Fecha de Entrada: {herramienta.fecha_entrada}</p>
                <p>Técnico: {herramienta.nombre_trabajador}</p>
                {isLoggedIn && (userType === '1' || userType === '2') && (
                    <button onClick={() => setIsEditing(true)}>Editar</button>
                )}
            </div>

            {isLoggedIn && (userType === '1' || userType === '2') && (
                <div>
                    <h3>Agregar Mantenimiento</h3>
                    <input
                        type="date"
                        name="fecha_mantenimiento"
                        value={nuevoMantenimiento.fecha_mantenimiento}
                        onChange={handleNuevoMantenimientoChange}
                        placeholder="Fecha Mantenimiento"
                    />
                    <input
                        type="text"
                        name="descripcion_dano"
                        value={nuevoMantenimiento.descripcion_dano}
                        onChange={handleNuevoMantenimientoChange}
                        placeholder="Descripción del Daño"
                    />
                    <input
                        type="text"
                        name="descripcion_mantenimiento"
                        value={nuevoMantenimiento.descripcion_mantenimiento}
                        onChange={handleNuevoMantenimientoChange}
                        placeholder="Descripción del Mantenimiento"
                    />
                    <button onClick={handleAgregarMantenimiento}>Agregar Mantenimiento</button>
                </div>
            )}

            <div>
                <h3>Historial de Mantenimientos</h3>
                {mantenimientos.map(mantenimiento => (
                    <div key={mantenimiento.id_mantenimiento}>
                        <p>Fecha: {mantenimiento.fecha_mantenimiento}</p>
                        <p>Daño: {mantenimiento.descripcion_dano}</p>
                        <p>Mantenimiento: {mantenimiento.descripcion_mantenimiento}</p>
                        <p>Técnico: {mantenimiento.nombre_trabajador}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HerramientaDetalle;
