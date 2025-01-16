// src/pages/ArticuloDetalle.js

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ArticuloDetalle = ({ articulos }) => {
  const { id_articulo } = useParams();
  const navigate = useNavigate(); // Hook para navegar
  const articulo = articulos.find(item => item.id_articulo.toString() === id_articulo);

  if (!articulo) {
    return <div>No se encontró el artículo.</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Detalles del Artículo</h2>
      <p><strong>ID:</strong> {articulo.id_articulo}</p>
      <p><strong>Descripción:</strong> {articulo.articulo}</p>
      <p><strong>Marca:</strong> {articulo.marca}</p>
      <p><strong>Modelo:</strong> {articulo.modelo}</p>
      <p><strong>Propietario:</strong> {articulo.propietario}</p>
      <p><strong>Último Mantenimiento:</strong> {new Date(articulo.ultimo_mantenimiento).toLocaleDateString()}</p>
      <p><strong>Técnico:</strong> {articulo.nombre_trabajador}</p>

      {/* Botón "Atrás" */}
      <button onClick={() => navigate(-1)} style={{ marginTop: '20px' }}>
        Atrás
      </button>
    </div>
  );
};

export default ArticuloDetalle;
