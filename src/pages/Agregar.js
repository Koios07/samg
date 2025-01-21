// src/pages/Agregar.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Agregar = () => {
    const [nombreArticulo, setNombreArticulo] = useState('');
    const [marca, setMarca] = useState('');
    const [modelo, setModelo] = useState('');
    const [propietario, setPropietario] = useState('');
    const [ultimoMantenimiento, setUltimoMantenimiento] = useState('');
    const [nombreTecnico, setNombreTecnico] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const nuevoArticulo = {
            articulo: nombreArticulo,
            marca,
            modelo,
            propietario,
            ultimo_mantenimiento: ultimoMantenimiento,
            nombre_trabajador: nombreTecnico
        };

        try {
            const response = await fetch('http://localhost:3001/articulos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(nuevoArticulo)
            });

            if (response.ok) {
                setMessage('Artículo agregado exitosamente.');
                // Limpiar campos después de agregar
                setNombreArticulo('');
                setMarca('');
                setModelo('');
                setPropietario('');
                setUltimoMantenimiento('');
                setNombreTecnico('');

                // Redirigir a la página de búsqueda después de un breve retraso
                setTimeout(() => {
                    navigate('/buscar');
                }, 2000);
            } else {
                const data = await response.json();
                setMessage(data.message || 'Error al agregar el artículo.');
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('No se pudo conectar con el servidor. Por favor, verifica tu conexión.');
        }
    };

    return (
        <div className="box">
            <h1>Agregar Artículo</h1>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    placeholder="Nombre del Artículo" 
                    value={nombreArticulo} 
                    onChange={(e) => setNombreArticulo(e.target.value)} 
                    required 
                />
                <input 
                    type="text" 
                    placeholder="Marca" 
                    value={marca} 
                    onChange={(e) => setMarca(e.target.value)} 
                    required 
                />
                <input 
                    type="text" 
                    placeholder="Modelo" 
                    value={modelo} 
                    onChange={(e) => setModelo(e.target.value)} 
                    required 
                />
                <input 
                    type="text" 
                    placeholder="Propietario" 
                    value={propietario} 
                    onChange={(e) => setPropietario(e.target.value)} 
                    required 
                />
                
                <div className="form-group">
                    <input 
                        type="text" 
                        placeholder="Nombre del Técnico" 
                        value={nombreTecnico} 
                        onChange={(e) => setNombreTecnico(e.target.value)} 
                        required 
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="ultimoMantenimiento">Último Mantenimiento:</label>
                    <input 
                        type="date" 
                        id="ultimoMantenimiento"
                        value={ultimoMantenimiento} 
                        onChange={(e) => setUltimoMantenimiento(e.target.value)} 
                        className="custom-date-input"
                        required 
                    />
                </div>

                <input type="submit" value="Agregar Artículo" />
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Agregar;
