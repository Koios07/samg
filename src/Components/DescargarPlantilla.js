// DescargarPlantilla.js
import React from 'react';
import * as XLSX from 'xlsx';

const DescargarPlantilla = () => {
    const handleDescargarPlantilla = () => {
        const headers = [
            "Herramienta",
            "Marca",
            "Modelo",
            "Propietario",
            "Fecha de Ingreso",
            "Nit",
            "Tecnico",
            "Descripcion_dano",
            "fecha_mantenimiento",
            "descripcion_mantenimiento"
        ];

        // Agregar una fila de ejemplo con el formato de fecha deseado
        const exampleRow = [
            "", "", "", "", "DD-MM-AAAA", "", "", "", "DD-MM-AAAA", ""
        ];

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet([headers, exampleRow]);

        // Aplicar formato de texto a la columna "Fecha de Ingreso" (columna 5, índice 4)
        const columnIndex = 4;
        const cellRef = XLSX.utils.encode_cell({ c: columnIndex, r: 1 }); // Fila 2 (índice 1)
        ws[cellRef] = { t: 's', v: 'DD-MM-AAAA' };

        // Aplicar formato de texto a la columna "fecha_mantenimiento" (columna 9, índice 8)
        const columnIndex2 = 8;
        const cellRef2 = XLSX.utils.encode_cell({ c: columnIndex2, r: 1 }); // Fila 2 (índice 1)
        ws[cellRef2] = { t: 's', v: 'DD-MM-AAAA' };

        XLSX.utils.book_append_sheet(wb, ws, "Plantilla");
        XLSX.writeFile(wb, "plantilla_herramientas.xlsx");
    };

    return (
        <div>
            <button onClick={handleDescargarPlantilla}>Descargar Plantilla</button>
        </div>
    );
};

export default DescargarPlantilla;
