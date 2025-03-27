// Home.js
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
    const animationSpeed = 0.5; // Velocidad de la animación en segundos

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

    // Verificar si las imágenes existen
    const verificarImagen = async (src) => {
        const img = new Image();
        img.src = src;
        return new Promise(resolve => {
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
        });
    };

    useEffect(() => {
        const verificar = async () => {
            for (const slide of mainSlides) {
                if (!(await verificarImagen(slide.src))) {
                    console.error(`Imagen no encontrada: ${slide.src}`);
                }
            }
        };
        verificar();
    }, [mainSlides]);

    return (
        <div className="home-container">
            {/* Sección 1: Slider Principal */}
            <ImageSlider slides={mainSlides} />

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
