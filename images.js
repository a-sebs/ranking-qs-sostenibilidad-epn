// ========================================
// GESTIÓN DE IMÁGENES Y SLIDERS
// ========================================

let assets = {};
let assetsLoaded = false;

// Cargar assets (imágenes y PDFs) desde assets.json
fetch('assets.json')
    .then(response => response.json())
    .then(data => {
        assets = data;
        assetsLoaded = true;
        // Cargar imágenes si estamos en una página que las necesita
        if (window.location.pathname.includes('impacto-ambiental')) {
            loadSliderImages();
        }
    })
    .catch(error => {
        console.error('Error cargando assets:', error);
        assetsLoaded = false;
    });


/**
 * Inicializa un slider con navegación, bullets y soporte drag/swipe
 * @param {string} sliderId - ID del contenedor del slider
 */
function initSlider(sliderId) {
    const slider = document.getElementById(sliderId);
    if (!slider) return;

    const sliderWrapper = slider.closest('.media-slider-wrapper');
    const images = slider.querySelectorAll('.media-slider-item');
    const bullets = sliderWrapper.querySelectorAll('.media-slider-bullet');
    const prevBtn = sliderWrapper.querySelector('.media-slider-nav-prev');
    const nextBtn = sliderWrapper.querySelector('.media-slider-nav-next');

    if (images.length === 0) return;

    let currentIndex = 0;
    let startX = 0;
    let isDragging = false;

    /**
     * Actualiza la UI: bullets activos, visibilidad de botones y scroll
     */
    function updateUI() {
        // Actualizar bullets
        bullets.forEach((bullet, i) => {
            bullet.classList.toggle('active', i === currentIndex);
        });

        // Mostrar/Ocultar botones según posición
        prevBtn.classList.toggle('hidden', currentIndex === 0);
        nextBtn.classList.toggle('hidden', currentIndex === images.length - 1);

        // Desplazar al centro
        images[currentIndex].scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
        });
    }

    // Botones de navegación
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateUI();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentIndex < images.length - 1) {
            currentIndex++;
            updateUI();
        }
    });

    // Drag/Swipe en desktop
    slider.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
    });

    slider.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
    });

    slider.addEventListener('mouseup', (e) => {
        if (!isDragging) return;
        isDragging = false;

        const endX = e.clientX;
        const diff = startX - endX;

        // Si se arrastra más de 50px, cambiar de imagen
        if (Math.abs(diff) > 50) {
            if (diff > 0 && currentIndex < images.length - 1) {
                currentIndex++;
            } else if (diff < 0 && currentIndex > 0) {
                currentIndex--;
            }
            updateUI();
        }
    });

    // Touch support (mobile)
    slider.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });

    slider.addEventListener('touchend', (e) => {
        const endX = e.changedTouches[0].clientX;
        const diff = startX - endX;

        if (Math.abs(diff) > 50) {
            if (diff > 0 && currentIndex < images.length - 1) {
                currentIndex++;
            } else if (diff < 0 && currentIndex > 0) {
                currentIndex--;
            }
            updateUI();
        }
    });

    // Intersection Observer para sincronizar con scroll
    const observerOptions = {
        root: slider,
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                currentIndex = Array.from(images).indexOf(entry.target);
                bullets.forEach((bullet, i) => {
                    bullet.classList.toggle('active', i === currentIndex);
                });
                prevBtn.classList.toggle('hidden', currentIndex === 0);
                nextBtn.classList.toggle('hidden', currentIndex === images.length - 1);
            }
        });
    }, observerOptions);

    images.forEach(img => observer.observe(img));

    updateUI();
}

/**
 * Carga dinámicamente las imágenes desde assets.json e inicializa los sliders
 */
function loadSliderImages() {
    if (!assetsLoaded || !assets.impactoAmbiental || !assets.impactoAmbiental.images) {
        return;
    }

    const sliders = assets.impactoAmbiental.images.sliders;
    
    // Para cada slider en la página
    Object.keys(sliders).forEach(sectionKey => {
        const sliderId = `slider-${sectionKey}`;
        const sliderContainer = document.getElementById(sliderId);
        
        if (!sliderContainer) return;
        
        const images = sliders[sectionKey];
        
        // Limpiar el contenedor
        sliderContainer.innerHTML = '';
        
        // Agregar todas las imágenes
        images.forEach((imgData) => {
            const img = document.createElement('img');
            img.src = imgData.src;
            img.alt = imgData.alt;
            img.className = 'media-slider-item';
            sliderContainer.appendChild(img);
        });
        
        // Generar bullets basados en la cantidad de imágenes
        const bulletsContainer = sliderContainer.parentElement.querySelector('.media-slider-bullets');
        if (bulletsContainer) {
            bulletsContainer.innerHTML = '';
            images.forEach((_, index) => {
                const bullet = document.createElement('span');
                bullet.className = 'media-slider-bullet';
                if (index === 0) {
                    bullet.classList.add('active');
                }
                bulletsContainer.appendChild(bullet);
            });
        }
    });
    
    // Inicializar todos los sliders DESPUÉS de cargar las imágenes
    setTimeout(() => {
        Object.keys(sliders).forEach(sectionKey => {
            const sliderId = `slider-${sectionKey}`;
            initSlider(sliderId);
        });
    }, 10);
}
