import React, { useState, useEffect, useRef } from 'react';
import './Home.css';
import makita from '../assets/images/makita.png';
import bosch from '../assets/images/bosch.png';
import dewalt from '../assets/images/dewalt.png';
import milwakee from '../assets/images/milwakee.png';
import hilti from '../assets/images/hilti.png';
import metabo from '../assets/images/metabo.png';
import skill from '../assets/images/skill.png';
import stanley from '../assets/images/stanley.png';
import byd from '../assets/images/byd.png';
import festool from '../assets/images/festool.png';
import slide1 from '../assets/images/slider1.jpg';
import slide2 from '../assets/images/slider2.png';
import slide3 from '../assets/images/slider3.jpg';
import visitaServicios from '../assets/images/visita-nuestros-services.jpg'; // Importar imagen

// Componente para el slider de imágenes
function ImageSlider({ slides }) {
    const [activeSlide, setActiveSlide] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveSlide(prev => (prev + 1) % slides.length);
        }, 5000); // Cambia cada 5 segundos

        return () => clearInterval(interval);
    }, [slides.length]);

    const handleNextSlide = () => {
        setActiveSlide((prev) => (prev + 1) % slides.length);
    };

    const handlePrevSlide = () => {
        setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    return (
        <div className="main-slider">
            {slides.map((slide, index) => (
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
            <button onClick={handlePrevSlide}>&lt;</button>
            <button onClick={handleNextSlide}>&gt;</button>
        </div>
    );
}

function Home() {
    // Diapositivas para el slider principal
    const mainSlides = [
        {
            id: 1,
            src: slide1,
            title: 'Mantenimiento Preventivo',
            text: 'Nuestros técnicos realizan mantenimientos regulares para evitar problemas futuros.'
        },
        {
            id: 2,
            src: slide2,
            title: 'Mantenimiento Correctivo',
            text: 'Solucionamos problemas técnicos de manera rápida y eficiente.'
        },
        {
            id: 3,
            src: slide3,
            title: 'Asistencia Técnica',
            text: 'Ofrecemos asesoramiento técnico especializado para todas tus herramientas.'
        }
    ];

    // Marcas para el carrusel
    const brands = [
        { name: 'Makita', logo: makita },
        { name: 'Bosch', logo: bosch },
        { name: 'DeWalt', logo: dewalt },
        { name: 'Milwakee', logo: milwakee },
        { name: 'hilti', logo: hilti },
        { name: 'metabo', logo: metabo },
        { name: 'skil', logo: skill },
        { name: 'stanley', logo: stanley },
        { name: 'byd', logo: byd },
        { name: 'festool', logo: festool }
    ];

    const carouselRef = useRef(null);
    const [offset, setOffset] = useState(0);
    const itemWidth = 200; // Ancho de cada item del carrusel

    useEffect(() => {
        if (!carouselRef.current) return;

        const carousel = carouselRef.current;
        const totalItems = brands.length;

        // Duplicar las marcas para crear un efecto circular
        const duplicatedBrands = [...brands, ...brands];

        // Ajustar el ancho del carrusel
        carousel.style.width = `${duplicatedBrands.length * itemWidth}px`;

        let animationFrameId;

        const animate = () => {
            setOffset(prevOffset => {
                let newOffset = prevOffset - 1; // Desplazamiento continuo de 1px

                // Reiniciar el offset cuando se completa el ciclo
                if (newOffset <= -totalItems * itemWidth) {
                    newOffset = 0;
                }

                carousel.style.transform = `translateX(${newOffset}px)`;
                return newOffset;
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrameId);
    }, [brands]);

    return (
        <div className="home-container">
            {/* Sección 1: Slider Principal */}
            <ImageSlider slides={mainSlides} />

            {/* Sección 2: Descripción de la Empresa */}
            <div className="company-description">
                <div className="description-content">
                    <h2>Somos Expertos Makita</h2>
                    <p>
                        Como centro de servicio autorizado Makita, ofrecemos mantenimiento preventivo y correctivo para tus herramientas eléctricas. Nuestros técnicos están certificados para garantizar el máximo rendimiento y durabilidad de tus equipos.
                    </p>
                </div>
                <img src={visitaServicios} alt="Visita Nuestros Servicios" className="makita-image" />
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
                <h2>Otras Marcas</h2>

                <div className="carousel-container">
                    <div ref={carouselRef} className="carousel">
                        {[...brands, ...brands].map((brand, index) => (
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
