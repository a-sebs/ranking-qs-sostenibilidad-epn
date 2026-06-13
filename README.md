# 🌍 Ranking QS · Sostenibilidad EPN

> Sitio web de Sostenibilidad de la Escuela Politécnica Nacional (EPN), orientado a presentar información y evidencias para el **Ranking QS Sustainability**.

Este proyecto es un portal web **estático y dinámico a la vez**, diseñado sin necesidad de backend. Utiliza una arquitectura basada en archivos JSON para gestionar y renderizar el contenido de forma dinámica y bilingüe, manteniendo una navegación rápida y un fácil mantenimiento.

---

## Características Principales

* **Carga Dinámica de Contenido:** El contenido de las páginas se renderiza dinámicamente desde archivos JSON específicos por sección.
* **Sistema Bilingüe Integrado:** Soporte nativo para Español e Inglés con cambio de idioma en tiempo real sin recargar la página y persistencia mediante `localStorage`.
* **Componentes Ricos Interactivos:** Renderizado automático de sliders, galerías, visores de PDF embebidos, videos de YouTube, tarjetas de estadísticas y sistemas de acordeones anidados con navegación por `#hash` en la URL.
* **Diseño Responsivo (Mobile-First):** Interfaz adaptada a múltiples dispositivos con un menú de navegación hamburguesa optimizado y carga de recursos multimedia diferenciados por resolución (como videos ligeros para móvil).
* **Protección Básica de Contenido:** Scripts que previenen descargas casuales bloqueando atajos de teclado, el clic derecho y el "drag & drop".

---

## Arquitectura y Estructura

El sitio funciona mediante un motor principal desarrollado en JavaScript Vanilla que lee archivos de datos estáticos y los inyecta en plantillas HTML vacías.

1. **Vistas HTML:** Actúan como contenedores base (Header, Footer, Nav) con contenido esencial fijo.
2. **Motor (`contenido.js`):** Script principal que orquesta el enrutamiento, los idiomas y la inyección de componentes.
3. **Datos (JSON):** Archivos separados por contexto (ej. `impacto-ambiental.json`, `translations.json`) que actúan como la base de datos del contenido y los textos del sitio.

---

## Stack Tecnológico

El portal se mantiene ligero y sin dependencias de frameworks externos pesados:

* **HTML5:** Para la semántica y estructura base.
* **CSS3 Vanilla:** Uso extensivo de variables nativas (Custom Properties), Flexbox, CSS Grid y Media Queries.
* **JavaScript (ES6+):** Motor de renderizado dinámico, delegación de eventos y manejo de APIs modernas nativas como `fetch()`.
* **JSON:** Como formato principal para el almacenamiento y la configuración del contenido y traducciones.

---

## Guía de Inicio Rápido (Quick Start)

Para ejecutar este proyecto en tu entorno local, necesitas levantar un servidor web. Abrir directamente los archivos HTML (`file://`) causará errores de CORS al intentar cargar los JSON.

1. **Clonar el repositorio:**
   ```bash
   git clone <url-del-repositorio>
   cd ranking-QS
   ```

2. **Levantar un servidor local** (elige una de las siguientes opciones):

   * **Usando Python** (recomendado si ya lo tienes instalado):
     ```bash
     python -m http.server 8000
     ```
   * **Usando Node.js / npx:**
     ```bash
     npx serve .
     ```
   * **Usando VS Code:**
     Instala la extensión **Live Server** y haz clic derecho sobre `index.html` -> *Open with Live Server*.

3. **Acceder:**
   Abre tu navegador web e ingresa a `http://localhost:8000`.

---

## Estructura de Archivos Principal

```text
ranking-QS/
├── index.html                    # Landing page con video hero interactivo
├── contenido.js                  # Motor principal de JS de renderizado
├── style.css                     # Hoja de estilos global centralizada
├── contenido/                    # Base de datos (JSON)
│   ├── translations.json         # Textos comunes de UI (header, footer)
│   └── *.json                    # Contenido de cada página
├── img/                          # Assets de imagen, iconos e ilustraciones
├── pdfs/                         # Documentos adjuntos y evidencias
└── otros/                        # Archivos descargables (ZIPs)
```

---

> **Nota:** Para información técnica detallada, la arquitectura completa, guía paso a paso sobre cómo agregar nuevas secciones y parámetros del contenido multimedia, por favor consulta la **[Documentación Técnica completa](DOCUMENTACION.html)**.
