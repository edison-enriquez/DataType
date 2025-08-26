# DataType Explorer

Una aplicación educativa interactiva desarrollada en React para aprender sobre tipos de datos, operaciones binarias y sistemas numéricos.

## Características

### 🔢 Explorador de Tipos de Datos
- Visualización de diferentes tipos de datos (int, uint, short, byte, etc.)
- Representación binaria en memoria
- Layout de bytes y bits
- Rangos y límites de cada tipo

### 🔄 Conversor de Bases Numéricas
- Conversión entre bases 2, 8, 10 y 16
- Interfaz intuitiva con entrada y salida automática
- Información educativa sobre cada sistema numérico

### 📺 Display de Siete Segmentos Animado
- Simulación realista de display de 7 segmentos
- Soporte para diferentes bases numéricas
- Animaciones suaves y configurables
- Conversión automática entre bases

### ⚡ Operaciones Bit a Bit
- Operadores AND (&), OR (|), XOR (^), NOT (~)
- Desplazamientos izquierda (<<) y derecha (>>)
- Visualización bit por bit del resultado
- Tablas de verdad interactivas

### ➕ Sumador Binario Configurable
- Sumador de 1, 2, 4, 8 y 16 bits
- Visualización de acarreos (carry)
- Detección de desbordamiento (overflow)
- Explicación de sumadores completos y medios

## Instalación y Uso

### Prerrequisitos
- Node.js (versión 16 o superior)
- npm o yarn

### Instalación
```bash
# Instala las dependencias
npm install

# Inicia el servidor de desarrollo
npm run dev
```

### Scripts disponibles
- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza la versión de producción

## Tecnologías Utilizadas

- **React 19** - Framework de interfaz de usuario
- **Vite** - Herramienta de construcción y desarrollo
- **CSS3** - Estilos y animaciones
- **JavaScript ES6+** - Lógica de la aplicación

## Estructura del Proyecto

```
src/
├── components/
│   ├── DataTypeExplorer.jsx    # Explorador de tipos de datos
│   ├── BaseConverter.jsx       # Conversor de bases
│   ├── SevenSegmentDisplay.jsx # Display de 7 segmentos
│   ├── BitOperations.jsx       # Operaciones bit a bit
│   └── BinaryAdder.jsx         # Sumador binario
├── App.jsx                     # Componente principal
├── main.jsx                    # Punto de entrada
└── index.css                   # Estilos globales
```

## Características Educativas

### Interfaz Didáctica
- Explicaciones claras y concisas
- Visualizaciones interactivas
- Ejemplos prácticos en tiempo real
- Colores y animaciones que facilitan el aprendizaje

### Contenido Profesional
- Información técnica precisa
- Terminología correcta de ciencias de la computación
- Ejemplos relevantes para programación
- Cobertura completa de conceptos fundamentales

## Conceptos Cubiertos

1. **Tipos de Datos**
   - Enteros con y sin signo
   - Diferentes tamaños (8, 16, 32, 64 bits)
   - Representación en memoria
   - Rangos y limitaciones

2. **Sistemas Numéricos**
   - Base 2 (binario)
   - Base 8 (octal)
   - Base 10 (decimal)
   - Base 16 (hexadecimal)

3. **Operaciones Binarias**
   - AND, OR, XOR, NOT
   - Desplazamientos de bits
   - Tablas de verdad
   - Aplicaciones prácticas

4. **Aritmética Binaria**
   - Sumadores completos y medios
   - Propagación de acarreo
   - Detección de desbordamiento
   - Arquitectura de sumadores

## Licencia

Este proyecto está bajo la Licencia ISC.

## Autor

Desarrollado como herramienta educativa para el aprendizaje de conceptos fundamentales de ciencias de la computación.