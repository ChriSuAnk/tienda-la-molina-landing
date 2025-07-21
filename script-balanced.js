// JavaScript optimizado con todas las funcionalidades
(function() {
    'use strict';
    
    // Configuración optimizada del dispositivo
    const isMobile = window.innerWidth <= 768;
    const isTouchDevice = 'ontouchstart' in window;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    const config = {
        enableAnimations: !prefersReducedMotion,
        enableHover: !isTouchDevice && !isMobile,
        animationSpeed: isMobile ? 0.5 : 1
    };
    
    // ==================== INICIALIZACIÓN ====================
    function init() {
        initPreloader();
        initNavigation();
        initSmoothScroll();
        initScrollAnimations();
        initForms();
        initBackToTop();
        initStatsCounter();
        initGallery();
        initServiceWorker();
    }
    
    // ==================== PRELOADER ====================
    function initPreloader() {
        const preloader = document.getElementById('preloader');
        const pageContent = document.getElementById('page-content');
        
        function hidePreloader() {
            if (preloader) {
                preloader.classList.add('fade-out');
                if (pageContent) {
                    pageContent.style.visibility = 'visible';
                    pageContent.classList.add('loaded');
                }
                setTimeout(() => preloader.remove(), 500);
            }
        }
        
        window.addEventListener('load', hidePreloader);
        setTimeout(hidePreloader, 3000); // Fallback
    }
    
    // ==================== NAVEGACIÓN ====================
    function initNavigation() {
        // Mobile menu
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
            
            // Cerrar menú al hacer click en un link
            navMenu.addEventListener('click', (e) => {
                if (e.target.classList.contains('nav-link')) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            });
        }
        
        // Header scroll effect
        const header = document.querySelector('.header');
        let lastScroll = 0;
        let ticking = false;
        
        function updateHeader() {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            // Hide/show header on scroll
            if (currentScroll > lastScroll && currentScroll > 200) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
            
            lastScroll = currentScroll;
            ticking = false;
        }
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateHeader);
                ticking = true;
            }
        });
        
        // Breadcrumb update
        const breadcrumbCurrent = document.getElementById('current-section');
        const sections = document.querySelectorAll('section[id]');
        
        function updateBreadcrumb() {
            let current = 'Bienvenido';
            const scrollPos = window.scrollY + 150;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                
                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    const sectionName = {
                        'inicio': 'Inicio',
                        'nosotros': 'Nosotros',
                        'productos': 'Productos',
                        'servicios': 'Servicios',
                        'contacto': 'Contacto'
                    }[section.id] || 'Bienvenido';
                    current = sectionName;
                }
            });
            
            if (breadcrumbCurrent) {
                breadcrumbCurrent.textContent = current;
            }
        }
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateBreadcrumb);
                ticking = true;
            }
        });
    }
    
    // ==================== SMOOTH SCROLL ====================
    function initSmoothScroll() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('a[href^="#"]')) {
                e.preventDefault();
                const targetId = e.target.getAttribute('href').slice(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 100;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    }
    
    // ==================== SCROLL ANIMATIONS ====================
    function initScrollAnimations() {
        if (!config.enableAnimations) return;
        
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Observar elementos para animaciones
        const animatedElements = document.querySelectorAll(
            '.stat-item, .product-card, .service-card, .testimonial-card, .about-content, .hero-content'
        );
        
        animatedElements.forEach((el, index) => {
            el.classList.add('fade-in-up');
            el.style.transitionDelay = `${index * 0.1}s`;
            observer.observe(el);
        });
    }
    
    // ==================== COUNTER ANIMATION ====================
    function initStatsCounter() {
        const statNumbers = document.querySelectorAll('.stat-number');
        let hasAnimated = false;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasAnimated) {
                    hasAnimated = true;
                    animateCounters();
                }
            });
        });
        
        if (statNumbers.length > 0) {
            observer.observe(statNumbers[0].parentElement);
        }
        
        function animateCounters() {
            statNumbers.forEach(stat => {
                const target = parseInt(stat.textContent.replace(/[^0-9]/g, ''));
                const suffix = stat.textContent.replace(/[0-9]/g, '');
                let current = 0;
                const increment = target / 60;
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        stat.textContent = target + suffix;
                        clearInterval(timer);
                    } else {
                        stat.textContent = Math.floor(current) + suffix;
                    }
                }, 50);
            });
        }
    }
    
    // ==================== FORMULARIOS ====================
    function initForms() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const formData = new FormData(form);
                const formType = form.id;
                
                // Simular envío
                showNotification('¡Mensaje enviado correctamente! Te contactaremos pronto.', 'success');
                form.reset();
            });
            
            // Validación en tiempo real
            const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
            inputs.forEach(input => {
                input.addEventListener('blur', validateField);
                input.addEventListener('input', clearError);
            });
        });
        
        function validateField(e) {
            const field = e.target;
            const value = field.value.trim();
            
            clearError(e);
            
            if (!value) {
                showFieldError(field, 'Este campo es obligatorio');
                return false;
            }
            
            if (field.type === 'email' && !isValidEmail(value)) {
                showFieldError(field, 'Ingrese un email válido');
                return false;
            }
            
            return true;
        }
        
        function showFieldError(field, message) {
            field.style.borderColor = '#ef4444';
            
            let errorElement = field.parentNode.querySelector('.error-message');
            if (!errorElement) {
                errorElement = document.createElement('span');
                errorElement.className = 'error-message';
                errorElement.style.color = '#ef4444';
                errorElement.style.fontSize = '0.875rem';
                errorElement.style.marginTop = '0.25rem';
                field.parentNode.appendChild(errorElement);
            }
            errorElement.textContent = message;
        }
        
        function clearError(e) {
            const field = e.target;
            field.style.borderColor = '#d1d5db';
            
            const errorElement = field.parentNode.querySelector('.error-message');
            if (errorElement) {
                errorElement.remove();
            }
        }
        
        function isValidEmail(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        }
    }
    
    // ==================== BACK TO TOP ====================
    function initBackToTop() {
        const backToTopBtn = document.getElementById('backToTop');
        if (!backToTopBtn) return;
        
        let ticking = false;
        
        function updateBackToTop() {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
            ticking = false;
        }
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateBackToTop);
                ticking = true;
            }
        });
        
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // ==================== GALLERY MODAL ====================
    function initGallery() {
        const galleryButtons = document.querySelectorAll('.btn-view-gallery');
        const modal = document.getElementById('galleryModal');
        const modalTitle = document.getElementById('galleryTitle');
        const modalClose = document.querySelector('.modal-close');
        
        if (!modal) return;
        
        const galleryData = {
            ropa: [
                { title: 'Camisetas', image: 'placeholder' },
                { title: 'Pantalones', image: 'placeholder' },
                { title: 'Vestidos', image: 'placeholder' },
                { title: 'Accesorios', image: 'placeholder' }
            ],
            tecnologia: [
                { title: 'Smartphones', image: 'placeholder' },
                { title: 'Laptops', image: 'placeholder' },
                { title: 'Auriculares', image: 'placeholder' },
                { title: 'Accesorios', image: 'placeholder' }
            ],
            hogar: [
                { title: 'Decoración', image: 'placeholder' },
                { title: 'Cocina', image: 'placeholder' },
                { title: 'Baño', image: 'placeholder' },
                { title: 'Jardín', image: 'placeholder' }
            ]
        };
        
        galleryButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const category = button.dataset.gallery;
                const categoryData = galleryData[category] || [];
                
                modalTitle.textContent = `Galería de ${category.charAt(0).toUpperCase() + category.slice(1)}`;
                
                const galleryGrid = document.getElementById('galleryGrid');
                galleryGrid.innerHTML = categoryData.map(item => `
                    <div class="gallery-item">
                        <div class="gallery-placeholder">
                            <i class="fas fa-image"></i>
                        </div>
                        <h4>${item.title}</h4>
                    </div>
                `).join('');
                
                modal.classList.add('show');
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            });
        });
        
        // Cerrar modal
        [modalClose, modal].forEach(element => {
            element.addEventListener('click', (e) => {
                if (e.target === element) {
                    modal.classList.remove('show');
                    modal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }
            });
        });
        
        // Cerrar con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('show')) {
                modal.classList.remove('show');
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }
    
    // ==================== SERVICE WORKER ====================
    function initServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(() => console.log('SW registered'))
                    .catch(() => console.log('SW registration failed'));
            });
        }
    }
    
    // ==================== NOTIFICACIONES ====================
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Estilos inline para la notificación
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: type === 'success' ? '#10b981' : '#3b82f6',
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '0.5rem',
            boxShadow: '0 10px 15px rgba(0,0,0,0.1)',
            zIndex: '10000',
            transform: 'translateX(400px)',
            transition: 'transform 0.3s ease'
        });
        
        document.body.appendChild(notification);
        
        // Animar entrada
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
        });
        
        // Remover después de 5 segundos
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
    
    // ==================== UTILIDADES ====================
    function copyToClipboard(text) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                showNotification('Dirección copiada al portapapeles', 'success');
            });
        }
    }
    
    // Hacer disponible globalmente
    window.copyToClipboard = copyToClipboard;
    
    // ==================== INICIALIZACIÓN ====================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
