-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 27-03-2025 a las 20:11:36
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `samg_db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `herramientas`
--

CREATE TABLE `herramientas` (
  `id_articulo` int(11) NOT NULL,
  `herramienta` varchar(100) NOT NULL,
  `marca` varchar(50) DEFAULT NULL,
  `modelo` varchar(50) DEFAULT NULL,
  `propietario` varchar(100) DEFAULT NULL,
  `fecha_entrada` date DEFAULT NULL,
  `nombre_trabajador` varchar(100) DEFAULT NULL,
  `nit` varchar(20) DEFAULT NULL,
  `url` varchar(2083) DEFAULT NULL,
  `garantia` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `herramientas`
--

INSERT INTO `herramientas` (`id_articulo`, `herramienta`, `marca`, `modelo`, `propietario`, `fecha_entrada`, `nombre_trabajador`, `nit`, `url`, `garantia`) VALUES
(24, 'prueba nueva db', '1', '1', '1', '2025-02-27', '1', '1', NULL, NULL),
(25, 'nueva prueba db', '2', '2', '2', '2025-02-27', '2', '2', NULL, NULL),
(26, 'nuevo db prueba de nuevo', '3', '3', '3', '2025-02-27', '3', '3', NULL, NULL),
(27, 'prueba sin tecnico', '4', '4', '4', '2025-02-28', 'admin', '505', NULL, NULL),
(28, 'prueba sin nombre tecnico', '5', '5', '5', '2025-02-28', 'miguel', '506', NULL, NULL),
(29, 'prueba sin tecnico 2', '3', '3', '3', '2025-02-28', 'miguel', '507', NULL, NULL),
(30, 'nueva prueba', '1', '1', '1', '2025-02-28', 'miguel', '508', NULL, NULL),
(31, 'continuamos probando', '1', '1', '1', '2025-02-28', 'miguel', '509', NULL, NULL),
(32, 'otra mas', '1', '1', '1', '2025-02-28', 'miguel', '510', NULL, NULL),
(33, 'seguimos', '1', '1', '1', '2025-02-28', 'miguel', '512', NULL, NULL),
(34, 'prueba desde admin', '1', '1', '1', '2025-02-28', 'admin', '513', NULL, NULL),
(35, 'prueba aun mas', '1', '1', '1', '2025-02-28', 'admin', '514', NULL, NULL),
(36, 'continuamos', '1', '1', '1', '2025-02-28', 'admin', '515', NULL, NULL),
(37, 'aun aqui', '1', '1', '1', '2025-02-28', 'admin', '516', NULL, NULL),
(38, 'prueba cambio db date', '1', '1', '1', '2025-02-28', 'admin', '520', NULL, NULL),
(39, 'prueba nueva', '1', '1', '1', '2025-02-28', 'Miguel', '600', NULL, NULL),
(40, 'prueba agregando nombre tecnico', '1', '1', '1', '2025-03-03', 'miguel', '602', NULL, NULL),
(41, 'prueba usuarios', '2', '2', '2', '2025-03-02', 'miguel', '605', NULL, NULL),
(42, 'xxxx', '3', '3', '3', '2025-03-05', 'admin', '607', NULL, NULL),
(43, 'prueba entre users 3', '4', '4', '4', '0000-00-00', 'admin', '608', NULL, NULL),
(44, 'prueba act', '4', '4', '4', '2025-03-05', 'miguel', '608', NULL, NULL),
(45, 'prueba cargue', '1', '1', '1', '0000-00-00', 'admin', '612', NULL, NULL),
(46, 'prueba de cargue 2', '1', '1', '1', '0000-00-00', 'admin', '612', NULL, NULL),
(59, 'prueba de cargue 3', '1', '1', '1', '2005-01-01', 'admin', '612', NULL, NULL),
(60, 'prueba cargue 3 y 4', '1', '1', '1', '0000-00-00', 'admin', '612', NULL, NULL),
(61, 'confirmacion agregar', '612', '612', '612', '2025-03-11', 'admin', '612', NULL, NULL),
(62, 'rotomartillo', 'makita', 'hr2470', 'sergio', '2025-03-17', 'admin', '613', NULL, NULL),
(63, 'ejemplo', '240', '240', 'sergio', '0000-00-00', 'admin', '615', NULL, NULL),
(64, 'taladro', 'boss', '6115', 'jp', '0000-00-00', 'admin', '4444', NULL, NULL),
(83, 'prueba', 'hr2400', 'makita', 'sergio', '0000-00-00', 'admin', '701', NULL, NULL),
(89, 'prueba', 'hr2400', 'makita', 'sergio', '2025-03-18', 'admin', '701', NULL, NULL),
(90, 'prueba2 masivo', 'hr2400', 'makita', 'sergio', '2025-03-23', 'miguel', '701', 'xxx', 'prueba funcional'),
(91, 'prueba urlk', 'e', 'e', 'error', '2025-03-25', 'admin', '999', 'NO', 'SI'),
(92, 'nueva prueba reduccion codigo', '1', '1', '1', '2025-03-24', 'admin', '1000', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVLXqZNUkmfukQgPfUk3LG7E3R6ra0OlljWw&s', 'NO'),
(94, 'prueba nueva cm', 'cm', 'cm', 'cm', '0000-00-00', 'admin', '1001', 'ejemplo', 'cm prueba');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `historial_mantenimiento`
--

CREATE TABLE `historial_mantenimiento` (
  `id_mantenimiento` int(11) NOT NULL,
  `id_herramienta` int(11) NOT NULL,
  `fecha_mantenimiento` date NOT NULL,
  `descripcion_dano` text NOT NULL,
  `descripcion_mantenimiento` text NOT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `nombre_tecnico` varchar(100) NOT NULL,
  `nit_propietario` varchar(20) NOT NULL,
  `referencia` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `historial_mantenimiento`
--

INSERT INTO `historial_mantenimiento` (`id_mantenimiento`, `id_herramienta`, `fecha_mantenimiento`, `descripcion_dano`, `descripcion_mantenimiento`, `id_usuario`, `nombre_tecnico`, `nit_propietario`, `referencia`) VALUES
(1, 39, '2025-03-02', 'prueba', 'se arreglo', 2, 'miguel', '600', NULL),
(2, 40, '2025-03-04', 'prueba', 'se arreglo', 2, 'miguel', '602', NULL),
(3, 40, '2025-03-27', 'prueba nueva linea', 'se modifico', 2, 'miguel', '602', NULL),
(4, 41, '2025-03-04', 'prbando usuario', 'probando usuario', 2, 'miguel', '605', NULL),
(5, 42, '2025-03-04', 'xx', 'xx', NULL, 'miguel', '607', NULL),
(6, 42, '2025-03-06', 'prueba username en historial', 'prueba 33', 1, 'admin', '607', NULL),
(7, 43, '2025-03-05', 'user test', 'user test', 2, 'miguel', '608', NULL),
(8, 43, '2025-03-06', 'ajuste de visualizacion', 'ajuste de visualizacion 11', 2, 'miguel', '608', NULL),
(9, 44, '2025-03-05', 'prueba', 'se arreglo', NULL, 'miguel', '608', NULL),
(10, 43, '2025-03-05', 'prueba de datos', 'fixed', NULL, 'miguel', '608', NULL),
(11, 43, '2025-03-06', 'user testt', 'prueba 33', NULL, 'admin', '608', NULL),
(12, 45, '2025-03-08', 'prueba cargue', 'prueba cargue masivo', 1, 'admin', '612', NULL),
(13, 46, '0000-00-00', 'cargue masivo 2da parte', 'probando si carga o no', NULL, 'admin', '612', NULL),
(20, 59, '2025-01-05', 'cargue masivo 3ra parte', 'probando si carga o no', NULL, 'admin', '612', NULL),
(21, 60, '2025-03-04', 'cargue masivo 3,0', 'prueba de cargue final', 1, 'admin', '612', NULL),
(22, 60, '2025-03-10', 'prueba nuevo codigo', 'usando nuevo codigo', 1, '', '612', NULL),
(23, 60, '2025-03-03', 'prueba 3 containers', 'prueba 3 containers', 1, 'admin', '612', NULL),
(24, 60, '2025-03-03', '4 container', '4 container', NULL, 'admin', '612', NULL),
(25, 43, '2025-03-11', 'prueba 4 mantenimientos', 'probando', NULL, 'admin', '608', NULL),
(26, 61, '2025-03-12', 'probando con diferente informacion y datos alfanumericos para los detalles de los mantenimientos y sus diferntes descripciones', 'probando con diferente informacion y datos alfanumericos para los detalles de los mantenimientos y sus diferntes descripciones', NULL, 'admin', '612', NULL),
(27, 62, '2025-03-17', 'no prende', 'cambio de cable', NULL, 'admin', '613', NULL),
(28, 62, '2025-03-24', 'daño inducido', 'remplazo inducido', NULL, 'admin', '613', NULL),
(29, 63, '0000-00-00', 'ejemplo', 'ejemplo cargue', NULL, 'admin', '615', NULL),
(43, 89, '2025-03-18', 'se daño pq si', 'ejemplo de cargue', NULL, 'admin', '701', NULL),
(44, 90, '2024-03-18', 'pq si', 'ejemplo masivo', 1, '', '701', NULL),
(47, 90, '2025-03-23', 'prueba de fecha 3.1', 'prueba de fecha', 2, '', '701', NULL),
(48, 90, '2025-03-19', 'prueba de fecha', 'prueba de fecha', 2, '', '701', NULL),
(49, 90, '2025-03-19', 'prueba', 'se arreglo', 2, '', '701', NULL),
(50, 90, '2025-03-19', 'prueba de fecha 2', 'prueba de fecha', 2, '', '701', NULL),
(51, 90, '2025-03-19', 'user testt', 'probando usuario', 2, '', '701', NULL),
(52, 90, '2025-03-11', 'xx', 'prueba 33', NULL, 'miguel', '701', NULL),
(53, 90, '2025-03-23', 'prueba campo obligatorio fecha', 'prueba campo obligatorio fecha 2', 2, '', '701', NULL),
(54, 90, '2025-03-23', 'prueba de fecha 3', 'prueba de fecha', NULL, 'miguel', '701', NULL),
(55, 90, '2025-03-24', 'prueba 4 referencia', 'prueba 4 referencia', 1, '', '701', NULL),
(56, 91, '2025-03-23', 'error', 'error', NULL, 'admin', '999', NULL),
(57, 92, '2025-03-26', 'prueba 2', 'se arreglo2 ', 1, '', '1000', 'prueba'),
(58, 92, '2025-03-23', 'prueba', 'se arreglo', 1, 'admin', '1000', NULL),
(60, 94, '2025-03-25', 'cm', 'cm', NULL, 'admin', '1001', 'prueba masiva');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `tipo_usuario` enum('1','2','3') NOT NULL,
  `nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id`, `username`, `password`, `tipo_usuario`, `nombre`) VALUES
(1, 'admin', 'admin', '1', 'admin'),
(2, 'mardila', '1', '2', 'miguel'),
(10, 'macevedo', '2', '2', 'andres'),
(11, 'jortega', '2', '2', 'jhon'),
(14, 'smendez', '1', '2', 'sergio');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `herramientas`
--
ALTER TABLE `herramientas`
  ADD PRIMARY KEY (`id_articulo`);

--
-- Indices de la tabla `historial_mantenimiento`
--
ALTER TABLE `historial_mantenimiento`
  ADD PRIMARY KEY (`id_mantenimiento`),
  ADD KEY `id_herramienta` (`id_herramienta`),
  ADD KEY `FK_usuario_id` (`id_usuario`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `herramientas`
--
ALTER TABLE `herramientas`
  MODIFY `id_articulo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=95;

--
-- AUTO_INCREMENT de la tabla `historial_mantenimiento`
--
ALTER TABLE `historial_mantenimiento`
  MODIFY `id_mantenimiento` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `historial_mantenimiento`
--
ALTER TABLE `historial_mantenimiento`
  ADD CONSTRAINT `FK_usuario_id` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`),
  ADD CONSTRAINT `historial_mantenimiento_ibfk_1` FOREIGN KEY (`id_herramienta`) REFERENCES `herramientas` (`id_articulo`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
