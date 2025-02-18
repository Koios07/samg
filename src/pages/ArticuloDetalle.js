// src/pages/ArticuloDetalle.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ArticuloDetalle = ({ onUpdateArticulo, isLoggedIn }) => {
    const { id_articulo } = useParams();
    const navigate = useNavigate();
    const [articulo, setArticulo] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        articulo: '',
        marca: '',
        modelo: '',
        propietario: '',
        nit:'',
        ultimo_mantenimiento: '',
        nombre_trabajador: ''
    });

    // Cargar los datos del artículo
    useEffect(() => {
        const fetchArticulo = async () => {
            try {
                const response = await fetch(`http://localhost:3001/articulos/${id_articulo}`);
                if (!response.ok) throw new Error('Error al obtener el artículo');
                const data = await response.json();
                setArticulo(data);
                setFormData({
                    articulo: data.articulo,
                    marca: data.marca,
                    modelo: data.modelo,
                    propietario: data.propietario,
                    nit: data.nit,
                    ultimo_mantenimiento: data.ultimo_mantenimiento,
                    nombre_trabajador: data.nombre_trabajador,
                });
            } catch (error) {
                console.error('Error fetching articulo:', error);
            }
        };

        fetchArticulo();
    }, [id_articulo]);

    // Manejar cambios en los campos del formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Guardar los cambios al hacer clic en "Guardar"
    const handleSave = async () => {
        try {
            const response = await fetch(`http://localhost:3001/articulos/${id_articulo}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Error al actualizar el artículo');

            // Actualizar el estado con los datos actualizados
            const updatedResponse = await fetch(`http://localhost:3001/articulos/${id_articulo}`);
            const updatedArticuloData = await updatedResponse.json();
            setArticulo(updatedArticuloData);

            if (onUpdateArticulo) onUpdateArticulo(updatedArticuloData);

            setIsEditing(false); // Salir del modo edición
            alert('Artículo actualizado exitosamente.');
        } catch (error) {
            console.error('Error al guardar el artículo:', error);
        }
    };

    if (!articulo) return <div>Cargando...</div>;

    return (
        <div>
            <h1>{isEditing ? 'Editar Artículo' : 'Detalles del Artículo'}</h1>

            {isEditing ? (
                <div>
                    <input type="text" name="articulo" value={formData.articulo} onChange={handleChange} placeholder="Nombre de la Herramienta" required />
                    <input type="text" name="marca" value={formData.marca} onChange={handleChange} placeholder="Marca" required />
                    <input type="text" name="modelo" value={formData.modelo} onChange={handleChange} placeholder="Modelo" required />
                    <input type="text" name="propietario" value={formData.propietario} onChange={handleChange} placeholder="Propietario" required />
                    <input type="text" name="nit" value={formData.nit} onChange={handleChange} placeholder="Nit" required />
                    <input type="date" name="ultimo_mantenimiento" value={formData.ultimo_mantenimiento} onChange={handleChange} required />
                    <input type="text" name="nombre_trabajador" value={formData.nombre_trabajador} onChange={handleChange} placeholder="Nombre del Técnico" required />
                    
                    <div>
                        <button onClick={handleSave}>Guardar</button>
                        <button onClick={() => setIsEditing(false)}>Cancelar</button>
                    </div>
                </div>
            ) : (
                <div>
                    {/* Mostrar detalles del artículo en una tabla */}
                    <table border="1">
                        <tbody>
                            <tr>
                                <td><strong>Nombre de la Herramienta</strong></td>
                                <td>{articulo.articulo}</td>
                            </tr>
                            <tr>
                                <td><strong>Marca</strong></td>
                                <td>{articulo.marca}</td>
                            </tr>
                            <tr>
                                <td><strong>Modelo</strong></td>
                                <td>{articulo.modelo}</td>
                            </tr>
                            <tr>
                                <td><strong>Propietario</strong></td>
                                <td>{articulo.propietario}</td>
                            </tr>
                            <tr>
                                <td><strong>Propietario</strong></td>
                                <td>{articulo.nit}</td>
                            </tr>
                            <tr>
                                <td><strong>Último Mantenimiento</strong></td>
                                <td>{new Date(articulo.ultimo_mantenimiento).toLocaleDateString()}</td>
                            </tr>
                            <tr>
                                <td><strong>Técnico</strong></td>
                                <td>{articulo.nombre_trabajador}</td>
                            </tr>
                        </tbody>
                    </table>

                    {/* Botones "Atrás" y "Editar" */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                        {/* Mostrar botón Editar solo si el usuario está logueado */}
                        {isLoggedIn && (
                            <>
                                <button onClick={() => setIsEditing(true)}>Editar</button> {/* Botón editar */}
                            </>
                        )}
                        {/* Botón atrás */}
                        <button onClick={() => navigate('/buscar')}>Atrás</button> 
                    </div>
                </div>
            )}
        </div>
    );
};

export default ArticuloDetalle;
