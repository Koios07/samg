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
                            <li><FontAwesomeIcon icon={faMapMarkerAlt} /> Carrera 33 No. 112-31 Barrio Caldas  Floridablanca</li>
                        </ul>
                    </div>
                    <div className="col-md-4">
                        <h4>Contacto</h4>
                        <ul>
                            <li><FontAwesomeIcon icon={faPhone} /> 301 239 7269</li>
                            <li><FontAwesomeIcon icon={faWhatsapp} /> 319 394 7386</li>
                            <li><FontAwesomeIcon icon={faEnvelope} /> samgmantenimiento@gmail.com</li>
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
                    <p style={{ textAlign: 'center' }}>&copy; 2025 SAMG Mantenimientos. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
