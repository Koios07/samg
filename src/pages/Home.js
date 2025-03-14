import React from 'react';
import { Carousel } from 'react-bootstrap';
import './Home.css';
import img1 from'../assets/images/img1.jpg';

const Home = () => {
    return (
        <div className="home-container">
            {/* Sección 1: Slider */}
            <section className="slider-section">
                <Carousel className="carousel">
                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src="img1.jpg"
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
