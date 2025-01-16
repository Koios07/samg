// src/pages/QRCode.js

import React from 'react';
import { QRCodeSVG } from 'qrcode.react'; // Asegúrate de usar la importación correcta
import { useParams, useNavigate } from 'react-router-dom'; // Importa useParams y useNavigate

const QRCodePage = ({ articulos }) => {
  const { id_articulo } = useParams(); // Obtiene el ID del artículo de los parámetros de la URL
  const navigate = useNavigate(); // Hook para navegar
  const articulo = articulos.find(item => item.id_articulo.toString() === id_articulo); // Busca el artículo correspondiente

  if (!articulo) {
    return <div>No se encontró el artículo.</div>;
  }

  return (
    <div style={{ textAlign: 'center', margin: '20px' }}>
      <h1>Código QR para {articulo.articulo}</h1>
      <QRCodeSVG value={`ID: ${articulo.id_articulo}`} size={256} /> {/* Muestra el ID en el QR */}
      <p>ID Artículo: {articulo.id_articulo}</p>
      
      {/* Botón "Atrás" */}
      <button onClick={() => navigate(-1)} style={{ marginTop: '20px' }}>
        Atrás
      </button>
    </div>
  );
};

export default QRCodePage;
