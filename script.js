// ==================== DETECCIÓN DE DISPOSITIVOS (GLOBAL) ====================

// Detectar dispositivos móviles y tablets
const isMobile = window.innerWidth <= 768;
const isTablet = window.innerWidth <= 1024 && window.innerWidth > 768;
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Configuración adaptativa según el dispositivo
const deviceConfig = {
    enableParticles: !isMobile && !prefersReducedMotion,
    enableAdvancedAnimations: !isMobile && !prefersReducedMotion,
    enableHoverEffects: !isTouchDevice && !isMobile,
    particleCount: isMobile ? 0 : (isTablet ? 25 : 50),
    animationSpeed: isMobile ? 0.5 : 1,
    enableTypewriter: !isMobile,
    enableMagnetic: !isTouchDevice && !isMobile,
    enableRipple: !isMobile
};

document.addEventListener('DOMContentLoaded', function() {
    
    // ==================== PRELOADER ====================
    const preloader = document.getElementById('preloader');
    const pageContent = document.getElementById('page-content');
    
    function hidePreloader() {
        if (preloader) {
            preloader.classList.add('hidden');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }
        if (pageContent) {
            pageContent.classList.add('loaded');
        }
    }
    
    window.addEventListener('load', hidePreloader);
    setTimeout(hidePreloader, 3000);

    // ==================== NAVEGACIÓN MÓVIL ====================
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Cerrar menú al hacer clic en enlace
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // ==================== NAVEGACIÓN SUAVE ====================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ==================== BREADCRUMBS DINÁMICOS ====================
    const sections = document.querySelectorAll('section[id]');
    const currentSection = document.getElementById('current-section');

    function updateBreadcrumb() {
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                const sectionTitle = getSectionTitle(section.id);
                if (currentSection) {
                    currentSection.textContent = sectionTitle;
                }
            }
        });
    }

    function getSectionTitle(id) {
        const titles = {
            'inicio': 'Inicio',
            'nosotros': 'Nosotros',
            'productos': 'Productos',
            'servicios': 'Servicios',
            'contacto': 'Contacto'
        };
        return titles[id] || 'Bienvenido';
    }

    window.addEventListener('scroll', updateBreadcrumb);

    // ==================== ANIMACIONES AL SCROLL ====================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observar elementos para animaciones
    document.querySelectorAll('.stagger-animation, .fade-in-up, .stat-item').forEach(el => {
        observer.observe(el);
    });

    // ==================== CONTADOR DE ESTADÍSTICAS ====================
    function animateCounter(element, target) {
        let current = 0;
        const increment = target / 100;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            const displayValue = current % 1 === 0 ? current.toString() : current.toFixed(1);
            element.textContent = displayValue + (target >= 1000 ? '+' : '');
        }, 20);
    }

    // Animar contadores cuando sean visibles
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const numbers = entry.target.querySelectorAll('.stat-number');
                numbers.forEach(number => {
                    const target = parseFloat(number.textContent);
                    animateCounter(number, target);
                });
                statsObserver.unobserve(entry.target);
            }
        });
    });

    const statsSection = document.querySelector('.stats');
    if (statsSection) statsObserver.observe(statsSection);

    // ==================== FORMULARIOS ====================
    const contactForm = document.getElementById('contactForm');
    const newsletterForm = document.getElementById('newsletterForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showNotification('Mensaje enviado correctamente. Te contactaremos pronto.', 'success');
            contactForm.reset();
        });
    }

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showNotification('¡Suscripción exitosa! Recibirás tu cupón de descuento por email.', 'success');
            newsletterForm.reset();
        });
    }

    // ==================== SISTEMA DE NOTIFICACIONES ====================
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    // ==================== GALERÍA DE PRODUCTOS ====================
    const galleryButtons = document.querySelectorAll('.btn-view-gallery');
    const galleryModal = document.getElementById('galleryModal');
    const galleryTitle = document.getElementById('galleryTitle');
    const galleryGrid = document.getElementById('galleryGrid');
    const modalClose = document.querySelector('.modal-close');

    const productGalleries = {
        ropa: [
            { name: 'Camisetas', image: 'https://via.placeholder.com/300x200?text=Camisetas' },
            { name: 'Pantalones', image: 'https://via.placeholder.com/300x200?text=Pantalones' },
            { name: 'Zapatos', image: 'https://via.placeholder.com/300x200?text=Zapatos' },
            { name: 'Accesorios', image: 'https://via.placeholder.com/300x200?text=Accesorios' }
        ],
        tecnologia: [
            { name: 'Smartphones', image: 'https://via.placeholder.com/300x200?text=Smartphones' },
            { name: 'Laptops', image: 'https://via.placeholder.com/300x200?text=Laptops' },
            { name: 'Tablets', image: 'https://via.placeholder.com/300x200?text=Tablets' },
            { name: 'Accesorios Tech', image: 'https://via.placeholder.com/300x200?text=Accesorios' }
        ],
        hogar: [
            { name: 'Decoración', image: 'https://via.placeholder.com/300x200?text=Decoración' },
            { name: 'Cocina', image: 'https://via.placeholder.com/300x200?text=Cocina' },
            { name: 'Baño', image: 'https://via.placeholder.com/300x200?text=Baño' },
            { name: 'Jardín', image: 'https://via.placeholder.com/300x200?text=Jardín' }
        ]
    };

    galleryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-gallery');
            const products = productGalleries[category] || [];
            
            galleryTitle.textContent = `Galería - ${category.charAt(0).toUpperCase() + category.slice(1)}`;
            galleryGrid.innerHTML = products.map(product => `
                <div class="gallery-item">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                    <div class="gallery-item-overlay">
                        <h4>${product.name}</h4>
                    </div>
                </div>
            `).join('');
            
            galleryModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    if (modalClose) {
        modalClose.addEventListener('click', closeGallery);
    }

    if (galleryModal) {
        galleryModal.addEventListener('click', function(e) {
            if (e.target === galleryModal) {
                closeGallery();
            }
        });
    }

    function closeGallery() {
        galleryModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // ==================== BOTÓN VOLVER ARRIBA ====================
    const backToTopButton = document.getElementById('backToTop');

    function toggleBackToTop() {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    }

    if (backToTopButton) {
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ==================== UTILIDADES ====================
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Optimizar scroll events
    window.addEventListener('scroll', debounce(() => {
        updateBreadcrumb();
        toggleBackToTop();
    }, 16));

    // Manejar redimensionamiento de ventana
    window.addEventListener('resize', debounce(() => {
        // Recalcular dimensiones si es necesario
    }, 250));

    console.log('✅ Tienda La Molina - Script cargado correctamente');
});
