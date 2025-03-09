import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import moment from 'moment';

const Historial = () => {
    const [nit, setNit] = useState('');
    const [data, setData] = useState([]);

    const handleNitChange = (event) => {
        setNit(event.target.value);
    };

    const handleDescargarClick = async () => {
        if (!nit) {
            alert("Por favor, ingrese un NIT.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:3001/historial?nit=${nit}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            let responseData = await response.json();

            // Formatear las fechas y agregar los campos solicitados
            responseData = responseData.map(item => ({
                id_herramienta: item.id_articulo,
                id_mantenimiento: item.id_mantenimiento,
                nit: item.nit,
                herramienta: item.herramienta,
                marca: item.marca,
                modelo: item.modelo,
                propietario: item.propietario,
                fecha_entrada: item.fecha_entrada ? moment(item.fecha_entrada).format('DD/MM/YYYY') : '',
                fecha_mantenimiento: item.fecha_mantenimiento ? moment(item.fecha_mantenimiento).format('DD/MM/YYYY') : '',
                descripcion_dano: item.descripcion_dano,
                descripcion_mantenimiento: item.descripcion_mantenimiento,
                nombre_tecnico: item.nombre_tecnico
            }));

            if (responseData.length === 0) {
                alert("No se encontraron registros para el NIT proporcionado.");
                return;
            }

            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.json_to_sheet(responseData);
            XLSX.utils.book_append_sheet(wb, ws, "Historial");
            XLSX.writeFile(wb, `Historial_${nit}.xlsx`);

        } catch (error) {
            console.error("Error al obtener o descargar los datos:", error);
            alert("Error al obtener o descargar los datos. Por favor, inténtelo de nuevo.");
        }
    };

    return (
        <div>
            <h2>Descargar Historial por NIT</h2>
            <div>
                <label htmlFor="nit">NIT:</label>
                <input
                    type="text"
                    id="nit"
                    value={nit}
                    onChange={handleNitChange}
                />
                <button onClick={handleDescargarClick}>
                    Descargar Historial
                </button>
            </div>
        </div>
    );
};

export default Historial;
