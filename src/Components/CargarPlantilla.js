import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import moment from 'moment';

const CargarPlantilla = () => {
    const [archivo, setArchivo] = useState(null);

    const handleArchivoCambiado = (event) => {
        setArchivo(event.target.files[0]);
    };

    const handleCargarPlantilla = async () => {
        if (!archivo) {
            alert('Por favor, selecciona un archivo.');
            return;
        }

        const reader = new FileReader();
        reader.onload = async (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false });

            // Verificar encabezados
            const expectedHeaders = [
                "Herramienta", "Marca", "Modelo", "Propietario", "Fecha de Ingreso",
                "Nit", "Tecnico", "Descripcion_dano", "fecha_mantenimiento", "descripcion_mantenimiento"
            ];
            const actualHeaders = jsonData[0];

            if (!actualHeaders || actualHeaders.length !== expectedHeaders.length || !actualHeaders.every((header, index) => header === expectedHeaders[index])) {
                alert('El archivo no tiene el formato correcto. Verifique los encabezados.');
                return;
            }

            const dataRows = jsonData.slice(1);

            const herramientas = dataRows.map(row => {
                // Formatear fechas usando moment.js
                const fechaEntrada = row[4] ? moment(row[4], ['D/M/YY', 'D/M/YYYY', 'YYYY-MM-DD']).format('YYYY-MM-DD') : null;
                const fechaMantenimiento = row[8] ? moment(row[8], ['D/M/YY', 'D/M/YYYY', 'YYYY-MM-DD']).format('YYYY-MM-DD') : null;

                return {
                    herramienta: row[0] || null,
                    marca: row[1] || null,
                    modelo: row[2] || null,
                    propietario: row[3] || null,
                    fecha_entrada: fechaEntrada,
                    nit: row[5] || null,
                    tecnico: row[6] || null,
                    descripcion_dano: row[7] || null,
                    fecha_mantenimiento: fechaMantenimiento,
                    descripcion_mantenimiento: row[9] || null
                };
            });

            console.log('Herramientas a enviar:', herramientas);  // Verificar los datos antes de enviar

            try {
                const response = await fetch('http://localhost:3001/herramientas/masivo', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'user-id': localStorage.getItem('userId')
                    },
                    body: JSON.stringify(herramientas)
                });

                if (!response.ok) {
                    console.error('Error al cargar las herramientas:', response.statusText);
                    const errorText = await response.text();
                    console.error('Error del servidor:', errorText);
                    alert(`Error al cargar las herramientas: ${response.statusText}. Consulte la consola para más detalles.`);
                    return;
                }

                const result = await response.json();
                console.log('Herramientas cargadas exitosamente:', result);
                alert('Herramientas cargadas exitosamente.');

            } catch (error) {
                console.error('Error al cargar las herramientas:', error);
                alert(`Error al cargar las herramientas. Consulte la consola para más detalles.`);
                return;
            }
        };
        reader.readAsArrayBuffer(archivo);
    };

    return (
        <div>
            <input type="file" accept=".xlsx, .xls" onChange={handleArchivoCambiado} />
            <button onClick={handleCargarPlantilla}>Cargar Plantilla</button>
        </div>
    );
};

export default CargarPlantilla;
