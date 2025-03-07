import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useParams, useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import './QRCode.css';

const QRCodePage = ({ herramientas }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { id_articulo } = useParams();
    const navigate = useNavigate();

    if (!herramientas) {
        return <div>No se recibieron herramientas.</div>;
    }

    const articulo = herramientas.find(item => item.id_articulo.toString() === id_articulo);

    if (!articulo) {
        return <div>No se encontró el artículo.</div>;
    }

    const url = `${window.location.origin}/herramienta/${articulo.id_articulo}`;

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const imprimir = () => {
        window.print();
    };

    return (
        <div className="qr-container">
            <button onClick={handleOpenModal}>Ver QR</button>

            <Modal
                isOpen={isModalOpen}
                onRequestClose={handleCloseModal}
                style={{
                    overlay: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        padding: '20px',
                        borderRadius: '8px',
                        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)'
                    }
                }}
                contentLabel="QR Code"
            >
                <h2>QR Code</h2>
                <QRCodeSVG value={url} size={256} />
                <div className="modal-buttons">
                    <button onClick={imprimir}>Imprimir</button>
                    <button onClick={handleCloseModal}>Cerrar</button>
                </div>
            </Modal>

            <button onClick={() => navigate(-1)} style={{ marginTop: '20px' }}>
                Atrás
            </button>
        </div>
    );
};

export default QRCodePage;
