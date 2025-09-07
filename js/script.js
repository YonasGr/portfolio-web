document.addEventListener('DOMContentLoaded', () => {
    const DOMElements = {
        contactForm: document.getElementById('contactForm'),
        formMessage: document.getElementById('formMessage'),
        nameInput: document.getElementById('name'),
        emailInput: document.getElementById('email'),
        messageInput: document.getElementById('message')
    };

    const BACKEND_URL = 'https://yonasgirma-backend-service.onrender.com/send-message';

    // Function to display messages to the user
    function showMessage(text, type) {
        if (!DOMElements.formMessage) return;
        DOMElements.formMessage.textContent = text;
        DOMElements.formMessage.className = `form-message ${type}`;

        setTimeout(() => {
            DOMElements.formMessage.textContent = '';
            DOMElements.formMessage.className = 'form-message';
        }, 5000); // Message disappears after 5 seconds
    }

    // Handle form submission
    if (DOMElements.contactForm) {
        DOMElements.contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = DOMElements.contactForm.querySelector('.submit-btn');
            const originalBtnText = submitBtn.innerHTML;

            submitBtn.innerHTML = '<span>Sending...</span>';
            submitBtn.disabled = true;

            const data = {
                name: DOMElements.nameInput.value,
                email: DOMElements.emailInput.value,
                message: DOMElements.messageInput.value,
            };

            try {
                const response = await fetch(BACKEND_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (response.ok) {
                    showMessage('Message sent successfully! I will get back to you soon.', 'success');
                    DOMElements.contactForm.reset();
                } else {
                    showMessage(result.message || 'Failed to send message. Please try again.', 'error');
                    console.error('Backend error:', result);
                }
            } catch (error) {
                showMessage('An error occurred. Please check your internet connection and try again.', 'error');
                console.error('Error sending message:', error);
            } finally {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }

    // A simple animation for sections as they come into view
    // Select all standard sections including the new certificates section
    const sections = document.querySelectorAll('.standard-section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => {
        observer.observe(section);
    });

    // Animate progress bars
    const progressBars = document.querySelectorAll('.progress');
    progressBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0%';
        
        const barObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    bar.style.transition = 'width 1.5s ease-in-out';
                    bar.style.width = width;
                    barObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.8 });

        barObserver.observe(bar);
    });
});