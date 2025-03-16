import React, { useState, useEffect } from 'react';
import './Home.css';
import makita from '../assets/images/makita.png';
import bosch from '../assets/images/bosch.png';

function Home() {
    const [activeSlide, setActiveSlide] = useState(0);
    
    // Diapositivas para el slider principal
    const mainSlides = [
        {
            id: 1,
            src: '/img/slide1.jpg',
            title: 'Mantenimiento Preventivo',
            text: 'Nuestros técnicos realizan mantenimientos regulares para evitar problemas futuros.'
        },
        {
            id: 2,
            src: '/img/slide2.jpg',
            title: 'Mantenimiento Correctivo',
            text: 'Solucionamos problemas técnicos de manera rápida y eficiente.'
        },
        {
            id: 3,
            src: '/img/slide3.jpg',
            title: 'Asistencia Técnica',
            text: 'Ofrecemos asesoramiento técnico especializado para todas tus herramientas.'
        }
    ];

    // Marcas para el carrusel
    const brands = [
        { name: 'Makita', logo: makita },
        { name: 'Bosch', logo: bosch },
        { name: 'Otra Marca 1', logo: '/img/brand1.png' },
        { name: 'Otra Marca 2', logo: '/img/brand2.png' },
        { name: 'Otra Marca 3', logo: '/img/brand3.png' },
        { name: 'Otra Marca 4', logo: '/img/brand4.png' }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveSlide(prev => (prev + 1) % mainSlides.length);
        }, 5000); // Cambia cada 5 segundos
        
        return () => clearInterval(interval);
    }, [mainSlides.length]);

    useEffect(() => {
        const carousel = document.querySelector('.carousel');
        let offset = 0;

        const interval = setInterval(() => {
            offset -= 200; // Desplaza 200 píxeles hacia la izquierda
            carousel.style.transform = `translateX(${offset}px)`;

            if (offset < -brands.length * 200) {
                offset = 0; // Reinicia el desplazamiento
            }
        }, 2000); // Desplaza cada 2 segundos

        return () => clearInterval(interval);
    }, [brands.length]);

    return (
        <div className="home-container">
            {/* Sección 1: Slider Principal */}
            <div className="main-slider">
                {mainSlides.map((slide, index) => (
                    <div 
                        key={slide.id} 
                        className={`slide ${index === activeSlide ? 'active' : ''}`}
                    >
                        <img src={slide.src} alt={`Slide ${slide.id}`} />
                        <div className="slide-text">
                            <h3>{slide.title}</h3>
                            <p>{slide.text}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Sección 2: Descripción de la Empresa */}
            <div className="company-description">
                <h2>Sobre Nosotros</h2>
                <p>
                    Somos un centro de servicio especializado en la reparación y mantenimiento de herramientas eléctricas y manuales. Nuestro equipo de técnicos altamente capacitados garantiza un servicio de calidad y eficiencia.
                </p>
            </div>

            {/* Sección 3: Marcas Autorizadas */}
            <div className="authorized-brands">
                <div className="brand-container">
                    <div className="brand-card">
                        <img src={makita} alt="Makita" className="large-logo" />
                        <div className="authorized-text">Centro de Servicio Autorizado</div>
                    </div>
                    
                    <div className="brand-card">
                        <img src={bosch} alt="Bosch" className="large-logo" />
                        <div className="authorized-text">Centro de Servicio Autorizado</div>
                    </div>
                </div>
            </div>

            {/* Sección 4: Carrusel de Otras Marcas */}
            <div className="brands-carousel">
                <h2>Otras Marcas que Trabajamos</h2>
                
                <div className="carousel-container">
                    <div className="carousel">
                        {brands.map((brand, index) => (
                            <div key={index} className="brand-item">
                                <img src={brand.logo} alt={brand.name} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
