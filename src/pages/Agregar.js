import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Agregar.css';

const Agregar = ({ onAddArticulo }) => {
    const [nombreHerramienta, setNombreHerramienta] = useState('');
    const [marca, setMarca] = useState('');
    const [modelo, setModelo] = useState('');
    const [propietario, setPropietario] = useState('');
    const [nit, setNit] = useState('');
    const [ultimoMantenimiento, setUltimoMantenimiento] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validación básica de campos
        if (!nombreHerramienta || !marca || !modelo || !propietario || !nit || !ultimoMantenimiento) {
            setMessage('Por favor, complete todos los campos.');
            return;
        }

        const nuevaHerramienta = {
            herramienta: nombreHerramienta,
            marca,
            modelo,
            propietario,
            nit,
            ultimo_mantenimiento: ultimoMantenimiento
        };

        try {
            // Obtener el user-id del almacenamiento local
            const userId = localStorage.getItem('userId');

            if (!userId) {
                setMessage('No se encontró el ID del usuario. Por favor inicie sesión nuevamente.');
                navigate('/login'); // Redirigir al usuario a la página de inicio de sesión
                return;
            }

            const response = await fetch('http://localhost:3001/herramientas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'user-id': userId // Enviar el ID del usuario en los headers
                },
                body: JSON.stringify(nuevaHerramienta)
            });

          if (!response.ok) {
                // Si la respuesta no es exitosa, lanzar un error
                const errorData = await response.json();
                 throw new Error(`${errorData.message}`);
            }

            const data = await response.json();
            onAddArticulo({ ...nuevaHerramienta, id_articulo: data.id_articulo });

            // Mostrar un modal de éxito
            setMessage('Herramienta agregada exitosamente.');
            window.alert('Herramienta agregada exitosamente.');

            // Limpiar los campos del formulario
            setNombreHerramienta('');
            setMarca('');
            setModelo('');
            setPropietario('');
            setNit('');
            setUltimoMantenimiento('');

            // Redirigir al usuario a la página de búsqueda
            navigate('/buscar');
        } catch (error) {
             console.error('Hubo un error al agregar la herramienta:', error);
            setMessage(error.message);
        }
    };

    return (
        <div className="box">
            <h1>Agregar Herramienta</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Herramienta"
                    value={nombreHerramienta}
                    onChange={(e) => setNombreHerramienta(e.target.value)}
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
                <input
                    type="text"
                    placeholder="Nit"
                    value={nit}
                    onChange={(e) => setNit(e.target.value)}
                    required
                />
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
                <input type="submit" value="Agregar Herramienta" />
            </form>
            {message && <p className="message">{message}</p>}
        </div>
    );
};

export default Agregar;
