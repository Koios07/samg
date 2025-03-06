import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useParams, useNavigate } from 'react-router-dom';

const QRCodePage = ({ herramientas }) => {
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

    const imprimir = () => {
        window.print();
    };

    return (
        <div className="qr-container">
            <QRCodeSVG className="qr-imprimir" value={url} size={256} />
            <div className="botones no-imprimir" style={{ marginTop: '40px' }}>
                <button onClick={() => navigate(-1)} style={{ marginRight: '10px' }}>
                    Atrás
                </button>
                <button onClick={imprimir}>
                    Imprimir
                </button>
            </div>
        </div>
    );
};

export default QRCodePage;
