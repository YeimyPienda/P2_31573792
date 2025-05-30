
document.addEventListener('DOMContentLoaded', () => {


    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    });

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.service-card, .tech-card, .testimonial-card, .stat-card').forEach(el => {
        observer.observe(el);
    });

    const contactForm = document.querySelector('.contact-form');
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nombre = contactForm.querySelector('input[type="text"]').value.trim();
        const email = contactForm.querySelector('input[type="email"]').value.trim();
        const mensaje = contactForm.querySelector('textarea').value.trim();

        if (!nombre || !email || !mensaje) {
            showAlert('Por favor completa todos los campos', 'error');
            return;
        }

        if (!validateEmail(email)) {
            showAlert('Ingresa un correo electrónico válido', 'error');
            return;
        }

        showAlert('Mensaje enviado correctamente', 'success');
        contactForm.reset();
    });

    

    let testimonialIndex = 0;
    const testimonios = document.querySelectorAll('.testimonial-card');
    
    function showTestimonial(index) {
        testimonios.forEach((testimonio, i) => {
            testimonio.style.display = i === index ? 'block' : 'none';
        });
    }
    
    function autoSlide() {
        testimonialIndex = (testimonialIndex + 1) % testimonios.length;
        showTestimonial(testimonialIndex);
    }
    
    if (testimonios.length > 1) {
        setInterval(autoSlide, 5000);
    }

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function showAlert(message, type) {
        const alert = document.createElement('div');
        alert.className = `alert ${type}`;
        alert.textContent = message;
        
        document.body.appendChild(alert);
        
        setTimeout(() => {
            alert.remove();
        }, 3000);
    }
});