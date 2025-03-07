import React, { useState } from 'react';
import * as XLSX from 'xlsx';

const Masivos = ({ onClose, herramientas, accion }) => {
    const [selectedFile, setSelectedFile] = useState(null);

    const generarExcel = () => {
        const headers = [
            "herramienta",
            "marca",
            "modelo",
            "propietario",
            "fecha_entrada",
            "nombre_trabajador",
            "nit",
            "descripcion_daño",
            "fecha mantenimiento",
            "descripcion_manenimiento"

        ];

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet([headers]);
        XLSX.utils.book_append_sheet(wb, ws, "Herramientas");

        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([new Uint8Array(wbout)], { type: 'application/octet-stream' });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'plantilla_herramientas.xlsx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        onClose();
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleFileUpload = async () => {
        if (selectedFile) {
            const reader = new FileReader();

            reader.onload = async (e) => {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);

                console.log('Datos del Excel:', jsonData);

                try {
                    const response = await fetch('http://localhost:3001/importar-herramientas', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(jsonData),
                    });

                    if (response.ok) {
                        alert('Datos importados correctamente');
                    } else {
                        throw new Error('Error al importar datos');
                    }
                } catch (error) {
                    console.error('Error al importar datos:', error);
                    alert('Error al importar datos');
                }
                onClose();
            };

            reader.readAsArrayBuffer(selectedFile);
        } else {
            alert('Por favor, seleccione un archivo');
        }
    };

    return (
        <div className="masivos-container">
            <h2>{accion === 'cargar' ? 'Cargar Archivo' : 'Descargar Plantilla'}</h2>
            {accion === 'cargar' ? (
                <>
                    <input
                        type="file"
                        accept=".xlsx, .xls"
                        onChange={handleFileChange}
                    />
                    <button className="masivos-button" onClick={handleFileUpload}>
                        Cargar Herramientas
                    </button>
                </>
            ) : (
                <button className="masivos-button" onClick={generarExcel}>Descargar Plantilla</button>
            )}
            <button onClick={onClose}>Cerrar</button>
        </div>
    );
};

export default Masivos;
