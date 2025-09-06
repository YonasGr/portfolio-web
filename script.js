(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const DOMElements = {
        loader: document.querySelector('.loader'),
        loadingProgress: document.getElementById('loadingProgress'),
        contactForm: document.getElementById('contactForm'),
        formMessage: document.getElementById('formMessage'),
        particlesContainer: document.getElementById('particles-js'),
        floatingShapes: document.getElementById('floatingShapes'),
    };
    const BACKEND_URL = 'https://yonasgirma-porfolio.onrender.com/send-message';

    // Remove old particle and floating shapes containers
    if (DOMElements.particlesContainer) DOMElements.particlesContainer.remove();
    if (DOMElements.floatingShapes) DOMElements.floatingShapes.remove();
    
    // Animate loader and initialize animations on page load
    window.addEventListener('load', () => {
        gsap.to(DOMElements.loadingProgress, {
            width: '100%',
            duration: 0.5,
            ease: 'power2.inOut',
            onComplete: () => {
                gsap.to(DOMElements.loader, {
                    opacity: 0,
                    duration: 0.5,
                    onComplete: () => {
                        DOMElements.loader.style.display = 'none';
                        if (!prefersReducedMotion) {
                            initAnimations();
                        } else {
                            // Fallback for reduced motion
                            document.querySelectorAll('section').forEach(section => {
                                section.style.opacity = '1';
                                section.style.transform = 'none';
                            });
                            document.querySelectorAll('.progress').forEach(bar => {
                                bar.style.width = bar.getAttribute('data-width') + '%';
                            });
                        }
                    }
                });
            }
        });
    });

function initAnimations() {
    if (typeof gsap === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    // Title and Subtitle animations
    gsap.to(".title-animation", { duration: 2, text: "Yonas Girma", ease: "power2.inOut" });
    gsap.to(".subtitle", { duration: 1.5, opacity: 1, y: 0, ease: "elastic.out(1, 0.5)", delay: 1.5 });

    animateProgressBars();
    animateSections();
    animateFormElements();
    setupNavDots(); // This is the crucial line you were missing
    setupContactForm();
}
    
    function animateProgressBars() {
        gsap.utils.toArray('.progress').forEach(progress => {
            const width = progress.getAttribute('data-width');
            const percentageText = progress.closest('.progress-container').querySelector('.skill-name span:last-child');
            gsap.set(progress, { width: "0%" });
            percentageText.textContent = "0%";
            
            ScrollTrigger.create({
                trigger: progress.closest('.progress-container'),
                start: "top 80%",
                onEnter: () => {
                    gsap.to(progress, {
                        width: `${width}%`,
                        duration: 1.8,
                        ease: "power2.out",
                        onUpdate: () => {
                            percentageText.textContent = `${Math.round(parseFloat(gsap.getProperty(progress, "width")))}%`;
                        },
                        onComplete: () => {
                            percentageText.textContent = `${width}%`;
                        }
                    });
                }
            });
        });
    }

    function animateSections() {
        gsap.utils.toArray('section').forEach((section, i) => {
            section.style.willChange = 'transform, opacity';
            ScrollTrigger.create({
                trigger: section,
                start: "top 85%",
                onEnter: () => {
                    gsap.to(section, { opacity: 1, y: 0, duration: 0.8, ease: "back.out(1.2)" });
                    document.querySelectorAll('.dot').forEach(dot => dot.classList.remove('active'));
                    document.querySelectorAll('.dot')[i + 1]?.classList.add('active');
                }
            });
        });
    }

    function animateFormElements() {
        gsap.utils.toArray('.form-group').forEach((group, i) => {
            gsap.from(group, {
                opacity: 0,
                y: 20,
                duration: 0.5,
                delay: i * 0.1,
                scrollTrigger: {
                    trigger: '#contact',
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                }
            });
        });
    }
    
    function setupContactForm() {
        DOMElements.contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = DOMElements.contactForm.querySelector('.submit-btn');
            const originalBtnText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<span>Sending...</span>';
            submitBtn.disabled = true;
            
            const formData = new FormData(DOMElements.contactForm);
            const data = Object.fromEntries(formData);
            
            if (data.captcha !== '825F') {
                showMessage('Invalid captcha! Please try again.', 'error');
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
                return;
            }
            
            try {
                const response = await fetch(BACKEND_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    showMessage('Message sent successfully! I will get back to you soon.', 'success');
                    DOMElements.contactForm.reset();
                } else {
                    showMessage('Failed to send message. Please try again later.', 'error');
                    console.error('Backend error:', result);
                }
            } catch (error) {
                showMessage('An error occurred. Please try again later.', 'error');
                console.error('Error sending message:', error);
            } finally {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }

    function showMessage(text, type) {
        DOMElements.formMessage.textContent = text;
        DOMElements.formMessage.className = `form-message ${type}`;
        
        setTimeout(() => {
            DOMElements.formMessage.style.opacity = '0';
            setTimeout(() => {
                DOMElements.formMessage.className = 'form-message';
                DOMElements.formMessage.style.opacity = '1';
            }, 300);
        }, 5000);
    }
    
    function setupNavDots() {
        document.querySelectorAll('.dot').forEach(dot => {
            dot.addEventListener('click', () => {
                const sectionId = dot.getAttribute('data-section');
                gsap.to(window, { duration: 1.2, scrollTo: `#${sectionId}`, ease: "power2.inOut" });
            });
        });
    }

    document.querySelectorAll('.dot')[0]?.classList.add('active');
})();
