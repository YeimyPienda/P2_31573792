 // Animation on scroll
        document.addEventListener('DOMContentLoaded', () => {
            const animateElements = document.querySelectorAll('.animate');
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('show');
                    }
                });
            }, {
                threshold: 0.1
            });

            animateElements.forEach(el => observer.observe(el));

          
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    const targetId = this.getAttribute('href');
                    if (targetId === '#') return;
                    
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        window.scrollTo({
                            top: targetElement.offsetTop - 80,
                            behavior: 'smooth'
                        });
                    }
                });
            });

          
            window.addEventListener('scroll', () => {
                const header = document.querySelector('header');
                if (window.scrollY > 50) {
                    header.classList.add('shadow-md');
                    header.classList.add('bg-opacity-90');
                    header.classList.add('backdrop-blur-sm');
                } else {
                    header.classList.remove('shadow-md');
                    header.classList.remove('bg-opacity-90');
                    header.classList.remove('backdrop-blur-sm');
                }
            });

            const mobileMenuButton = document.querySelector('button.md\\:hidden');
            const mobileMenu = document.querySelector('nav ul');
            
            mobileMenuButton.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
                mobileMenu.classList.toggle('absolute');
                mobileMenu.classList.toggle('top-full');
                mobileMenu.classList.toggle('left-0');
                mobileMenu.classList.toggle('w-full');
                mobileMenu.classList.toggle('bg-white');
                mobileMenu.classList.toggle('p-4');
                mobileMenu.classList.toggle('shadow-md');
                mobileMenu.classList.toggle('flex-col');
                mobileMenu.classList.toggle('space-y-4');
                mobileMenu.classList.toggle('space-x-8');
            });
        });