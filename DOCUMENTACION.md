# 📘 Documentación Técnica — Ranking QS · Sostenibilidad EPN

> **Versión:** 1.0  
> **Fecha:** Mayo 2026  
> **Proyecto:** Sitio web de Sostenibilidad para la Escuela Politécnica Nacional (EPN), orientado al ranking QS Sustainability.

---

## Tabla de Contenidos

1. [Visión General del Proyecto](#1-visión-general-del-proyecto)
2. [Estructura de Archivos](#2-estructura-de-archivos)
3. [Archivos HTML — Contenido Quemado (Hardcoded)](#3-archivos-html--contenido-quemado-hardcoded)
4. [Funciones JavaScript (`contenido.js`)](#4-funciones-javascript-contenidojs)
5. [Archivo Auxiliar `images.js`](#5-archivo-auxiliar-imagesjs)
6. [Formato de los Archivos JSON de Contenido](#6-formato-de-los-archivos-json-de-contenido)
7. [Cómo Agregar Nuevas Secciones](#7-cómo-agregar-nuevas-secciones)
8. [Sistema de Traducción (Español / Inglés)](#8-sistema-de-traducción-español--inglés)
9. [Restricciones y Limitaciones](#9-restricciones-y-limitaciones)
10. [Consejos de Uso](#10-consejos-de-uso)
11. [Guía para Modificaciones Futuras](#11-guía-para-modificaciones-futuras)
12. [Referencia Rápida de Tipos de Contenido](#12-referencia-rápida-de-tipos-de-contenido)

---

## 1. Visión General del Proyecto

Este sitio web es un portal estático (sin backend/servidor) que presenta la información de sostenibilidad de la Escuela Politécnica Nacional para el ranking QS Sustainability. Está dividido en secciones temáticas con contenido dinámico renderizado desde archivos JSON.

### Arquitectura General

```
┌──────────────────────────────────────────────────────┐
│                  Archivos HTML                       │
│  (estructura, header, footer, contenedores vacíos)   │
└────────────────────┬─────────────────────────────────┘
                     │ cargan
                     ▼
┌──────────────────────────────────────────────────────┐
│               contenido.js                           │
│  (motor de renderizado dinámico)                     │
└──────┬──────────────────────────────┬────────────────┘
       │ lee                          │ lee
       ▼                              ▼
┌────────────────────┐    ┌───────────────────────────┐
│ translations.json  │    │  {pagina}.json             │
│ (textos comunes)   │    │  (contenido de la página)  │
└────────────────────┘    └───────────────────────────┘
```

### Páginas del Sitio

| Página | Archivo HTML | Archivo JSON | Descripción |
|---|---|---|---|
| Inicio | `index.html` | — (usa `translations.json`) | Landing page con video hero y navegación visual |
| Informe Anual | `informe-anual.html` | `informe-anual.json` | Documentos de rendición de cuentas |
| Impacto Ambiental | `impacto-ambiental.html` | `impacto-ambiental.json` | Políticas y acciones ambientales |
| Impacto Social | `impacto-social.html` | `impacto-social.json` | Igualdad, salud, bienestar |
| Gobernanza | `gobernanza.html` | `gobernanza.json` | Estructura organizacional, ética, democracia |
| Info. Adicional | `info-adicional.html` | `info-adicional.json` | Datos estadísticos complementarios |

---

## 2. Estructura de Archivos

```
ranking-QS/
├── index.html                    ← Página de inicio
├── informe-anual.html            ← Página de Informe Anual
├── impacto-ambiental.html        ← Página de Impacto Ambiental
├── impacto-social.html           ← Página de Impacto Social
├── gobernanza.html               ← Página de Gobernanza
├── info-adicional.html           ← Página de Información Adicional
├── contenido.js                  ← Motor principal de renderizado
├── images.js                     ← Gestión de imágenes (legacy, no se usa activamente)
├── style.css                     ← Hoja de estilos global
├── contenido/                    ← Archivos JSON de contenido
│   ├── translations.json         ← Traducciones comunes (header/footer/index)
│   ├── informe-anual.json
│   ├── impacto-ambiental.json
│   ├── impacto-social.json
│   ├── gobernanza.json
│   └── info-adicional.json
├── img/                          ← Imágenes del sitio
│   ├── escudo-web-1.png          ← Logo header
│   ├── logo-epn-LINEAS.webp      ← Logo footer
│   ├── backgoound.png            ← Fondo global (blur)
│   ├── videoweb3.mp4             ← Video hero de inicio
│   ├── gobernanza/               ← Imágenes de gobernanza
│   ├── impacto-ambiental/        ← Imágenes de impacto ambiental
│   └── impacto-social/           ← Imágenes de impacto social
├── pdfs/                         ← Documentos PDF embebidos
│   ├── Gobernanza/
│   ├── impacto-ambiental/
│   ├── impacto-social/
│   └── informe-anual/
└── otros/                        ← Archivos descargables (ZIP, DOCX, etc.)
```

---

## 3. Archivos HTML — Contenido Quemado (Hardcoded)

Los archivos HTML contienen estructura fija que **no cambia dinámicamente**. A continuación se detalla cada elemento quemado.

### 3.1 Elementos Comunes a TODAS las Páginas Interiores

Las páginas `gobernanza.html`, `impacto-ambiental.html`, `impacto-social.html`, `informe-anual.html` e `info-adicional.html` comparten la misma estructura idéntica:

#### Header (Navegación Superior)
```html
<!-- QUEMADO: Logo de la institución -->
<img src="img/escudo-web-1.png" alt="Logo EOPN" width="50" height="60">

<!-- QUEMADO: Enlaces de navegación (el texto se traduce vía JS) -->
<li><a href="./">Inicio</a></li>
<li><a href="informe-anual.html">Informe Anual</a></li>
<li><a href="impacto-ambiental.html">Impacto Ambiental</a></li>
<li><a href="impacto-social.html">Impacto Social</a></li>
<li><a href="gobernanza.html">Gobernanza</a></li>
<li><a href="info-adicional.html">Información Adicional</a></li>

<!-- QUEMADO: Botón de idioma -->
<button id="language-toggle-btn">EN</button>
```

> **⚠️ Nota:** Si se agrega una nueva sección/página al sitio, se debe actualizar la navegación en **TODOS** los archivos HTML manualmente.

#### Contenedor Dinámico
```html
<!-- QUEMADO: Título y subtítulo (se llenan desde JSON vía JS) -->
<h1 class="page-title"></h1>
<p class="page-subtitle"></p>

<!-- QUEMADO: Contenedor donde JS inyecta todo el contenido -->
<div class="content-blocks-container"></div>
```

#### Footer
```html
<!-- QUEMADO: Logo del footer -->
<img src="img\logo-epn-LINEAS.webp" alt="Logo EPN" width="50" height="60">

<!-- QUEMADO: Descripción institucional (texto se traduce vía JS) -->
<p class="footer-desc">Comprometidos con el desarrollo sostenible...</p>

<!-- QUEMADO: Redes sociales con URLs fijas -->
Instagram: https://www.instagram.com/epn_ecuador
Facebook:  https://www.facebook.com/EPNQuito
X (Twitter): https://x.com/EPNEcuador

<!-- QUEMADO: Información de contacto (textos se traducen vía JS) -->
Dirección: Av. Ladrón de Guevara E11-253
Teléfono:  (+593) 2 2976 300
Email:     info@epn.edu.ec

<!-- QUEMADO: Íconos SVG de redes sociales (inline) -->
```

#### Barra Superior y Script
```html
<!-- QUEMADO: Barra decorativa azul oscuro de 8px -->
<div class="page-top-bar"></div>

<!-- QUEMADO: Referencia al script principal -->
<script src="contenido.js"></script>
```

### 3.2 Página de Inicio (`index.html`)

Además de los elementos comunes, `index.html` tiene contenido exclusivo:

```html
<!-- QUEMADO: Video hero autoplay -->
<video class="hero-img" autoplay loop muted>
    <source src="img/videoweb3.mp4" type="video/mp4">
</video>

<!-- QUEMADO: Título principal (texto se traduce vía JS) -->
<div class="header-section">
    <h1><span></span></h1>
</div>

<!-- QUEMADO: Iconos de navegación visual (SVG inline) -->
<!-- 5 botones circulares con íconos SVG personalizados: -->
<!-- - Informe Anual (ícono de documento) -->
<!-- - Impacto Ambiental (ícono de globo) -->
<!-- - Impacto Social (ícono de personas) -->
<!-- - Gobernanza (ícono de templo/columnas) -->
<!-- - Información Adicional (ícono de lupa con "i") -->

<!-- QUEMADO: Texto de cada nav-label -->
<span class="nav-label">INFORME ANUAL</span>
<span class="nav-label">IMPACTO AMBIENTAL</span>
<span class="nav-label">IMPACTO SOCIAL</span>
<span class="nav-label">GOBERNANZA</span>
<span class="nav-label">INFORMACIÓN ADICIONAL</span>
```

### 3.3 Títulos `<title>` de cada página (SEO)

| Archivo | Título `<title>` quemado |
|---|---|
| `index.html` | `Sostenibilidad 2026 \| Escuela Politécnica Nacional` |
| `gobernanza.html` | `Gobernanza \| Escuela Politécnica Nacional` |
| `impacto-ambiental.html` | `Impacto Ambiental \| Escuela Politécnica Nacional` |
| `impacto-social.html` | `Impacto Social \| Escuela Politécnica Nacional` |
| `informe-anual.html` | `Informe Anual \| Escuela Politécnica Nacional` |
| `info-adicional.html` | `Información Adicional \| Escuela Politécnica Nacional` |

> **Nota:** Estos títulos NO se traducen dinámicamente. Si se necesita traducción del `<title>`, habría que agregar lógica en `contenido.js`.

---

## 4. Funciones JavaScript (`contenido.js`)

El archivo `contenido.js` es el motor central del sitio. Contiene **1298 líneas** organizadas en secciones numeradas.

### 4.0 Protección de Contenido (Líneas 1–23)

| Función/Evento | Descripción |
|---|---|
| `contextmenu` listener | Deshabilita el clic derecho en toda la página |
| `dragstart` listener | Impide arrastrar elementos (drag & drop) |
| `keydown` listener | Bloquea `Ctrl+S` / `Cmd+S` para evitar guardar la página |

> **Propósito:** Proteger parcialmente el contenido (imágenes, PDFs) contra descarga casual.

### 4.1 Variables Globales y Mapeo (Líneas 29–45)

```javascript
let commonTranslations = {};  // Traducciones del header/footer
let pageContent = {};          // Contenido JSON de la página actual
let contentLoaded = false;     // Flag de carga completa
let currentLanguage = localStorage.getItem('selectedLanguage') || 'es';
```

**`pageContentMap`** — Mapea el nombre del archivo HTML al nombre del JSON:

| Clave (URL) | Valor (JSON sin extensión) |
|---|---|
| `'index.html'`, `''`, `'./'` | `null` (no tiene JSON propio) |
| `'informe-anual.html'` | `'informe-anual'` |
| `'impacto-ambiental.html'` | `'impacto-ambiental'` |
| `'impacto-social.html'` | `'impacto-social'` |
| `'gobernanza.html'` | `'gobernanza'` |
| `'info-adicional.html'` | `'info-adicional'` |

### 4.2 Carga de Contenido — `loadContent()` (Líneas 51–72)

```
loadContent()
  ├── fetch('contenido/translations.json')  → commonTranslations
  ├── getContentFile()                       → determina qué JSON cargar
  ├── fetch('contenido/{pagina}.json')       → pageContent
  └── initializeContent()                    → renderiza todo
```

- **`loadContent()`**: Función `async` que carga primero las traducciones comunes y luego el JSON específico de la página.
- **`getContentFile()`**: Extrae el nombre del archivo actual de la URL y lo busca en `pageContentMap`.

### 4.3 Inicialización — `initializeContent()` (Líneas 84–91)

Orquesta la inicialización completa en este orden:

1. `applySavedLanguage()` — Restaura el idioma guardado en `localStorage`
2. `setupLanguageToggle()` — Configura el botón ES/EN
3. `setupNavigationMarking()` — Marca con `.active` el enlace de la página actual
4. `generateDynamicContent()` — Genera todo el contenido desde JSON
5. `setupHashUpdateOnToggle()` — Sincroniza URL hash con acordeones
6. `handleHashNavigation()` — Abre el acordeón indicado por `#hash`

### 4.4 Cambio de Idioma — `applyLanguage(lang)` (Líneas 98–141)

Flujo al cambiar idioma:

1. Guarda el idioma en `localStorage` y `document.documentElement.lang`
2. **Guarda el estado** de los acordeones abiertos (sus IDs)
3. Actualiza metadatos (título, subtítulo)
4. Traduce header y footer
5. **Regenera todos los bloques** de contenido en el nuevo idioma
6. **Restaura** los acordeones que estaban abiertos

### 4.5 Generación de Contenido Dinámico

#### `generateDynamicContent()` (Líneas 147–168)
Punto de entrada para renderizar contenido. Decide entre:
- **Sistema de bloques** (`pageContent.blocks`) — Método actual y preferido
- **Sistema legacy** (`pageContent.statistics`, `pageContent.evaluationCriteria`, `pageContent.sections`) — Compatibilidad retroactiva

#### `generateContentBlocks(blocks, lang, customContainer)` (Líneas 185–272)
**Función principal de renderizado.** Itera sobre el array `blocks` y crea elementos según el `type`:

| Tipo (`type`) | Qué genera | Propiedad requerida |
|---|---|---|
| `"accordion"` | Grupo de acordeones anidables | `sections: [...]` |
| `"evaluationCriteria"` | Lista de criterios con ✓/✗ y tooltips | `items: [...]` |
| `"statistics"` | Tarjetas de estadísticas numéricas | `statistics: [...]` |
| `"subtitle"` | Título decorativo con descripción y lista opcional | `es`/`en` con `title`, `description`, `list` |

#### `createAccordionElement(section, lang, parentId)` (Líneas 331–402)
Crea un elemento `<details>` (acordeón) recursivamente:

- Si es raíz → clase `accordion-root`
- Si es hijo → clase `accordion-nested`
- Genera el `<summary>` con el título traducido
- Renderiza `content` (PDF, slider, etc.) si existe
- Procesa `children` recursivamente (acordeones anidados o subtítulos)

#### `createCriterionItem(item, index, lang)` (Líneas 482–547)
Genera un item de criterio de evaluación con:
- Ícono de estado (`✓` verde o `✗` rojo) según `item.complied`
- Nombre del criterio
- Ícono `!` de información con tooltip hover/focus/click

### 4.6 Renderizado de Contenido Multimedia — `renderContent(content, lang)` (Líneas 553–576)

Switch que delega la creación de elementos según `content.type`:

| Tipo | Función creadora | Resultado |
|---|---|---|
| `"pdf"` | `createPDFElement(src)` | `<embed>` para mostrar PDF inline |
| `"url"` | `createIframeElement(src)` | `<iframe>` para URL externa |
| `"link"` | `createLinkElement(url, label)` | Botón enlace externo (`target="_blank"`) |
| `"slider"` | `createSliderElement(images)` | Carrusel de imágenes con fade |
| `"overlay-slider"` | `createOverlaySliderElement(slides)` | Carrusel con texto superpuesto |
| `"download"` | `createDownloadElement(src, filename)` | Botón de descarga directa |
| `"youtube"` | `createYoutubeElement(src)` | Iframe de YouTube embebido |
| `"statistics"` | `createStatisticsElement(stats, lang)` | Grid de tarjetas estadísticas |

### 4.7 Funciones de Creación de Elementos

#### `createPDFElement(src)` (Líneas 650–664)
- Crea un `<embed>` con `type="application/pdf"`
- Dimensiones: 100% ancho × 600px alto

#### `createIframeElement(src)` (Líneas 666–678)
- Crea un `<iframe>` para cargar URLs externas
- Dimensiones: 100% ancho × 600px alto

#### `createLinkElement(url, label)` (Líneas 684–697)
- Crea un botón-enlace (`<a>`) estilizado
- Abre en nueva pestaña (`target="_blank"`)
- Si no hay `label`, muestra "Acceder"

#### `createSliderElement(images)` (Líneas 699–752)
Carrusel de imágenes con:
- Transición fade entre slides
- Botones anterior/siguiente (`❮` / `❯`)
- Bullets de navegación
- Inicialización diferida con `setTimeout`

#### `createOverlaySliderElement(slides)` (Líneas 758–832)
Carrusel similar al slider pero con overlay de información:
- Imagen de fondo
- Capa superpuesta con título (`h3`) y descripción (`p`)
- Navegación con dots y botones

#### `createDownloadElement(src, filename)` (Líneas 582–594)
- Crea un enlace `<a>` con atributo `download`
- Texto: `📥 Descargar: {filename}`

#### `createYoutubeElement(youtubeUrl)` (Líneas 620–644)
- Extrae el video ID con `extractYoutubeVideoId()`
- Soporta formatos: `youtube.com/watch?v=`, `youtu.be/`, `youtube.com/embed/`
- Crea iframe embed con `allow="accelerometer; autoplay; ..."`

#### `createStatisticCard(dato, titulo)` (Líneas 424–440)
- Crea tarjeta con número grande (`.statistics-number`) y etiqueta (`.statistics-label`)

### 4.8 Inicialización de Sliders

#### `initSlider(sliderId)` (Líneas 838–927)
Slider con scroll horizontal:
- Soporte mouse drag (desktop)
- Soporte touch swipe (móvil)
- Threshold de 50px para cambiar slide
- Sincronización de bullets

#### `initFadeSlider(sliderId)` (Líneas 933–1006)
Slider con transición fade:
- Muestra/oculta slides con clase `.active`
- Ajuste dinámico de altura según la imagen
- Oculta botones en primer/último slide

#### `initOverlaySlider(sliderId)` (Líneas 1232–1291)
Slider de overlay:
- Similar a fade slider pero con dots en lugar de bullets
- Soporte para contenido superpuesto

### 4.9 Comportamiento de Acordeones

#### `setupNestedAccordionBehavior()` (Líneas 1012–1030)
- Al abrir un sub-acordeón, cierra automáticamente sus hermanos
- Solo aplica a acordeones `.accordion-nested`

#### `setupHashUpdateOnToggle()` (Líneas 1036–1072)
- Cuando se abre un acordeón → actualiza `#hash` en la URL
- Cuando se cierra → busca hermano abierto o padre como nuevo hash
- Si nada está abierto → limpia el hash

#### `handleHashNavigation()` (Líneas 1078–1100)
- Al cargar la página con un `#hash`, abre el acordeón correspondiente
- Abre todos los padres del acordeón target
- Hace scroll suave hasta el elemento
- Escucha `hashchange` para navegación dinámica

### 4.10 Actualización de Header/Footer

#### `setupNavigationMarking()` (Líneas 1108–1138)
- Detecta la página actual comparando `pathname`
- Agrega clase `.active` al enlace correspondiente en la navegación

#### `updateHeader(lang)` (Líneas 1140–1163)
- Traduce los textos de navegación del header desde `commonTranslations`

#### `updateFooter(lang)` (Líneas 1165–1203)
- Traduce: descripción del footer, título "Contacto", dirección, teléfono, email
- Traduce enlaces de información

#### `updateLanguageButton(lang)` (Líneas 1206–1211)
- Muestra "EN" cuando el idioma actual es español
- Muestra "ES" cuando el idioma actual es inglés

### 4.11 Toggle de Idioma — `setupLanguageToggle()` (Líneas 1217–1226)
- Configura el evento `click` del botón `#language-toggle-btn`
- Alterna entre `'es'` y `'en'`
- Llama a `applyLanguage(newLang)` que regenera todo

### 4.12 Punto de Entrada (Línea 1297)

```javascript
loadContent();  // Inicia todo el proceso
```

---

## 5. Archivo Auxiliar `images.js`

> **⚠️ Estado:** Este archivo parece ser **código legacy** que no se utiliza activamente en el flujo actual. Ningún HTML lo referencia con `<script>`. El renderizado de imágenes ahora se maneja completamente en `contenido.js` a través de los archivos JSON.

**Funcionalidad original:**
- Cargaba un archivo `assets.json` (que no existe actualmente)
- Inicializaba sliders de forma estática en `impacto-ambiental.html`
- Contenía una versión alternativa de `initSlider()`

---

## 6. Formato de los Archivos JSON de Contenido

### 6.1 Estructura Raíz

Cada archivo JSON de contenido sigue esta estructura:

```json
{
  "metadata": {
    "es": {
      "pageTitle": "Título en español",
      "pageSubtitle": "Subtítulo opcional"
    },
    "en": {
      "pageTitle": "Title in English",
      "pageSubtitle": "Optional subtitle"
    }
  },
  "blocks": [
    // Array de bloques de contenido
  ]
}
```

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `metadata` | Object | ✅ Sí | Contiene títulos de página por idioma |
| `metadata.es` | Object | ✅ Sí | Metadata en español |
| `metadata.en` | Object | ✅ Sí | Metadata en inglés |
| `metadata.{lang}.pageTitle` | String | ✅ Sí | Título que aparece en `<h1>` |
| `metadata.{lang}.pageSubtitle` | String | ❌ No | Subtítulo bajo el título |
| `blocks` | Array | ✅ Sí | Array de bloques de contenido |

### 6.2 Tipos de Bloques

#### 6.2.1 Bloque `accordion`

Crea uno o más acordeones desplegables.

```json
{
  "type": "accordion",
  "sections": [
    {
      "id": "identificador-unico",
      "es": { "title": "Título en español" },
      "en": { "title": "Title in English" },
      "content": { ... },
      "children": [ ... ]
    }
  ]
}
```

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `type` | `"accordion"` | ✅ | Identificador del tipo de bloque |
| `sections` | Array | ✅ | Lista de secciones (acordeones raíz) |
| `sections[].id` | String | ✅ | ID único para el `<details>`. Se usa en el hash de la URL |
| `sections[].es.title` | String | ✅ | Título del acordeón en español |
| `sections[].en.title` | String | ✅ | Título del acordeón en inglés |
| `sections[].content` | Object | ❌ | Contenido multimedia del acordeón |
| `sections[].children` | Array | ❌ | Sub-acordeones o sub-elementos anidados |

#### 6.2.2 Bloque `subtitle`

Muestra un título decorativo con descripción y lista opcional.

```json
{
  "type": "subtitle",
  "es": {
    "title": "Título en español",
    "description": "Descripción del contexto",
    "list": [
      "Elemento 1",
      "Elemento 2"
    ]
  },
  "en": {
    "title": "Title in English",
    "description": "Context description",
    "list": [
      "Item 1",
      "Item 2"
    ]
  }
}
```

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `type` | `"subtitle"` | ✅ | Identificador |
| `{lang}.title` | String | ✅ | Título del subtítulo |
| `{lang}.description` | String | ❌ | Texto descriptivo |
| `{lang}.list` | Array\<String\> | ❌ | Lista de viñetas |

> **Nota:** Los bloques `subtitle` también pueden usarse **dentro** de `children` de un acordeón.

#### 6.2.3 Bloque `statistics`

Muestra tarjetas de estadísticas numéricas en grid.

```json
{
  "type": "statistics",
  "statistics": [
    {
      "es": {
        "dato": "3 787 461.25 kWh/año",
        "titulo": "Energía total procedente de energías renovables"
      },
      "en": {
        "dato": "3,787,461.25 kWh/year",
        "titulo": "Total energy from renewable sources"
      }
    }
  ]
}
```

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `type` | `"statistics"` | ✅ | Identificador |
| `statistics` | Array | ✅ | Lista de datos estadísticos |
| `statistics[].{lang}.dato` | String | ✅ | Valor numérico o dato destacado |
| `statistics[].{lang}.titulo` | String | ✅ | Descripción del dato |

#### 6.2.4 Bloque `evaluationCriteria`

Muestra una lista de criterios con cumplimiento (✓/✗).

```json
{
  "type": "evaluationCriteria",
  "items": [
    {
      "complied": true,
      "es": {
        "criterion": "Nombre del criterio",
        "detailText": "Descripción del tooltip"
      },
      "en": {
        "criterion": "Criterion name",
        "detailText": "Tooltip description"
      }
    }
  ]
}
```

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `type` | `"evaluationCriteria"` | ✅ | Identificador |
| `items` | Array | ✅ | Lista de criterios |
| `items[].complied` | Boolean | ✅ | `true` = cumple (✓ verde), `false` = no cumple (✗ rojo) |
| `items[].{lang}.criterion` | String | ✅ | Nombre del criterio |
| `items[].{lang}.detailText` | String | ❌ | Texto del tooltip al hacer hover en `!` |

### 6.3 Tipos de Contenido (`content`)

El objeto `content` dentro de una sección de acordeón puede tener estos tipos:

#### `pdf` — Visor de PDF embebido
```json
{
  "type": "pdf",
  "src": "pdfs/carpeta/archivo.pdf"
}
```
- `src`: Ruta relativa al archivo PDF
- Se puede agregar `#page=N` para abrir en una página específica

#### `url` — Iframe de sitio web externo
```json
{
  "type": "url",
  "src": "https://sitio-externo.com/pagina"
}
```

#### `link` — Botón enlace externo
```json
{
  "type": "link",
  "url": "https://www.epn.edu.ec/pagina",
  "label": "Texto del botón"
}
```

#### `slider` — Carrusel de imágenes
```json
{
  "type": "slider",
  "images": [
    {
      "src": "img/carpeta/imagen.jpg",
      "alt": "Texto alternativo"
    }
  ]
}
```

#### `overlay-slider` — Carrusel con texto superpuesto
```json
{
  "type": "overlay-slider",
  "slides": [
    {
      "src": "img/carpeta/imagen.jpg",
      "alt": "Texto alternativo",
      "title": "Título opcional del slide",
      "description": "Descripción larga del slide"
    }
  ]
}
```

#### `download` — Botón de descarga
```json
{
  "type": "download",
  "src": "otros/archivo.zip",
  "filename": "nombre-de-descarga.zip"
}
```

#### `youtube` — Video de YouTube
```json
{
  "type": "youtube",
  "src": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```
- Acepta formatos: `youtube.com/watch?v=`, `youtu.be/`, `youtube.com/embed/`

#### `statistics` — Estadísticas dentro de un acordeón
```json
{
  "type": "statistics",
  "statistics": [
    {
      "es": { "dato": "1 374 tCO₂e", "titulo": "Emisiones" },
      "en": { "dato": "1 374 tCO₂e", "titulo": "Emissions" }
    }
  ]
}
```

### 6.4 Contenido Múltiple en un Acordeón

Un acordeón puede tener **múltiples piezas de contenido** usando un array:

```json
{
  "id": "huella-carbono",
  "es": { "title": "Huella de Carbono" },
  "en": { "title": "Carbon Footprint" },
  "content": [
    {
      "type": "pdf",
      "src": "pdfs/huella-ecologica.pdf"
    },
    {
      "type": "statistics",
      "statistics": [ ... ]
    }
  ]
}
```

---

## 7. Cómo Agregar Nuevas Secciones

### 7.1 Agregar un nuevo acordeón a una página existente

1. Abrir el archivo JSON correspondiente en `contenido/`
2. Agregar un nuevo objeto al array `blocks`:

```json
{
  "type": "accordion",
  "sections": [
    {
      "id": "mi-nueva-seccion",
      "es": {
        "title": "Mi Nueva Sección"
      },
      "en": {
        "title": "My New Section"
      },
      "content": {
        "type": "pdf",
        "src": "pdfs/mi-carpeta/documento.pdf"
      },
      "children": []
    }
  ]
}
```

### 7.2 Agregar un sub-acordeón

Dentro de una sección existente, agregar al array `children`:

```json
{
  "id": "seccion-padre",
  "es": { "title": "Sección Padre" },
  "en": { "title": "Parent Section" },
  "children": [
    {
      "id": "sub-seccion-nueva",
      "es": { "title": "Sub-sección" },
      "en": { "title": "Sub-section" },
      "content": {
        "type": "slider",
        "images": [
          { "src": "img/nueva-img.jpg", "alt": "Descripción" }
        ]
      }
    }
  ]
}
```

### 7.3 Agregar un subtítulo entre bloques

```json
{
  "type": "subtitle",
  "es": {
    "title": "Nueva Categoría",
    "description": "Descripción de esta categoría de contenido."
  },
  "en": {
    "title": "New Category",
    "description": "Description of this content category."
  }
}
```

### 7.4 Agregar una nueva página completa

1. **Crear el HTML** — Copiar cualquier página interior (ej. `gobernanza.html`) y cambiar el `<title>`
2. **Crear el JSON** — Crear `contenido/nueva-pagina.json` con la estructura raíz
3. **Registrar en `pageContentMap`** — En `contenido.js`, agregar:
   ```javascript
   'nueva-pagina.html': 'nueva-pagina'
   ```
4. **Actualizar navegación** — Agregar el enlace `<li><a href="nueva-pagina.html">Nueva Página</a></li>` en **TODOS** los archivos HTML
5. **Actualizar traducciones** — En `contenido/translations.json`, agregar la traducción del nombre de la navegación en ambos idiomas:
   ```json
   "nuevaPagina": "Nueva Página"   // en "es"
   "nuevaPagina": "New Page"       // en "en"
   ```
6. **Actualizar `updateHeader()`** — En `contenido.js`, agregar el mapeo en `navKeys`:
   ```javascript
   'nueva-pagina.html': 'nuevaPagina'
   ```

---

## 8. Sistema de Traducción (Español / Inglés)

### 8.1 Flujo de Traducción

```
Usuario hace clic en "EN/ES"
  └── setupLanguageToggle() → applyLanguage(newLang)
        ├── localStorage.setItem('selectedLanguage', lang)
        ├── updatePageMetadata(lang)   → título/subtítulo desde JSON de página
        ├── updateHeader(lang)          → nav desde translations.json
        ├── updateFooter(lang)          → footer desde translations.json
        ├── updateLanguageButton(lang)  → cambia texto del botón
        └── generateContentBlocks()    → regenera todo el contenido en el idioma
```

### 8.2 Dónde están los textos traducibles

| Elemento | Fuente de traducción |
|---|---|
| Navegación del header | `translations.json` → `common.header.nav` |
| Textos del footer | `translations.json` → `common.footer` |
| Título/subtítulo de página | `{pagina}.json` → `metadata.{lang}` |
| Títulos de acordeones | `{pagina}.json` → `blocks[].sections[].{lang}.title` |
| Contenido de subtítulos | `{pagina}.json` → `blocks[].{lang}.title/description/list` |
| Etiquetas nav del index | `translations.json` → `index.navItems` |
| Título hero del index | `translations.json` → `index.headerSection` |

### 8.3 Persistencia del Idioma

- Se guarda en `localStorage` con la clave `'selectedLanguage'`
- Al cargar cualquier página, se restaura automáticamente el idioma guardado
- El valor por defecto es `'es'` (español)

---

## 9. Restricciones y Limitaciones

### 9.1 Restricciones Técnicas

| Restricción | Descripción |
|---|---|
| **Sin backend** | El sitio es completamente estático. Los JSON se cargan vía `fetch()` desde el mismo servidor. |
| **CORS en local** | Abrir los archivos HTML directamente en el navegador (`file://`) causará errores de CORS al cargar los JSON. Se necesita un servidor local (ej. Live Server en VS Code). |
| **Nombres de archivos con espacios** | Varios PDFs tienen espacios en el nombre. Funcionan, pero es mejor evitarlos en archivos nuevos. |
| **IDs únicos** | Los `id` de las secciones **deben ser únicos** dentro de cada JSON. IDs duplicados causarán conflictos en la navegación por hash y en la restauración del estado de acordeones. |
| **Sin validación de JSON** | No hay validación del esquema JSON. Un JSON malformado dejará la página vacía sin error visible para el usuario. |
| **PDFs protegidos por navegador** | El visor PDF (`<embed>`) depende del navegador. En algunos navegadores móviles los PDFs no se renderizan inline. |

### 9.2 Restricciones de Contenido

| Restricción | Descripción |
|---|---|
| **Solo 2 idiomas** | El sistema solo soporta `es` y `en`. Agregar un tercer idioma requiere modificar `contenido.js`. |
| **Título `<title>` no se traduce** | El tag `<title>` de cada HTML está hardcodeado y no cambia con el idioma. |
| **Videos solo de YouTube** | El type `youtube` solo soporta videos de YouTube. No hay soporte para Vimeo u otras plataformas. |
| **Sin búsqueda** | Aunque el CSS define estilos para `.page-search-box`, no hay funcionalidad de búsqueda implementada. |
| **Sin lazy loading** | Todas las imágenes y videos se cargan al abrir la sección, sin carga diferida. |

### 9.3 Restricciones de los Archivos JSON

| Regla | Detalle |
|---|---|
| Cada bloque debe tener `type` | Sin `type`, el bloque se ignora silenciosamente |
| Los acordeones necesitan `id` | Sin `id`, el hash de URL y la restauración de estado no funcionarán |
| Los títulos requieren `es` Y `en` | Si falta un idioma, se muestra string vacío (`''`) |
| Las rutas de archivos son relativas | Las rutas de `src` deben ser relativas a la raíz del proyecto |
| JSON debe ser válido | Comas finales, comillas faltantes o sintaxis incorrecta romperán toda la página |

---

## 10. Consejos de Uso

### 10.1 Desarrollo Local

```bash
# Opción 1: Live Server en VS Code
# Instalar extensión "Live Server" → clic derecho en index.html → "Open with Live Server"

# Opción 2: Python
cd ranking-QS
python -m http.server 8000
# Abrir http://localhost:8000

# Opción 3: Node.js
npx serve .
```

### 10.2 Debugging

- **JSON inválido:** Abrir la consola del navegador (F12). Buscar errores de `fetch()` o `JSON.parse`.
- **Acordeón no aparece:** Verificar que el `type` sea exactamente `"accordion"` y que `sections` sea un array.
- **PDF no carga:** Verificar que la ruta en `src` sea correcta y que el archivo exista. Probar abriendo la ruta directamente en el navegador.
- **Traducciones no funcionan:** Verificar que las claves `es` y `en` existan en el JSON.
- **Hash navigation:** Agregar `#id-de-seccion` a la URL para navegar directamente a un acordeón.

### 10.3 Buenas Prácticas para Nuevos Contenidos

1. **Nombrar IDs con kebab-case:** `"id": "mi-nueva-seccion"` (minúsculas, guiones).
2. **Siempre incluir ambos idiomas** (`es` y `en`) aunque sea placeholder.
3. **Nombres de archivos sin espacios ni caracteres especiales** para PDFs e imágenes nuevas.
4. **Validar JSON** antes de subir — usar https://jsonlint.com/ o la extensión de VS Code.
5. **Comprimir imágenes** antes de agregarlas. Preferir formatos `.webp` o `.jpeg` sobre `.png` para fotografías.
6. **No crear archivos de video mayores a 50 MB** sin convertirlos a formato web optimizado.

### 10.4 Convenciones de Nombres

| Tipo | Formato | Ejemplo |
|---|---|---|
| Archivos HTML | `kebab-case.html` | `impacto-ambiental.html` |
| Archivos JSON | Mismo nombre que el HTML | `impacto-ambiental.json` |
| IDs de sección | `kebab-case` | `"politica-accion-sostenible"` |
| Carpetas de imágenes | `kebab-case` | `img/impacto-ambiental/` |
| Carpetas de PDFs | `PascalCase` o descripción | `pdfs/Gobernanza/` |

---

## 11. Guía para Modificaciones Futuras

### 11.1 Agregar un Nuevo Tipo de Contenido

Para agregar un nuevo tipo (ej. `"video-local"`, `"table"`, `"gallery"`):

1. **En `contenido.js`** — Agregar un nuevo `case` en `renderContent()`:
   ```javascript
   case 'mi-nuevo-tipo':
     return createMiNuevoTipoElement(content.propiedad);
   ```

2. **Crear la función de creación:**
   ```javascript
   function createMiNuevoTipoElement(propiedad) {
     const container = document.createElement('div');
     container.className = 'mi-nuevo-tipo-container';
     // ... construir el DOM ...
     return container;
   }
   ```

3. **En `style.css`** — Agregar los estilos para `.mi-nuevo-tipo-container`

4. **Usarlo en JSON:**
   ```json
   {
     "type": "mi-nuevo-tipo",
     "propiedad": "valor"
   }
   ```

### 11.2 Agregar un Tercer Idioma

1. **En `translations.json`** — Agregar una nueva clave raíz (ej. `"pt"` para portugués)
2. **En cada JSON de contenido** — Agregar `"pt"` junto a `"es"` y `"en"` en cada objeto traducible
3. **En `contenido.js`:**
   - Modificar `setupLanguageToggle()` para rotar entre 3 idiomas
   - Modificar `updateLanguageButton()` para mostrar el siguiente idioma
4. **En los HTML** — Considerar reemplazar el botón simple por un selector dropdown

### 11.3 Cambiar el Header o Footer

El header y footer están **hardcodeados en HTML pero traducidos vía JS**:

- **Para cambiar la estructura visual:** Editar el HTML en **todos** los archivos
- **Para cambiar textos traducibles:** Editar `contenido/translations.json`
- **Para cambiar redes sociales:** Editar las URLs directamente en los archivos HTML (están hardcodeadas en cada archivo)

### 11.4 Cambiar el Estilo Visual

El estilo está centralizado en `style.css` con variables CSS:

```css
:root {
  --accent: #E0A32F;       /* Dorado institucional */
  --primary-dark: #3A3A3A; /* Texto oscuro */
  --footer-bg: #17243d;    /* Azul oscuro del footer */
  --text-white: #ffffff;
  --text-grey: rgba(255, 255, 255, 0.6);
}
```

Cambiar estas variables afecta todo el sitio globalmente.

### 11.5 Hacer Responsive (Mejoras)

El CSS actual tiene media queries básicas. Para mejorar:
- `style.css` línea ~267: Footer responsive
- `style.css` línea ~763: Páginas interiores responsive
- **Áreas por mejorar:** La navegación no tiene menú hamburguesa en móvil, los sliders podrían optimizarse para pantallas pequeñas.

---

## 12. Referencia Rápida de Tipos de Contenido

### Plantilla: Sección con PDF

```json
{
  "id": "nombre-seccion",
  "es": { "title": "Título" },
  "en": { "title": "Title" },
  "content": {
    "type": "pdf",
    "src": "pdfs/carpeta/archivo.pdf"
  }
}
```

### Plantilla: Sección con Galería de Imágenes

```json
{
  "id": "galeria",
  "es": { "title": "Galería" },
  "en": { "title": "Gallery" },
  "content": {
    "type": "slider",
    "images": [
      { "src": "img/carpeta/1.jpg", "alt": "Foto 1" },
      { "src": "img/carpeta/2.jpg", "alt": "Foto 2" }
    ]
  }
}
```

### Plantilla: Sección con Video YouTube

```json
{
  "id": "video",
  "es": { "title": "Video" },
  "en": { "title": "Video" },
  "content": {
    "type": "youtube",
    "src": "https://www.youtube.com/watch?v=VIDEO_ID"
  }
}
```

### Plantilla: Sección con Enlace Externo

```json
{
  "id": "sitio-externo",
  "es": { "title": "Sitio Externo" },
  "en": { "title": "External Site" },
  "content": {
    "type": "link",
    "url": "https://www.ejemplo.com",
    "label": "Visitar Sitio"
  }
}
```

### Plantilla: Sección con Descarga

```json
{
  "id": "descarga",
  "es": { "title": "Descarga" },
  "en": { "title": "Download" },
  "content": {
    "type": "download",
    "src": "otros/archivo.zip",
    "filename": "mi-archivo.zip"
  }
}
```

### Plantilla: Acordeón con Sub-acordeones

```json
{
  "id": "padre",
  "es": { "title": "Sección Padre" },
  "en": { "title": "Parent Section" },
  "children": [
    {
      "id": "hijo-1",
      "es": { "title": "Sub-sección 1" },
      "en": { "title": "Sub-section 1" },
      "content": { "type": "pdf", "src": "pdfs/doc1.pdf" }
    },
    {
      "id": "hijo-2",
      "es": { "title": "Sub-sección 2" },
      "en": { "title": "Sub-section 2" },
      "content": { "type": "pdf", "src": "pdfs/doc2.pdf" }
    }
  ]
}
```

### Plantilla: Overlay Slider (Imágenes con Texto)

```json
{
  "id": "historia",
  "es": { "title": "Historia" },
  "en": { "title": "History" },
  "content": {
    "type": "overlay-slider",
    "slides": [
      {
        "src": "img/carpeta/foto.jpg",
        "alt": "Descripción accesible",
        "title": "Título del slide",
        "description": "Texto largo que aparece sobre la imagen..."
      }
    ]
  }
}
```

### Plantilla: Bloque de Estadísticas

```json
{
  "type": "statistics",
  "statistics": [
    {
      "es": { "dato": "1,200", "titulo": "Estudiantes activos" },
      "en": { "dato": "1,200", "titulo": "Active students" }
    },
    {
      "es": { "dato": "95%", "titulo": "Tasa de graduación" },
      "en": { "dato": "95%", "titulo": "Graduation rate" }
    }
  ]
}
```

---
