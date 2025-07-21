// JavaScript crítico optimizado
(function() {
    'use strict';
    
    // Variables globales
    const isMobile = window.innerWidth <= 768;
    
    // Preloader
    function hidePreloader() {
        const preloader = document.getElementById('preloader');
        const pageContent = document.getElementById('page-content');
        
        if (preloader && pageContent) {
            preloader.classList.add('fade-out');
            pageContent.style.visibility = 'visible';
            setTimeout(() => preloader.remove(), 500);
        }
    }
    
    // Mobile menu toggle
    function initMobileMenu() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
        }
    }
    
    // Smooth scroll para navigation
    function initSmoothScroll() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('a[href^="#"]')) {
                e.preventDefault();
                const targetId = e.target.getAttribute('href').slice(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    }
    
    // Basic form handling
    function initForms() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                // Simular envío exitoso
                alert('¡Mensaje enviado correctamente! Te contactaremos pronto.');
                form.reset();
            });
        });
    }
    
    // Back to top button
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
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // Intersection Observer para animaciones básicas
    function initScrollAnimations() {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('fade-in');
                    }
                });
            }, { threshold: 0.1 });
            
            // Solo observar elementos críticos
            const animatedElements = document.querySelectorAll('.stat-item, .testimonial-card');
            animatedElements.forEach(el => observer.observe(el));
        }
    }
    
    // Inicialización cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    function init() {
        hidePreloader();
        initMobileMenu();
        initSmoothScroll();
        initForms();
        initBackToTop();
        initScrollAnimations();
    }
    
    // Cargar funcionalidades no críticas después
    window.addEventListener('load', () => {
        // Cargar Service Worker
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').catch(() => {});
        }
        
        // Diferir otras funcionalidades
        setTimeout(() => {
            // Aquí se pueden cargar funcionalidades adicionales
        }, 1000);
    });
})();
