import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import './Agregar.css'

const Agregar = () => {
    const [herramienta, setHerramienta] = useState('');
    const [marca, setMarca] = useState('');
    const [modelo, setModelo] = useState('');
    const [propietario, setPropietario] = useState('');
    const [fecha_entrada, setFechaEntrada] = useState('');
    const [nit, setNit] = useState('');
    const [descripcion_dano, setDescripcionDano] = useState('');
    const [fecha_mantenimiento, setFechaMantenimiento] = useState('');
    const [descripcion_mantenimiento, setDescripcionMantenimiento] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Crear el objeto con los datos del formulario
        const data = {
            herramienta,
            marca,
            modelo,
            propietario,
            fecha_entrada,
            nit,
            descripcion_dano,
            fecha_mantenimiento,
            descripcion_mantenimiento
        };

        console.log('Datos a enviar:', data); // Agregar console.log

        try {
            const response = await fetch('http://localhost:3001/herramientas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'user-id': localStorage.getItem('userId') // Enviar userId desde localStorage
                },
                body: JSON.stringify(data)
            });

            console.log('Respuesta del servidor:', response); // Agregar console.log

            if (response.ok) {
                alert('Herramienta agregada exitosamente.');
                navigate('/buscar');
            } else {
                // Si la respuesta no es exitosa, intentar leer el mensaje de error
                let errorMessage = 'Error al agregar la herramienta.';
                try {
                    const errorBody = await response.json();
                    errorMessage = errorBody.message || errorMessage;
                    console.log('Error del servidor:', errorBody); // Agregar console.log
                } catch (e) {
                    // Si hay un error al leer el cuerpo de la respuesta, usar el mensaje de error genérico
                    console.error('Error al leer el cuerpo de la respuesta:', e);
                }
                alert(errorMessage);
            }
        } catch (error) {
            console.error('Error al enviar la solicitud:', error);
            alert('Error al agregar la herramienta.');
        }
    };

    const handleGoBack = () => {
        navigate('/buscar');
    };

    return (
        <div className="container mt-4">
            <div className="card">
                <div className="card-body">
                    <h2 className="text-center">Agregar Herramienta</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="herramienta" className="form-label">Herramienta:</label>
                            <input
                                type="text"
                                id="herramienta"
                                value={herramienta}
                                onChange={(e) => setHerramienta(e.target.value)}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="marca" className="form-label">Marca:</label>
                            <input
                                type="text"
                                id="marca"
                                value={marca}
                                onChange={(e) => setMarca(e.target.value)}
                                className="form-control"
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="modelo" className="form-label">Modelo:</label>
                            <input
                                type="text"
                                id="modelo"
                                value={modelo}
                                onChange={(e) => setModelo(e.target.value)}
                                className="form-control"
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="propietario" className="form-label">Propietario:</label>
                            <input
                                type="text"
                                id="propietario"
                                value={propietario}
                                onChange={(e) => setPropietario(e.target.value)}
                                className="form-control"
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="fecha_entrada" className="form-label">
                                Fecha de Entrada <span style={{ color: 'red' }}>*</span>
                            </label>
                            <input
                                type="date"
                                id="fecha_entrada"
                                value={fecha_entrada}
                                onChange={(e) => setFechaEntrada(e.target.value)}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="nit" className="form-label">Nit:</label>
                            <input
                                type="text"
                                id="nit"
                                value={nit}
                                onChange={(e) => setNit(e.target.value)}
                                className="form-control"
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="descripcion_dano" className="form-label">Descripción del Daño:</label>
                            <input
                                type="text"
                                id="descripcion_dano"
                                value={descripcion_dano}
                                onChange={(e) => setDescripcionDano(e.target.value)}
                                className="form-control"
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="fecha_mantenimiento" className="form-label">
                                Fecha de Mantenimiento <span style={{ color: 'red' }}>*</span>
                            </label>
                            <input
                                type="date"
                                id="fecha_mantenimiento"
                                value={fecha_mantenimiento}
                                onChange={(e) => setFechaMantenimiento(e.target.value)}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="descripcion_mantenimiento" className="form-label">Descripción del Mantenimiento:</label>
                            <input
                                type="text"
                                id="descripcion_mantenimiento"
                                value={descripcion_mantenimiento}
                                onChange={(e) => setDescripcionMantenimiento(e.target.value)}
                                className="form-control"
                            />
                        </div>
                        <div className="d-flex justify-content-center gap-3 mt-4">
                            <button type="submit" className="agregar-button">Agregar</button>
                            <button type="button" onClick={handleGoBack} className="atras-button">Atrás</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Agregar;
