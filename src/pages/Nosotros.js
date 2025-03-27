import React from 'react';
import './Nosotros.css'; // Importar el archivo CSS
import imagenTaller from '../assets/images/imagenTaller.jpg';
import iconoServicio from '../assets/images/iconoServicio.ico'; 
import iconoGarantia from '../assets/images/iconoGarantia.png'; // Importar icono de garantía
import iconoRepuestos from '../assets/images/iconoRepuestos.png'; // Importar icono de repuestos

const Nosotros = () => {
  return (
    <div className="nosotros-container">
      <div className="nosotros-content">
        <div className="nosotros-imagen">
          <img src={imagenTaller} alt="Taller de mantenimiento" />
        </div>
        <div className="nosotros-texto">
          <h2 className="nosotros-titulo">¿Quién es SAMG MANTENIMIENTO?</h2>
          <p className="nosotros-descripcion">
            SAMG es un centro de servicio autorizado de la marca MAKITA dedicado a la prestación de servicio técnico para herramientas eléctricas, garantías y mantenimientos para las máquinas nuevas de la marca Makita, comercialización de repuestos originales y alquiler de herramientas para la construcción. Contamos con personal capacitado y calificado para generar soluciones rápidas con los más altos estándares de calidad, comprometidos con el cumplimiento de los requisitos legales y la mejora continua para brindar siempre el mejor servicio.
          </p>
        </div>
      </div>

      <div className="mision-vision-container">
        <div className="mision">
          <h3>Misión</h3>
          <p>
            SAMG MANTENIMIENTO es un centro de servicio autorizado MAKITA caracterizado por su confiabilidad. Ofrecemos servicio de garantías y mantenimientos a herramientas nuevas de la marca Makita, servicio de mantenimiento para herramientas eléctricas de todas las marcas, y contamos con un almacén de repuestos ORIGINALES para agilizar los procedimientos. Cumplimos con los máximos estándares de calidad, promoviendo el desarrollo sostenible, económico y social de la región.
          </p>
        </div>

        <div className="vision">
          <h3>Visión</h3>
          <p>
            Para el año 2021, SAMG MANTENIMIENTO será una empresa líder en distribución y venta de repuestos, reconocida a nivel regional por su calidad y corto tiempo de solución frente a los inconvenientes expuestos por los clientes.
          </p>
        </div>
      </div>

      <div className="servicios-container">
        <h3>Servicios</h3>
        <ul className="servicios-lista">
          <li>
            <img src={iconoServicio} alt="Icono servicio" />
            <span>Mantenimiento de herramientas eléctricas</span>
          </li>
          <li>
            <img src={iconoGarantia} alt="Icono garantía" />
            <span>Servicio técnico autorizado y garantías</span>
          </li>
          <li>
            <img src={iconoRepuestos} alt="Icono repuestos" />
            <span>Venta de repuestos originales</span>
          </li>
          <li>
            <img src={iconoServicio} alt="Icono servicio" />
            <span>Alquiler de herramientas para la construcción</span>
          </li>
          <li>
            <img src={iconoGarantia} alt="Icono garantía" />
            <span>Domicilio gratis (recogida y entrega programada)</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Nosotros;
