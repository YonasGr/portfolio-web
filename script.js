(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Loader simulation
    const loader = document.querySelector('.loader');
    const loadingProgress = document.getElementById('loadingProgress');
    let progress = 0;
    
    const loadingInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(loadingInterval);
            setTimeout(() => {
                loader.style.opacity = '0';
                setTimeout(() => {
                    loader.style.display = 'none';
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
                }, 1000);
            }, 500);
        }
        loadingProgress.style.width = `${progress}%`;
    }, 200);

    // Remove particles container if it exists
    const particlesContainer = document.getElementById('particles-js');
    if (particlesContainer) {
        particlesContainer.remove();
    }

    // Floating shapes with reduced quantity (optional - remove if not needed)
    if (!prefersReducedMotion) {
        const floatingShapes = document.getElementById('floatingShapes');
        if (floatingShapes) {
            floatingShapes.remove();
        }
    }

    // Initialize animations
    function initAnimations() {
        if (typeof gsap !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);

            // Title animation
            gsap.to(".title-animation", {
                duration: 2,
                text: "Yonas Girma",
                ease: "power2.inOut"
            });

            // Subtitle animation
            gsap.to(".subtitle", {
                duration: 1.5,
                opacity: 1,
                y: 0,
                ease: "elastic.out(1, 0.5)",
                delay: 1.5
            });

            // Progress bars animation
            gsap.utils.toArray('.progress').forEach(progress => {
                const width = progress.getAttribute('data-width');
                const percentageText = progress.closest('.progress-container')
                                            .querySelector('.skill-name span:last-child');
                
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
                                const currentWidth = Math.round(parseFloat(gsap.getProperty(progress, "width")));
                                percentageText.textContent = `${currentWidth}%`;
                            },
                            onComplete: () => {
                                percentageText.textContent = `${width}%`;
                            }
                        });
                    }
                });
            });

            // Section animations
            gsap.utils.toArray('section').forEach((section, i) => {
                section.style.willChange = 'transform, opacity';
                ScrollTrigger.create({
                    trigger: section,
                    start: "top 85%",
                    onEnter: () => {
                        gsap.to(section, {
                            opacity: 1,
                            y: 0,
                            duration: 0.8,
                            ease: "back.out(1.2)"
                        });
                        // Update nav dots
                        document.querySelectorAll('.dot').forEach(dot => dot.classList.remove('active'));
                        document.querySelectorAll('.dot')[i + 1]?.classList.add('active');
                    }
                });
            });

            // Telegram Bot Integration
            const contactForm = document.getElementById('contactForm');
            const formMessage = document.getElementById('formMessage');

            // Replace with your actual backend URL from Render
            const BACKEND_URL = 'https://your-backend-service.onrender.com/send-message'; 
            
            contactForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const submitBtn = contactForm.querySelector('.submit-btn');
                const originalBtnText = submitBtn.innerHTML;
                
                // Show loading state
                submitBtn.innerHTML = '<span>Sending...</span>';
                submitBtn.disabled = true;
                
                // Get form data
                const formData = new FormData(contactForm);
                const data = Object.fromEntries(formData);
                
                // Validate captcha
                if (data.captcha !== '825F') {
                    showMessage('Invalid captcha! Please try again.', 'error');
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                    return;
                }
                
                try {
                    // Send data to your backend service
                    const response = await fetch(BACKEND_URL, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data)
                    });
                    
                    const result = await response.json();
                    
                    if (result.success) {
                        showMessage('Message sent successfully! I will get back to you soon.', 'success');
                        contactForm.reset();
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

            function showMessage(text, type) {
                formMessage.textContent = text;
                formMessage.className = `form-message ${type}`;
                
                // Hide message after 5 seconds
                setTimeout(() => {
                    formMessage.style.opacity = '0';
                    setTimeout(() => {
                        formMessage.className = 'form-message';
                        formMessage.style.opacity = '1';
                    }, 300);
                }, 5000);
            }

            // Animation for form elements
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

            // Nav dots functionality
            document.querySelectorAll('.dot').forEach(dot => {
                dot.addEventListener('click', () => {
                    const sectionId = dot.getAttribute('data-section');
                    gsap.to(window, {
                        duration: 1.2,
                        scrollTo: `#${sectionId}`,
                        ease: "power2.inOut"
                    });
                });
            });
        }
    }

    // Initialize nav dots
    document.querySelectorAll('.dot')[0]?.classList.add('active');
})();
