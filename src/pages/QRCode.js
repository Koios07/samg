import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useParams, useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import './QRCode.css';

const QRCodePage = ({ herramientas }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { id_articulo } = useParams();
    const navigate = useNavigate();
    const qrCodeRef = useRef(null);

    if (!herramientas) return <div>No se recibieron herramientas.</div>;

    const articulo = herramientas.find(item =>
        item.id_articulo.toString() === id_articulo
    );

    if (!articulo) return <div>Artículo no encontrado</div>;

    const url = `${window.location.origin}/herramienta/${articulo.id_articulo}`;

    const imprimir = () => {
        const svg = qrCodeRef.current.querySelector('svg');
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.onload = () => {
            canvas.width = 190;
            canvas.height = 190;
            ctx.drawImage(img, 0, 0, 190, 190);
            const pngData = canvas.toDataURL('image/png');
            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                <html>
                    <head>
                        <title>QR Code</title>
                        <style>
                            @page {
                                size: A4; /* Tamaño de página fijo */
                                margin: 0mm !important; /* Márgenes cero */
                            }
                            body {
                                margin: 0 !important;
                                padding: 0 !important;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                height: 100vh !important; /* Casi toda la altura */
                                font-size: 0; /* Elimina cualquier espacio de texto */
                            }
                            img {
                                width: 190mm !important; /* QR más grande */
                                height: 190mm !important;
                            }
                        </style>
                    </head>
                    <body>
                        <img src="${pngData}" alt="QR Code" />
                    </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.addEventListener('load', () => {
                printWindow.focus();
                printWindow.print();
                printWindow.close();
            }, true);
        };
        img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgData);
    };

    return (
        <div className="qr-container">
            <button onClick={() => setIsModalOpen(true)}>Ver QR</button>

            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                style={{
                    overlay: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        padding: 0,
                        borderRadius: 0,
                        boxShadow: 'none'
                    }
                }}
                contentLabel="QR Code"
            >
                <div className="qr-code-container">
                    <QRCodeSVG value={url} size={2048} ref={qrCodeRef} className="qr-code" />
                </div>
                <div className="modal-buttons">
                    <button onClick={imprimir}>Imprimir</button>
                    <button onClick={() => setIsModalOpen(false)}>Cerrar</button>
                </div>
            </Modal>

            <button onClick={() => navigate(-1)} style={{ marginTop: '20px' }}>
                Atrás
            </button>
        </div>
    );
};

export default QRCodePage;
