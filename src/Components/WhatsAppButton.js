import React from 'react';
import './WhatsAppButton.css';

const WhatsAppButton = () => {
    const whatsappNumber = "573193947386"; // Número de WhatsApp
    const message = "¡Hola! Quisiera más información.";

    return (
        <a
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-button"
        >
            <i className="fab fa-whatsapp"></i> {/* Usa la clase 'fab fa-whatsapp' */}
        </a>
    );
};

export default WhatsAppButton;
