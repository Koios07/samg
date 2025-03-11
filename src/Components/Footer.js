import React from 'react';
import './Footer.css'; // Importa el archivo CSS
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faFacebook,
    faTwitter,
    faInstagram,
} from '@fortawesome/free-brands-svg-icons';
import {
    faMapMarkerAlt,
    faPhone,
    faEnvelope,
} from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="row">
                    <div className="col-md-4">
                        <h4>Ubicaciones</h4>
                        <ul>
                            <li><FontAwesomeIcon icon={faMapMarkerAlt} /> Dirección 1: Calle Principal #123, Ciudad</li>
                            <li><FontAwesomeIcon icon={faMapMarkerAlt} /> Dirección 2: Calle Secundaria #456, Ciudad</li>
                        </ul>
                    </div>
                    <div className="col-md-4">
                        <h4>Contacto</h4>
                        <ul>
                            <li><FontAwesomeIcon icon={faPhone} /> Teléfono: +57 1234567890</li>
                            <li><FontAwesomeIcon icon={faWhatsapp} /> WhatsApp: +57 9876543210</li>
                            <li><FontAwesomeIcon icon={faEnvelope} /> Correo electrónico: info@example.com</li>
                        </ul>
                    </div>
                    <div className="col-md-4">
                        <h4>Redes Sociales</h4>
                        <div className="social-icons">
                            <a href="https://www.facebook.com/example" target="_blank" rel="noopener noreferrer" style={{ color: 'white' }}><FontAwesomeIcon icon={faFacebook} size="lg" /></a>
                            <a href="https://www.twitter.com/example" target="_blank" rel="noopener noreferrer" style={{ color: 'white', marginLeft: '10px' }}><FontAwesomeIcon icon={faTwitter} size="lg" /></a>
                            <a href="https://www.instagram.com/example" target="_blank" rel="noopener noreferrer" style={{ color: 'white', marginLeft: '10px' }}><FontAwesomeIcon icon={faInstagram} size="lg" /></a>
                        </div>
                    </div>
                </div>
                <div className="copyright">
                    <p style={{ textAlign: 'center' }}>&copy; 2025 Example. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
