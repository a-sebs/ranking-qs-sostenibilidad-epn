// ========================================
// PROTECCIÓN DE BACKGROUND
// ========================================

// Desabilitar clic derecho en el documento para evitar descargas
document.addEventListener('contextmenu', function(e) {
  e.preventDefault();
  return false;
});

// Desabilitar drag and drop
document.addEventListener('dragstart', function(e) {
  e.preventDefault();
  return false;
});

// Desabilitar teclas para guardar
document.addEventListener('keydown', function(e) {
  if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
    e.preventDefault();
    return false;
  }
});

// ========================================
// GESTOR DINÁMICO DE CONTENIDO Y ACORDEONES
// ========================================

let commonTranslations = {};
let pageContent = {};
let contentLoaded = false;
let currentLanguage = localStorage.getItem('selectedLanguage') || 'es';

// Mapeo de páginas a archivos JSON
const pageContentMap = {
  'index.html': null,
  '': null,
  './': null,
  'informe-anual.html': 'informe-anual',
  'impacto-ambiental.html': 'impacto-ambiental',
  'impacto-social.html': 'impacto-social',
  'gobernanza.html': 'gobernanza',
  'info-adicional.html': 'info-adicional',
  'prueba.html': 'prueba'
};

// ========================================
// 1. CARGAR CONTENIDO
// ========================================

async function loadContent() {
  try {
    const translationsResponse = await fetch('contenido/translations.json');
    commonTranslations = await translationsResponse.json();

    const contentFile = getContentFile();
    if (contentFile) {
      const contentResponse = await fetch(`contenido/${contentFile}.json`);
      pageContent = await contentResponse.json();
    }

    contentLoaded = true;
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initializeContent);
    } else {
      initializeContent();
    }
  } catch (error) {
    console.error('Error cargando contenido:', error);
  }
}

function getContentFile() {
  const pathname = window.location.pathname;
  const filename = pathname.split('/').pop() || 'index.html';
  return pageContentMap[filename] || null;
}

// ========================================
// 2. INICIALIZAR PÁGINA
// ========================================

function initializeContent() {
  applySavedLanguage();
  setupLanguageToggle();
  setupNavigationMarking();
  generateDynamicContent();
  setupHashUpdateOnToggle();
  handleHashNavigation();
  setupMobileMenu();
}

function applySavedLanguage() {
  const lang = localStorage.getItem('selectedLanguage') || 'es';
  applyLanguage(lang);
}

function applyLanguage(lang) {
  currentLanguage = lang;
  localStorage.setItem('selectedLanguage', lang);
  document.documentElement.lang = lang;
  
  // Guardar estado de acordeones abiertos
  const openAccordions = new Set();
  document.querySelectorAll('details[open]').forEach(detail => {
    openAccordions.add(detail.id);
  });
  
  updatePageMetadata(lang);
  updateHeader(lang);
  updateFooter(lang);
  updateLanguageButton(lang);
  
  // Regenerar bloques si existen
  if (pageContent.blocks && pageContent.blocks.length > 0) {
    generateContentBlocks(pageContent.blocks, lang);
  } else {
    // Fallback: regenerar las 3 secciones independientes
    if (pageContent.statistics && pageContent.statistics.length > 0) {
      generateStatistics(pageContent.statistics, lang);
    }
    
    if (pageContent.evaluationCriteria && pageContent.evaluationCriteria.length > 0) {
      generateEvaluationCriteria(pageContent.evaluationCriteria, lang);
    }
    
    if (pageContent.sections && pageContent.sections.length > 0) {
      generateAccordions(pageContent.sections, lang);
    }
  }
  
  // Restaurar estado de acordeones abiertos
  setTimeout(() => {
    openAccordions.forEach(id => {
      const accordion = document.getElementById(id);
      if (accordion && accordion.tagName === 'DETAILS') {
        accordion.open = true;
      }
    });
  }, 0);
}

// ========================================
// 3. GENERAR CONTENIDO DINÁMICO
// ========================================

function generateDynamicContent() {
  const lang = currentLanguage;
  updatePageMetadata(lang);
  
  // Si la página tiene bloques, renderiza bloques
  if (pageContent.blocks && pageContent.blocks.length > 0) {
    generateContentBlocks(pageContent.blocks, lang);
  } else {
    // Fallback: si no hay bloques, renderiza las 3 secciones independientes (para compatibilidad)
    if (pageContent.statistics && pageContent.statistics.length > 0) {
      generateStatistics(pageContent.statistics, lang);
    }
    
    if (pageContent.evaluationCriteria && pageContent.evaluationCriteria.length > 0) {
      generateEvaluationCriteria(pageContent.evaluationCriteria, lang);
    }
    
    if (pageContent.sections && pageContent.sections.length > 0) {
      generateAccordions(pageContent.sections, lang);
    }
  }
}

function updatePageMetadata(lang) {
  if (!pageContent.metadata || !pageContent.metadata[lang]) return;
  
  const metadata = pageContent.metadata[lang];
  const titleEl = document.querySelector('.page-title');
  const subtitleEl = document.querySelector('.page-subtitle');
  
  if (titleEl) titleEl.textContent = metadata.pageTitle || '';
  if (subtitleEl) subtitleEl.textContent = metadata.pageSubtitle || '';
}

// ========================================
// GENERAR BLOQUES DE CONTENIDO DINÁMICO
// ========================================

function generateContentBlocks(blocks, lang, customContainer) {
  const container = customContainer || document.querySelector('.content-blocks-container');
  
  // Si no existe el contenedor de bloques, intentar con los contenedores antiguos
  if (!container) {
    generateDynamicContentLegacy(blocks, lang);
    return;
  }
  
  container.innerHTML = '';
  
  blocks.forEach(block => {
    if (block.type === 'accordion' && block.sections) {
      const accordionWrapper = document.createElement('div');
      accordionWrapper.className = 'accordion-global-wrapper';
      
      block.sections.forEach(section => {
        const accordion = createAccordionElement(section, lang);
        accordionWrapper.appendChild(accordion);
      });
      
      container.appendChild(accordionWrapper);
      setupNestedAccordionBehavior();
    } 
    else if (block.type === 'evaluationCriteria' && block.items) {
      const criteriaSection = document.createElement('section');
      criteriaSection.className = 'evaluation-criteria-section';
      
      const list = document.createElement('div');
      list.className = 'evaluation-criteria-list';
      
      block.items.forEach((item, index) => {
        const criterionElement = createCriterionItem(item, index, lang);
        list.appendChild(criterionElement);
      });
      
      criteriaSection.appendChild(list);
      container.appendChild(criteriaSection);
    }
    else if (block.type === 'statistics' && block.statistics) {
      const statsSection = document.createElement('section');
      statsSection.className = 'statistics-section';
      
      const grid = document.createElement('div');
      grid.className = 'statistics-grid';
      
      block.statistics.forEach(stat => {
        const statData = stat[lang] || stat.es || {};
        const card = createStatisticCard(statData.dato, statData.titulo);
        grid.appendChild(card);
      });
      
      statsSection.appendChild(grid);
      container.appendChild(statsSection);
    }
    else if (block.type === 'subtitle') {
      const subtitleSection = document.createElement('section');
      subtitleSection.className = 'content-subtitle';
      
      const subtitle = document.createElement('h2');
      subtitle.className = 'subtitle-title';
      subtitle.textContent = block[lang]?.title || '';
      
      const description = document.createElement('p');
      description.className = 'subtitle-description';
      description.textContent = block[lang]?.description || '';
      
      subtitleSection.appendChild(subtitle);
      subtitleSection.appendChild(description);
      
      // Si hay una lista, agregarla después de la descripción
      if (block[lang]?.list && Array.isArray(block[lang].list)) {
        const list = document.createElement('ul');
        list.className = 'subtitle-list';
        
        block[lang].list.forEach(item => {
          const listItem = document.createElement('li');
          listItem.textContent = item;
          list.appendChild(listItem);
        });
        
        subtitleSection.appendChild(list);
      }
      
      container.appendChild(subtitleSection);
    }
  });
}

function generateDynamicContentLegacy(blocks, lang) {
  // Fallback para compatibilidad con estructura antigua
  blocks.forEach(block => {
    if (block.type === 'accordion' && block.sections) {
      generateAccordions(block.sections, lang);
    }
    else if (block.type === 'evaluationCriteria' && block.items) {
      const section = document.querySelector('.evaluation-criteria-section');
      if (section) {
        const list = section.querySelector('.evaluation-criteria-list');
        if (list) {
          list.innerHTML = '';
          block.items.forEach((item, index) => {
            const criterionElement = createCriterionItem(item, index, lang);
            list.appendChild(criterionElement);
          });
        }
      }
    }
    else if (block.type === 'statistics' && block.items) {
      generateStatistics(block.items, lang);
    }
  });
}

// ========================================
// 4. GENERAR ACORDEONES DINÁMICAMENTE
// ========================================

function generateAccordions(sections, lang) {
  const wrapper = document.querySelector('.accordion-global-wrapper');
  if (!wrapper) return;
  
  // Guardar el estado de los acordeones abiertos ANTES de limpiar
  const openAccordions = new Set();
  wrapper.querySelectorAll('details[open]').forEach(detail => {
    openAccordions.add(detail.id);
  });

  wrapper.innerHTML = '';
  
  sections.forEach(section => {
    const accordion = createAccordionElement(section, lang);
    wrapper.appendChild(accordion);
  });

  // Restaurar el estado abierto de los acordeones
  openAccordions.forEach(id => {
    const accordion = document.getElementById(id);
    if (accordion) {
      accordion.open = true;
    }
  });
  
  setupNestedAccordionBehavior();
}

function createAccordionElement(section, lang, parentId = '') {
  const id = parentId ? `${parentId}-${section.id}` : section.id;
  const isRoot = !parentId;
  
  const details = document.createElement('details');
  details.className = isRoot ? 'accordion-root' : 'accordion-nested';
  details.id = id;
  
  const summary = document.createElement('summary');
  summary.className = 'accordion-summary';
  const titleObj = section[lang] || section.es || {};
  summary.textContent = titleObj.title || '';
  details.appendChild(summary);
  
  const contentDiv = document.createElement('div');
  contentDiv.className = 'accordion-content';
  
  if (section.content) {
    // Soportar tanto contenido único como array de contenido
    const contentArray = Array.isArray(section.content) ? section.content : [section.content];
    contentArray.forEach(content => {
      const rendered = renderContent(content, lang);
      if (rendered) {
        contentDiv.appendChild(rendered);
      }
    });
  }
  
  if (section.children && section.children.length > 0) {
    section.children.forEach(child => {
      // Si el child es un subtítulo, renderizarlo como subtítulo
      if (child.type === 'subtitle') {
        const subtitleSection = document.createElement('section');
        subtitleSection.className = 'content-subtitle';
        
        const subtitle = document.createElement('h2');
        subtitle.className = 'subtitle-title';
        subtitle.textContent = child[lang]?.title || '';
        
        const description = document.createElement('p');
        description.className = 'subtitle-description';
        description.textContent = child[lang]?.description || '';
        
        subtitleSection.appendChild(subtitle);
        subtitleSection.appendChild(description);
        
        // Si hay una lista, agregarla después de la descripción
        if (child[lang]?.list && Array.isArray(child[lang].list)) {
          const list = document.createElement('ul');
          list.className = 'subtitle-list';
          
          child[lang].list.forEach(item => {
            const listItem = document.createElement('li');
            listItem.textContent = item;
            list.appendChild(listItem);
          });
          
          subtitleSection.appendChild(list);
        }
        
        contentDiv.appendChild(subtitleSection);
      } else {
        // Si es un acordeón anidado, procesarlo como antes
        const childAccordion = createAccordionElement(child, lang, id);
        contentDiv.appendChild(childAccordion);
      }
    });
  }
  
  details.appendChild(contentDiv);
  return details;
}

// ========================================
// 4B. GENERAR TARJETAS DE ESTADÍSTICAS
// ========================================

function generateStatistics(statistics, lang) {
  const section = document.querySelector('.statistics-section');
  if (!section) return;
  
  const grid = section.querySelector('.statistics-grid');
  if (!grid) return;
  
  grid.innerHTML = '';
  
  statistics.forEach(stat => {
    const statData = stat[lang] || stat.es || {};
    const card = createStatisticCard(statData.dato, statData.titulo);
    grid.appendChild(card);
  });
}

function createStatisticCard(dato, titulo) {
  const card = document.createElement('div');
  card.className = 'statistics-card';
  
  const numberDiv = document.createElement('div');
  numberDiv.className = 'statistics-number';
  numberDiv.textContent = dato;
  
  const labelDiv = document.createElement('div');
  labelDiv.className = 'statistics-label';
  labelDiv.textContent = titulo;
  
  card.appendChild(numberDiv);
  card.appendChild(labelDiv);
  
  return card;
}

// ========================================
// 4C. CREAR ELEMENTO DE ESTADÍSTICAS
// ========================================

function createStatisticsElement(statistics, lang = 'es') {
  if (!statistics || !Array.isArray(statistics)) return null;
  
  const container = document.createElement('div');
  container.className = 'statistics-grid';
  
  statistics.forEach(stat => {
    const statData = stat[lang] || stat.es || {};
    if (statData.dato && statData.titulo) {
      const card = createStatisticCard(statData.dato, statData.titulo);
      container.appendChild(card);
    }
  });
  
  return container;
}

// ========================================
// 4D. GENERAR CRITERIOS DE EVALUACIÓN
// ========================================

function generateEvaluationCriteria(criteria, lang) {
  const section = document.querySelector('.evaluation-criteria-section');
  if (!section) return;
  
  const list = section.querySelector('.evaluation-criteria-list');
  if (!list) return;
  
  list.innerHTML = '';
  
  criteria.forEach((item, index) => {
    const criterionElement = createCriterionItem(item, index, lang);
    list.appendChild(criterionElement);
  });
}

function createCriterionItem(item, index, lang) {
  const container = document.createElement('div');
  container.className = 'criterion-item';
  container.setAttribute('data-criterion-id', index);
  
  // Obtener datos en el idioma correcto
  const data = item[lang] || item.es || {};
  
  // Contenedor principal con flex
  const mainRow = document.createElement('div');
  mainRow.className = 'criterion-main';
  
  // Icono de estado (✓ o ✗)
  const statusIcon = document.createElement('div');
  statusIcon.className = `criterion-status ${item.complied ? 'complied' : 'not-complied'}`;
  statusIcon.textContent = item.complied ? '✓' : '✗';
  
  // Nombre del criterio
  const criterionName = document.createElement('div');
  criterionName.className = 'criterion-name';
  criterionName.textContent = data.criterion || '';
  
  // Icono de información (!)
  const infoIcon = document.createElement('div');
  infoIcon.className = 'criterion-info-icon';
  infoIcon.textContent = '!';
  infoIcon.setAttribute('role', 'button');
  infoIcon.setAttribute('tabindex', '0');
  
  // Tooltip (inicialmente oculto)
  const tooltip = document.createElement('div');
  tooltip.className = 'criterion-tooltip';
  tooltip.textContent = data.detailText || '';
  
  // Agregar elementos al contenedor principal
  mainRow.appendChild(statusIcon);
  mainRow.appendChild(criterionName);
  mainRow.appendChild(infoIcon);
  
  container.appendChild(mainRow);
  container.appendChild(tooltip);
  
  // Eventos para mostrar/ocultar tooltip
  infoIcon.addEventListener('mouseenter', () => {
    tooltip.classList.add('show');
  });
  
  infoIcon.addEventListener('mouseleave', () => {
    tooltip.classList.remove('show');
  });
  
  infoIcon.addEventListener('focus', () => {
    tooltip.classList.add('show');
  });
  
  infoIcon.addEventListener('blur', () => {
    tooltip.classList.remove('show');
  });
  
  // Soporte para click en móviles
  infoIcon.addEventListener('click', () => {
    tooltip.classList.toggle('show');
  });
  
  return container;
}

// ========================================
// 5. RENDERIZAR CONTENIDO (PDF, SLIDER, ETC)
// ========================================

function renderContent(content, lang = 'es') {
  if (!content || !content.type) return null;
  
  switch (content.type) {
    case 'pdf':
      return createPDFElement(content.src);
    case 'url':
      return createIframeElement(content.src);
    case 'link':
      return createLinkElement(content.url, content.label);
    case 'slider':
      return createSliderElement(content.images);
    case 'overlay-slider':
      return createOverlaySliderElement(content.slides);
    case 'download':
      return createDownloadElement(content.src, content.filename);
    case 'youtube':
      return createYoutubeElement(content.src);
    case 'statistics':
      return createStatisticsElement(content.statistics, lang);
    default:
      return null;
  }
}

// ========================================
// DOWNLOAD BUTTON
// ========================================

function createDownloadElement(src, filename) {
  const container = document.createElement('div');
  container.className = 'download-container';
  
  const link = document.createElement('a');
  link.href = src;
  link.download = filename || '';
  link.className = 'download-btn';
  link.textContent = '📥 Descargar: ' + (filename || 'Archivo');
  
  container.appendChild(link);
  return container;
}

// ========================================
// YOUTUBE VIDEO PLAYER
// ========================================

function extractYoutubeVideoId(url) {
  // Soporta múltiples formatos de YouTube
  // https://www.youtube.com/watch?v=vcn1uBChwdQ
  // https://youtu.be/vcn1uBChwdQ
  // https://www.youtube.com/embed/vcn1uBChwdQ
  
  let videoId = '';
  
  if (url.includes('youtube.com/watch')) {
    const urlParams = new URL(url).searchParams;
    videoId = urlParams.get('v');
  } else if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1].split('?')[0];
  } else if (url.includes('youtube.com/embed/')) {
    videoId = url.split('youtube.com/embed/')[1].split('?')[0];
  }
  
  return videoId;
}

function createYoutubeElement(youtubeUrl) {
  const container = document.createElement('div');
  container.className = 'youtube-container';
  
  const videoId = extractYoutubeVideoId(youtubeUrl);
  
  if (!videoId) {
    container.textContent = 'Error: Invalid YouTube URL';
    return container;
  }
  
  const embedUrl = `https://www.youtube.com/embed/${videoId}`;
  
  const iframe = document.createElement('iframe');
  iframe.src = embedUrl;
  iframe.width = '100%';
  iframe.height = '600px';
  iframe.style.border = 'none';
  iframe.style.borderRadius = '4px';
  iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
  iframe.allowFullscreen = true;
  
  container.appendChild(iframe);
  return container;
}

// ========================================
// PDF VIEWER - HTML5 EMBED
// ========================================

function createPDFElement(src) {
  const container = document.createElement('div');
  container.className = 'pdf-container';
  
  // Usar HTML5 embed (funciona en todos lados)
  const embed = document.createElement('embed');
  embed.src = src;
  embed.type = 'application/pdf';
  embed.style.width = '100%';
  embed.style.height = '600px';
  embed.style.border = 'none';
  
  container.appendChild(embed);
  return container;
}

function createIframeElement(src) {
  const container = document.createElement('div');
  container.className = 'iframe-container';
  
  const iframe = document.createElement('iframe');
  iframe.src = src;
  iframe.style.width = '100%';
  iframe.style.height = '600px';
  iframe.style.border = 'none';
  
  container.appendChild(iframe);
  return container;
}

// ========================================
// LINK ELEMENT - ENLACE EXTERNO
// ========================================

function createLinkElement(url, label) {
  const container = document.createElement('div');
  container.className = 'link-container';
  
  const link = document.createElement('a');
  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.className = 'external-link-btn';
  link.textContent = label || 'Acceder';
  
  container.appendChild(link);
  return container;
}

function createSliderElement(images) {
  if (!images || images.length === 0) return null;
  
  const wrapper = document.createElement('div');
  wrapper.className = 'media-slider-wrapper';
  
  const sliderId = 'slider-' + Math.random().toString(36).substr(2, 9);
  
  // Contenedor principal del slider (con fade transition)
  const slider = document.createElement('div');
  slider.id = sliderId;
  slider.className = 'media-slider media-slider-fade';
  
  // Crear cada imagen como un slide con fade
  images.forEach((imgData, index) => {
    const slideDiv = document.createElement('div');
    slideDiv.className = `media-slider-item ${index === 0 ? 'active' : ''}`;
    
    const img = document.createElement('img');
    img.src = imgData.src;
    img.alt = imgData.alt || 'Image';
    slideDiv.appendChild(img);
    
    slider.appendChild(slideDiv);
  });
  
  const prevBtn = document.createElement('button');
  prevBtn.className = 'media-slider-nav media-slider-nav-prev';
  prevBtn.textContent = '❮';
  prevBtn.setAttribute('aria-label', 'Previous');
  
  const nextBtn = document.createElement('button');
  nextBtn.className = 'media-slider-nav media-slider-nav-next';
  nextBtn.textContent = '❯';
  nextBtn.setAttribute('aria-label', 'Next');
  
  const bulletsDiv = document.createElement('div');
  bulletsDiv.className = 'media-slider-bullets';
  images.forEach((_, index) => {
    const bullet = document.createElement('span');
    bullet.className = `media-slider-bullet ${index === 0 ? 'active' : ''}`;
    bullet.setAttribute('data-index', index);
    bulletsDiv.appendChild(bullet);
  });
  
  wrapper.appendChild(prevBtn);
  wrapper.appendChild(slider);
  wrapper.appendChild(nextBtn);
  wrapper.appendChild(bulletsDiv);
  
  setTimeout(() => initFadeSlider(sliderId), 0);
  
  return wrapper;
}

// ========================================
// OVERLAY SLIDER - CON INFORMACIÓN SUPERPUESTA
// ========================================

function createOverlaySliderElement(slides) {
  if (!slides || slides.length === 0) return null;
  
  const wrapper = document.createElement('div');
  wrapper.className = 'overlay-slider-wrapper';
  
  const sliderId = 'overlay-slider-' + Math.random().toString(36).substr(2, 9);
  
  // Contenedor principal del slider
  const slider = document.createElement('div');
  slider.id = sliderId;
  slider.className = 'overlay-slider';
  
  // Crear cada slide
  slides.forEach((slide, index) => {
    const slideDiv = document.createElement('div');
    slideDiv.className = `overlay-slide ${index === 0 ? 'active' : ''}`;
    
    // Imagen
    const img = document.createElement('img');
    img.src = slide.src;
    img.alt = slide.alt || 'Slide';
    slideDiv.appendChild(img);
    
    // Contenido superpuesto
    const content = document.createElement('div');
    content.className = 'overlay-content';
    
    if (slide.title) {
      const title = document.createElement('h3');
      title.textContent = slide.title;
      content.appendChild(title);
    }
    
    if (slide.description) {
      const desc = document.createElement('p');
      desc.textContent = slide.description;
      content.appendChild(desc);
    }
    
    slideDiv.appendChild(content);
    slider.appendChild(slideDiv);
  });
  
  // Botones de navegación
  const prevBtn = document.createElement('button');
  prevBtn.className = 'overlay-slider-prev';
  prevBtn.textContent = '❮';
  prevBtn.setAttribute('aria-label', 'Previous slide');
  
  const nextBtn = document.createElement('button');
  nextBtn.className = 'overlay-slider-next';
  nextBtn.textContent = '❯';
  nextBtn.setAttribute('aria-label', 'Next slide');
  
  // Indicadores (dots)
  const dotsDiv = document.createElement('div');
  dotsDiv.className = 'overlay-slider-dots';
  slides.forEach((_, index) => {
    const dot = document.createElement('span');
    dot.className = `overlay-dot ${index === 0 ? 'active' : ''}`;
    dot.setAttribute('data-slide', index);
    dotsDiv.appendChild(dot);
  });
  
  wrapper.appendChild(slider);
  wrapper.appendChild(prevBtn);
  wrapper.appendChild(nextBtn);
  wrapper.appendChild(dotsDiv);
  
  // Inicializar interactividad
  setTimeout(() => initOverlaySlider(sliderId), 0);
  
  return wrapper;
}

// ========================================
// 6. INICIALIZAR SLIDER
// ========================================

function initSlider(sliderId) {
  const slider = document.getElementById(sliderId);
  if (!slider) return;

  const wrapper = slider.closest('.media-slider-wrapper');
  const items = slider.querySelectorAll('.media-slider-item');
  const bullets = wrapper.querySelectorAll('.media-slider-bullet');
  const prevBtn = wrapper.querySelector('.media-slider-nav-prev');
  const nextBtn = wrapper.querySelector('.media-slider-nav-next');

  if (items.length === 0) return;

  let currentIndex = 0;
  let startX = 0;
  let isDragging = false;

  function updateUI() {
    bullets.forEach((bullet, i) => {
      bullet.classList.toggle('active', i === currentIndex);
    });

    const itemWidth = items[0].offsetWidth + 16;
    slider.scrollLeft = currentIndex * itemWidth;

    prevBtn?.classList.toggle('hidden', currentIndex === 0);
    nextBtn?.classList.toggle('hidden', currentIndex === items.length - 1);
  }

  prevBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    if (currentIndex > 0) {
      currentIndex--;
      updateUI();
    }
  });

  nextBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    if (currentIndex < items.length - 1) {
      currentIndex++;
      updateUI();
    }
  });

  bullets.forEach((bullet, index) => {
    bullet.addEventListener('click', (e) => {
      e.preventDefault();
      currentIndex = index;
      updateUI();
    });
  });

  slider.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
  });

  document.addEventListener('mouseup', (e) => {
    if (!isDragging) return;
    isDragging = false;
    
    const diff = startX - e.clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentIndex < items.length - 1) {
        currentIndex++;
      } else if (diff < 0 && currentIndex > 0) {
        currentIndex--;
      }
      updateUI();
    }
  });

  slider.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  });

  slider.addEventListener('touchend', (e) => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentIndex < items.length - 1) {
        currentIndex++;
      } else if (diff < 0 && currentIndex > 0) {
        currentIndex--;
      }
      updateUI();
    }
  });

  updateUI();
}

// ========================================
// FADE SLIDER - CON TRANSICIÓN SUAVE (FADE)
// ========================================

function initFadeSlider(sliderId) {
  const slider = document.getElementById(sliderId);
  if (!slider) return;

  const wrapper = slider.closest('.media-slider-wrapper');
  const items = slider.querySelectorAll('.media-slider-item');
  const bullets = wrapper.querySelectorAll('.media-slider-bullet');
  const prevBtn = wrapper.querySelector('.media-slider-nav-prev');
  const nextBtn = wrapper.querySelector('.media-slider-nav-next');

  if (items.length === 0) return;

  let currentIndex = 0;

  function updateUI() {
    // Mostrar/ocultar botones según posición
    if (prevBtn) {
      prevBtn.style.display = currentIndex === 0 ? 'none' : 'flex';
    }
    if (nextBtn) {
      nextBtn.style.display = currentIndex === items.length - 1 ? 'none' : 'flex';
    }
  }

  function showSlide(n) {
    items.forEach(item => item.classList.remove('active'));
    bullets.forEach(bullet => bullet.classList.remove('active'));
    
    items[n].classList.add('active');
    bullets[n].classList.add('active');
    
    // Ajustar altura del slider según la imagen actual
    const img = items[n].querySelector('img');
    if (img && img.complete) {
      // Si la imagen ya está cargada
      const imgHeight = img.offsetHeight;
      slider.style.minHeight = (imgHeight + 20) + 'px';
    } else if (img) {
      // Si la imagen aún se está cargando
      img.onload = () => {
        const imgHeight = img.offsetHeight;
        slider.style.minHeight = (imgHeight + 20) + 'px';
      };
    }
    
    updateUI();
  }

  prevBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    if (currentIndex > 0) {
      currentIndex--;
      showSlide(currentIndex);
    }
  });

  nextBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    if (currentIndex < items.length - 1) {
      currentIndex++;
      showSlide(currentIndex);
    }
  });

  bullets.forEach((bullet, index) => {
    bullet.addEventListener('click', (e) => {
      e.preventDefault();
      currentIndex = index;
      showSlide(currentIndex);
    });
  });

  showSlide(0);
}

// ========================================
// 7. COMPORTAMIENTO DE SUBACORDEONES
// ========================================

function setupNestedAccordionBehavior() {
  const nestedAccordions = document.querySelectorAll('.accordion-nested');
  
  nestedAccordions.forEach(accordion => {
    accordion.addEventListener('toggle', function() {
      if (this.open) {
        const parent = this.parentElement.closest('.accordion-content');
        if (parent) {
          const siblings = parent.querySelectorAll(':scope > .accordion-nested');
          siblings.forEach(sibling => {
            if (sibling !== this) {
              sibling.open = false;
            }
          });
        }
      }
    });
  });
}

// ========================================
// 7B. ACTUALIZAR HASH CUANDO SE ABREN ACORDEONES
// ========================================

function setupHashUpdateOnToggle() {
  // Usar delegación de eventos para escuchar todos los <details>
  document.addEventListener('toggle', (e) => {
    if (e.target.tagName === 'DETAILS' && e.target.id) {
      if (e.target.open) {
        // Cuando se abre un acordeón, actualizar el hash
        window.history.replaceState(null, '', '#' + e.target.id);
      } else {
        // Cuando se cierra, buscar un acordeón abierto (hermano o padre)
        const parent = e.target.parentElement.closest('details');
        
        // Primero, buscar hermanos abiertos
        let openSibling = null;
        if (e.target.parentElement) {
          const siblings = e.target.parentElement.querySelectorAll(':scope > details[open]');
          for (let sibling of siblings) {
            if (sibling !== e.target && sibling.id) {
              openSibling = sibling;
              break;
            }
          }
        }
        
        if (openSibling && openSibling.id) {
          // Si hay un hermano abierto, mostrar su ID
          window.history.replaceState(null, '', '#' + openSibling.id);
        } else if (parent && parent.open && parent.id) {
          // Si hay un padre abierto, mostrar su ID
          window.history.replaceState(null, '', '#' + parent.id);
        } else {
          // Si no hay nada abierto, limpiar el hash
          window.history.replaceState(null, '', window.location.pathname);
        }
      }
    }
  }, true);
}

// ========================================
// 8. NAVEGACIÓN POR HASH
// ========================================

function handleHashNavigation() {
  const hash = window.location.hash.substring(1);
  if (!hash) return;

  setTimeout(() => {
    const element = document.getElementById(hash);
    if (!element) return;

    if (element.tagName === 'DETAILS') {
      element.open = true;
      
      let parent = element.parentElement;
      while (parent) {
        if (parent.tagName === 'DETAILS') {
          parent.open = true;
        }
        parent = parent.parentElement;
      }
    }

    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
}

window.addEventListener('hashchange', handleHashNavigation);

// ========================================
// 9. ACTUALIZACIONES DE HEADER/FOOTER
// ========================================

function setupNavigationMarking() {
  const pathname = window.location.pathname;
  
  // Determinar si estamos en la página raíz o índice
  const isIndexPage = pathname === '/' || 
                      pathname === '/index.html' || 
                      pathname.endsWith('/index.html') ||
                      pathname === '' ||
                      pathname.split('/').pop() === '';
  
  const navLinks = document.querySelectorAll('.page-nav a');
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    let isActive = false;
    
    // Verificar si el enlace es para la página de inicio
    if ((href === './' || href === 'index.html') && isIndexPage) {
      isActive = true;
    } else if (href !== './' && href !== 'index.html') {
      // Para otras páginas, comparar con el nombre del archivo
      const currentFile = pathname.split('/').pop();
      isActive = href === currentFile;
    }
    
    if (isActive) {
      link.classList.add('active');
    }
  });
}

function updateHeader(lang) {
  const t = commonTranslations[lang];
  if (!t || !t.common) return;

  const navLinks = document.querySelectorAll('.page-nav a');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    const navKeys = {
      './': 'inicio',
      '.': 'inicio',
      'index.html': 'inicio',
      'informe-anual.html': 'informeAnual',
      'impacto-ambiental.html': 'impactoAmbiental',
      'impacto-social.html': 'impactoSocial',
      'gobernanza.html': 'gobernanza',
      'info-adicional.html': 'informacionAdicional'
    };

    const key = navKeys[href];
    if (key && t.common.header?.nav?.[key]) {
      link.textContent = t.common.header.nav[key];
    }
  });
}

function updateFooter(lang) {
  const t = commonTranslations[lang];
  if (!t || !t.common) return;

  const footerData = t.common.footer;
  
  const footerDesc = document.querySelector('.footer-desc');
  if (footerDesc) {
    footerDesc.textContent = footerData.descripcion || '';
  }

  const h3Elements = document.querySelectorAll('.footer-col h3');
  h3Elements.forEach(h3 => {
    const text = h3.textContent;
    if (text === 'Contacto' || text === 'Contact') {
      h3.textContent = footerData.contacto || 'Contacto';
    } else if (text === 'Información' || text === 'Information') {
      h3.textContent = footerData.informacion || 'Información';
    }
  });

  const footerLogoText = document.querySelector('.footer-logo-text');
  if (footerLogoText) {
    const paragraphs = footerLogoText.querySelectorAll('p');
    if (paragraphs[0]) paragraphs[0].innerHTML = footerData.institucion + '<br>';
    if (paragraphs[1]) paragraphs[1].textContent = footerData.informe;
  }

  const contactItems = document.querySelectorAll('.contact-item span');
  if (contactItems[0]) contactItems[0].textContent = footerData.direccion;
  if (contactItems[1]) contactItems[1].innerHTML = `${footerData.telefono}<br>${footerData.horario}`;
  if (contactItems[2]) contactItems[2].textContent = footerData.email;

  const infoLinks = document.querySelectorAll('.info-list a');
  const linkKeys = ['politicaSostenibilidad', 'planEstrategico', 'odsAgenda', 'transparencia', 'avisoLegal'];
  infoLinks.forEach((link, i) => {
    const text = footerData.links?.[linkKeys[i]];
    if (text) link.textContent = text;
  });
}

function updateLanguageButton(lang) {
  const btn = document.getElementById('language-toggle-btn');
  if (btn) {
    btn.textContent = lang === 'es' ? 'EN' : 'ES';
  }
}

// ========================================
// 10. TOGGLE DE IDIOMA
// ========================================

function setupLanguageToggle() {
  const btn = document.getElementById('language-toggle-btn');
  if (!btn) return;

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const newLang = currentLanguage === 'es' ? 'en' : 'es';
    applyLanguage(newLang);
  });
}

// ========================================
// OVERLAY SLIDER INITIALIZATION
// ========================================

function initOverlaySlider(sliderId) {
  const slider = document.getElementById(sliderId);
  if (!slider) return;

  const wrapper = slider.parentElement;
  const slides = slider.querySelectorAll('.overlay-slide');
  const dots = wrapper.querySelectorAll('.overlay-dot');
  const prevBtn = wrapper.querySelector('.overlay-slider-prev');
  const nextBtn = wrapper.querySelector('.overlay-slider-next');

  if (slides.length === 0) return;

  let currentSlide = 0;

  function updateUI() {
    // Mostrar/ocultar botones según posición
    if (prevBtn) {
      prevBtn.style.display = currentSlide === 0 ? 'none' : 'flex';
    }
    if (nextBtn) {
      nextBtn.style.display = currentSlide === slides.length - 1 ? 'none' : 'flex';
    }
  }

  function showSlide(n) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    slides[n].classList.add('active');
    dots[n].classList.add('active');
    
    updateUI();
  }

  prevBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    if (currentSlide > 0) {
      currentSlide--;
      showSlide(currentSlide);
    }
  });

  nextBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    if (currentSlide < slides.length - 1) {
      currentSlide++;
      showSlide(currentSlide);
    }
  });

  dots.forEach((dot, index) => {
    dot.addEventListener('click', (e) => {
      e.preventDefault();
      currentSlide = index;
      showSlide(currentSlide);
    });
  });

  showSlide(0);
}

// ========================================
// INICIAR
// ========================================

loadContent();

// ========================================
// 11. MENÚ HAMBURGUESA MÓVIL
// ========================================

function setupMobileMenu() {
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navMenu      = document.getElementById('page-nav-menu');
  const closeBtn     = document.getElementById('nav-close-btn');
  const backdrop     = document.getElementById('nav-backdrop');

  // Si no existen los elementos (e.g. página sin header), salir sin errores
  if (!hamburgerBtn || !navMenu) return;

  // --- Función: abrir el menú ---
  function openMenu() {
    navMenu.classList.add('show-menu');
    hamburgerBtn.classList.add('is-active');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('nav-open');
    if (backdrop) {
      backdrop.classList.add('is-visible');
    }
  }

  // --- Función: cerrar el menú ---
  function closeMenu() {
    navMenu.classList.remove('show-menu');
    hamburgerBtn.classList.remove('is-active');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
    if (backdrop) {
      backdrop.classList.remove('is-visible');
    }
  }

  // --- Toggle al hacer clic en el botón hamburguesa ---
  hamburgerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (navMenu.classList.contains('show-menu')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // --- Cerrar al hacer clic en el botón X del panel ---
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      closeMenu();
    });
  }

  // --- Cerrar al hacer clic en el backdrop (fuera del menú) ---
  if (backdrop) {
    backdrop.addEventListener('click', () => {
      closeMenu();
    });
  }

  // --- Cerrar al hacer clic en cualquier enlace del nav ---
  // Usamos event delegation para capturar tanto enlaces estáticos como dinámicos
  navMenu.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link) {
      closeMenu();
    }
  });

  // --- Cerrar con tecla Escape ---
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('show-menu')) {
      closeMenu();
      hamburgerBtn.focus(); // Devolver foco al botón (accesibilidad)
    }
  });

  // --- Cerrar automáticamente si la pantalla se hace más grande (resize a desktop) ---
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768 && navMenu.classList.contains('show-menu')) {
      closeMenu();
    }
  });
}
