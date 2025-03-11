import React from 'react';
import { Carousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css'

const Home = () => {
    return (
        <div className="home-container">
            {/* Sección 1: Slider */}
            <section className="slider-section">
                <Carousel className="carousel">
                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src="data:image/jpeg;base64,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"
                            alt="Imagen 1"
                        />
                        <Carousel.Caption>
                            <h3>Mantenimiento Preventivo</h3>
                            <p>Evita problemas futuros con nuestros servicios de mantenimiento preventivo.</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src="https://via.placeholder.com/800x400?text=Imagen+2"
                            alt="Imagen 2"
                        />
                        <Carousel.Caption>
                            <h3>Mantenimiento Correctivo</h3>
                            <p>Resolvemos problemas rápidamente con nuestro equipo especializado.</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src="https://via.placeholder.com/800x400?text=Imagen+3"
                            alt="Imagen 3"
                        />
                        <Carousel.Caption>
                            <h3>Asesoramiento Técnico</h3>
                            <p>Contamos con expertos que te ayudarán a optimizar tus herramientas.</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                </Carousel>
            </section>

            {/* Sección 2: Acerca de Nosotros */}
            <section className="about-section">
                <div className="container">
                    <h2>Acerca de Nosotros</h2>
                    <p>
                        Somos una empresa especializada en mantenimientos de herramientas, comprometidos con la calidad y la eficiencia.
                        Nuestro equipo de expertos está listo para ayudarte a mantener tus herramientas en óptimas condiciones.
                    </p>
                    <div className="row">
                        <div className="col-md-4">
                            <i className="fas fa-cog fa-3x"></i>
                            <h4>Mantenimiento Preventivo</h4>
                            <p>Evita problemas futuros con nuestros servicios de mantenimiento preventivo.</p>
                        </div>
                        <div className="col-md-4">
                            <i className="fas fa-wrench fa-3x"></i>
                            <h4>Mantenimiento Correctivo</h4>
                            <p>Resolvemos problemas rápidamente con nuestro equipo especializado.</p>
                        </div>
                        <div className="col-md-4">
                            <i className="fas fa-chart-line fa-3x"></i>
                            <h4>Asesoramiento Técnico</h4>
                            <p>Contamos con expertos que te ayudarán a optimizar tus herramientas.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Sección 3: Llamada a la Acción */}
            <section className="cta-section">
                <div className="container">
                    <h2>¿Necesitas Ayuda?</h2>
                    <p>
                        ¡No dudes en contactarnos! Estamos aquí para ayudarte con cualquier consulta o servicio que necesites.
                    </p>
                    <button className="btn btn-primary">Contactanos</button>
                </div>
            </section>
        </div>
    );
};

export default Home;
