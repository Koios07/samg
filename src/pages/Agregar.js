import React, { useState } from 'react';
import './Agregar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

const Agregar = () => {
    const [herramienta, setHerramienta] = useState('');
    const [marca, setMarca] = useState('');
    const [modelo, setModelo] = useState('');
    const [propietario, setPropietario] = useState('');
    const [fecha_entrada, setFechaEntrada] = useState('');
    const [nombre_trabajador, setNombreTrabajador] = useState('');
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
            nombre_trabajador,
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

    return (
        <div className="agregar">
            <h1>Agregar Herramienta</h1>
            <form onSubmit={handleSubmit} className="agregar-form">
                <div className="form-group">
                    <label htmlFor="herramienta">Herramienta:</label>
                    <input
                        type="text"
                        id="herramienta"
                        value={herramienta}
                        onChange={(e) => setHerramienta(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="marca">Marca:</label>
                    <input
                        type="text"
                        id="marca"
                        value={marca}
                        onChange={(e) => setMarca(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="modelo">Modelo:</label>
                    <input
                        type="text"
                        id="modelo"
                        value={modelo}
                        onChange={(e) => setModelo(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="propietario">Propietario:</label>
                    <input
                        type="text"
                        id="propietario"
                        value={propietario}
                        onChange={(e) => setPropietario(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="fecha_entrada">Fecha de Entrada:</label>
                    <input
                        type="date"
                        id="fecha_entrada"
                        value={fecha_entrada}
                        onChange={(e) => setFechaEntrada(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="nombre_trabajador">Nombre del Trabajador:</label>
                    <input
                        type="text"
                        id="nombre_trabajador"
                        value={nombre_trabajador}
                        onChange={(e) => setNombreTrabajador(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="nit">Nit:</label>
                    <input
                        type="text"
                        id="nit"
                        value={nit}
                        onChange={(e) => setNit(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="descripcion_dano">Descripción del Daño:</label>
                    <input
                        type="text"
                        id="descripcion_dano"
                        value={descripcion_dano}
                        onChange={(e) => setDescripcionDano(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="fecha_mantenimiento">Fecha de Mantenimiento:</label>
                    <input
                        type="date"
                        id="fecha_mantenimiento"
                        value={fecha_mantenimiento}
                        onChange={(e) => setFechaMantenimiento(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="descripcion_mantenimiento">Descripción del Mantenimiento:</label>
                    <input
                        type="text"
                        id="descripcion_mantenimiento"
                        value={descripcion_mantenimiento}
                        onChange={(e) => setDescripcionMantenimiento(e.target.value)}
                    />
                </div>
                <button type="submit" className="agregar-button">Agregar</button>
            </form>
        </div>
    );
}

export default Agregar;
