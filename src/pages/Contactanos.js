import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Contactanos.css';

// Define el icono personalizado
const customIcon = L.icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png', // URL del icono rojo (puedes cambiarlo)
    iconSize: [25, 41], // Tamaño del icono
    iconAnchor: [12, 41], // Punto de anclaje del icono
    popupAnchor: [1, -34], // Punto de anclaje del popup
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    shadowSize: [41, 41],
    shadowAnchor: [12, 41]
});

function Contactanos() {
    const position = [7.0886258, -73.1039759];
    const googleMapsLink = "https://www.google.com/maps/place/SAMG+mantenimiento/@7.0886432,-73.1040087,20z/data=!4m15!1m8!3m7!1s0x8e683f9a6d10f455:0x5adcbd68d123cbfd!2sCra.+33+%23+112-31,+Sotomayor,+Floridablanca,+Santander!3b1!8m2!3d7.088574!4d-73.103853!16s%2Fg%2F11x05lqdlh!3m5!1s0x8e683fbdb710e74f:0xfe2dd8e0b017b1e9!8m2!3d7.0886258!4d-73.1039759!16s%2Fg%2F11j2ff6h53?hl=es&entry=ttu";

    return (
        <div className="contactanos-container">
            <h2>Contáctanos</h2>
            <p>
                Encuentra nuestra ubicación en el mapa o haz clic en el botón para chatear con nosotros directamente.
            </p>

            {/* Mapa interactivo */}
            <div className="map-container">
                <MapContainer center={position} zoom={18} style={{ height: "400px", width: "100%" }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={position} icon={customIcon}>
                        <Popup>
                            <b>SAMG Mantenimiento</b><br />
                            <a href={googleMapsLink} target="_blank" rel="noopener noreferrer">
                                Ver en Google Maps
                            </a>
                        </Popup>
                    </Marker>
                </MapContainer>
            </div>

            {/* Información de Contacto */}
            <div className="contact-info">
                <h3>Información de Contacto</h3>
                <div className="contact-card">
                    <div className="contact-item">
                        <strong>Dirección:</strong>
                        <p>Cra. 33 # 112-31, Barrio Caldas, Floridablanca, Santander</p>
                    </div>
                    <div className="contact-item">
                        <strong>Teléfono:</strong>
                        <p>+57 301 239 7269</p>
                    </div>
                    <div className="contact-item">
                        <strong>Email:</strong>
                        <p>samgmantenimiento@gmail.com</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Contactanos;
